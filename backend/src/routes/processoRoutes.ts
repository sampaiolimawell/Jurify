// Importação dos módulos necessários para as rotas de processos judiciais
import { Router } from 'express';  // Router do Express para definição de rotas
import { 
    createProcesso,     // Controlador para criar processo
    getAllProcessos,    // Controlador para listar todos os processos
    getProcessoById,    // Controlador para buscar processo por ID
    updateProcesso,     // Controlador para atualizar processo
    deleteProcesso      // Controlador para excluir processo
} from '../controllers/processoController';
import { authenticateJWT } from '../middlewares/authMiddleware';  // Middleware de autenticação JWT

// Inicialização do router para as rotas de processos
const router = Router();

// Rota para criar um novo processo judicial
// POST /api/processos - Cria um novo registro de processo
router.post('/', authenticateJWT, createProcesso);

// Rota para obter todos os processos judiciais
// GET /api/processos - Retorna lista de todos os processos
router.get('/', authenticateJWT, getAllProcessos);

// Rota para obter um processo judicial específico por ID
// GET /api/processos/:id - Retorna detalhes de um processo
router.get('/:id', authenticateJWT, getProcessoById);

// Rota para atualizar um processo judicial existente
// PUT /api/processos/:id - Atualiza dados de um processo específico
router.put('/:id', authenticateJWT, updateProcesso);

// Rota para excluir um processo judicial
// DELETE /api/processos/:id - Remove um processo específico
router.delete('/:id', authenticateJWT, deleteProcesso);

export default router;