// Importação dos módulos necessários para as rotas de consulta processual
import { Router } from 'express';  // Router do Express para definição de rotas
import { consultarProcessos } from '../controllers/consultaProcessualController';  // Controlador de consulta processual
import { authenticateJWT } from '../middlewares/authMiddleware';  // Middleware de autenticação JWT

// Inicialização do router para as rotas de consulta processual
const router = Router();

// Rota para realizar consulta processual na API externa
// POST /api/consulta-processual/consulta - Consulta processos por CPF, CNPJ ou número
router.post('/consulta', authenticateJWT, consultarProcessos);

export default router;