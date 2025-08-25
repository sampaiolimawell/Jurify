import { Request, Response } from 'express';
import prisma from '../prisma/client';



// Função para obter todos os registros de crimes cadastrados
// Retorna lista completa de crimes do banco de dados
export const getCrimes = async (req: Request, res: Response) => {
    try {
        const crimes = await prisma.crime.findMany();
        res.json(crimes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch crimes' });
    }
};

// Função para obter um registro de crime específico pelo ID
// Busca e retorna detalhes de um único crime
export const getCrimeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const crime = await prisma.crime.findUnique({
            where: { id: Number(id) },
        });
        if (!crime) {
            return res.status(404).json({ error: 'Crime record not found' });
        }
        res.status(200).json(crime);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve crime record' });
    }
};

// Função para criar um novo registro de crime
// Recebe dados do crime e associa a um processo existente
export const createCrime = async (req: Request, res: Response) => {
    const { tipo, descricao, data } = req.body;
    try {
        const newCrime = await prisma.crime.create({
            data: {
                tipo,
                descricao,
                data: new Date(data),
            },
        });
        res.status(201).json(newCrime);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create crime' });
    }
};

// Função para atualizar um registro de crime existente
// Recebe ID e novos dados para atualização no banco
export const updateCrime = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tipo, descricao, data } = req.body;
    try {
        const updatedCrime = await prisma.crime.update({
            where: { id: Number(id) },
            data: {
                tipo,
                descricao,
                data: new Date(data),
            },
        });
        res.json(updatedCrime);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update crime' });
    }
};

// Função para excluir um registro de crime
// Remove permanentemente o crime do banco de dados
export const deleteCrime = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.crime.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete crime' });
    }
};