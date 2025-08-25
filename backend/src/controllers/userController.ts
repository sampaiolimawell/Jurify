// Importação dos módulos necessários para o controlador de usuários
import { Request, Response } from 'express';    // Tipos para requisição e resposta do Express
import { PrismaClient } from '@prisma/client';  // Cliente Prisma para acesso ao banco de dados
import bcrypt from 'bcrypt';                   // Biblioteca para hash de senhas
import jwt from 'jsonwebtoken';                // Biblioteca para geração e verificação de tokens JWT

// Inicialização do cliente Prisma para interação com o banco de dados
const prisma = new PrismaClient();

// Função para registrar um novo usuário
// Recebe username e password, cria o usuário no banco de dados
export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: username, // Using username as email since email is required
                username,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

// Função para autenticar um usuário
// Verifica credenciais e gera token JWT para acesso ao sistema
export const loginUser = async (req: Request, res: Response) => {
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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Função para obter o perfil do usuário autenticado
// Usa o ID do usuário definido pelo middleware de autenticação
export const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.userId; // Assuming userId is set in the auth middleware

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Retorna o usuário no formato esperado pelo frontend
        res.json({ user: user });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};