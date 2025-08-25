import { Router } from 'express';
import { createDecisao, getAllDecisoes, getDecisaoById, updateDecisao, deleteDecisao } from '../controllers/decisaoController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, createDecisao);

router.get('/', authenticateJWT, getAllDecisoes);


router.get('/:id', authenticateJWT, getDecisaoById);

router.put('/:id', authenticateJWT, updateDecisao);

router.delete('/:id', authenticateJWT, deleteDecisao);

export default router;