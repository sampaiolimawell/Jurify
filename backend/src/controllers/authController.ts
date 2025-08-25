// Importação dos módulos necessários para o controlador de autenticação
import { Request, Response } from 'express';  // Tipos para requisição e resposta do Express
import bcrypt from 'bcrypt';                 // Biblioteca para hash de senhas
import jwt from 'jsonwebtoken';              // Biblioteca para geração e verificação de tokens JWT
import prisma from '../prisma/client';        // Cliente Prisma para acesso ao banco de dados

// Define a chave secreta para assinatura dos tokens JWT (usa variável de ambiente ou valor padrão)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Função para registrar um novo usuário no sistema
// Recebe dados do usuário, cria registro no banco e retorna token de autenticação
export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        
        // Gerar token após o registro bem-sucedido
        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ 
            message: 'User created successfully', 
            token,
            user: { 
                id: newUser.id, 
                username: newUser.username, 
                email: newUser.email 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
};

// Função para autenticar um usuário existente
// Verifica credenciais, gera token JWT e retorna dados do usuário
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};