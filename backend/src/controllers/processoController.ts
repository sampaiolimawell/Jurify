// Importação dos módulos necessários para o controlador de processos judiciais
import { Request, Response } from 'express';  // Tipos para requisição e resposta do Express
import prisma from '../prisma/client';       // Cliente Prisma para acesso ao banco de dados

// Função para criar um novo processo judicial
// Recebe dados do processo e associa ao usuário autenticado
export const createProcesso = async (req: Request, res: Response) => {
    try {
        const { numero, descricao, status } = req.body;
        const userId = (req as any).userId;
        const processo = await prisma.processo.create({
            data: {
                numero,
                descricao,
                status,
                userId,
            },
        });
        res.status(201).json(processo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create judicial process' });
    }
};

// Função para obter todos os processos judiciais cadastrados
// Retorna lista completa de processos do banco de dados
export const getAllProcessos = async (req: Request, res: Response) => {
    try {
        const processos = await prisma.processo.findMany();
        res.status(200).json(processos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve judicial processes' });
    }
};

// Função para obter um processo judicial específico pelo ID
// Busca e retorna detalhes de um único processo
export const getProcessoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const processo = await prisma.processo.findUnique({
            where: { id: Number(id) },
        });
        if (!processo) {
            return res.status(404).json({ error: 'Judicial process not found' });
        }
        res.status(200).json(processo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve judicial process' });
    }
};

// Função para atualizar um processo judicial existente
// Recebe ID e novos dados para atualização no banco
export const updateProcesso = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { numero, descricao, status } = req.body;
    try {
        const processo = await prisma.processo.update({
            where: { id: Number(id) },
            data: { numero, descricao, status },
        });
        res.status(200).json(processo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update judicial process' });
    }
};

// Função para excluir um processo judicial
// Remove permanentemente o processo do banco de dados
export const deleteProcesso = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.processo.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete judicial process' });
    }
};