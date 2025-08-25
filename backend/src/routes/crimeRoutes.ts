// Importação dos módulos necessários para as rotas de crimes
import { Router } from 'express';  // Router do Express para definição de rotas
import { createCrime, getCrimes, getCrimeById, updateCrime, deleteCrime } from '../controllers/crimeController';  // Controladores de crimes
import { authenticateJWT } from '../middlewares/authMiddleware';  // Middleware de autenticação JWT

// Inicialização do router para as rotas de crimes
const router = Router();

// Rota para criar um novo registro de crime
// POST /api/crimes - Cria um novo registro de crime
router.post('/', authenticateJWT, createCrime);

// Rota para obter todos os registros de crimes
// GET /api/crimes - Retorna lista de todos os crimes
router.get('/', authenticateJWT, getCrimes);

// Rota para obter um registro de crime específico por ID
// GET /api/crimes/:id - Retorna detalhes de um crime
router.get('/:id', authenticateJWT, getCrimeById);

// Rota para atualizar um registro de crime existente
// PUT /api/crimes/:id - Atualiza dados de um crime específico
router.put('/:id', authenticateJWT, updateCrime);

// Rota para excluir um registro de crime
// DELETE /api/crimes/:id - Remove um crime específico
router.delete('/:id', authenticateJWT, deleteCrime);

export default router;