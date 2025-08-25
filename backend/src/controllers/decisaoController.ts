import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createDecisao = async (req: Request, res: Response) => {
    const { descricao, data, processoId } = req.body;

    try {
        const decisao = await prisma.decisao.create({
            data: {
                descricao,
                data: new Date(data),
                processoId,
            },
        });
        res.status(201).json(decisao);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create decision' });
    }
};

export const getAllDecisoes = async (req: Request, res: Response) => {
    try {
        const decisoes = await prisma.decisao.findMany();
        res.status(200).json(decisoes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve decisions' });
    }
};

export const getDecisaoById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const decisao = await prisma.decisao.findUnique({
            where: { id: Number(id) },
        });
        if (decisao) {
            res.status(200).json(decisao);
        } else {
            res.status(404).json({ error: 'Decision not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve decision' });
    }
};

// Função para atualizar uma decisão judicial existente
// Recebe ID e novos dados para atualização no banco
export const updateDecisao = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { descricao, data } = req.body;

    try {
        const decisao = await prisma.decisao.update({
            where: { id: Number(id) },
            data: {
                descricao,
                data: new Date(data),
            },
        });
        res.status(200).json(decisao);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update decision' });
    }
};

export const deleteDecisao = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.decisao.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete decision' });
    }
};