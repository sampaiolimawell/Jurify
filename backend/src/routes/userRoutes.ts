// Importação dos módulos necessários para as rotas de usuários
import { Router } from 'express';                                                  // Router do Express para definição de rotas
import { registerUser, loginUser, getUserProfile } from '../controllers/userController';  // Controladores de usuários
import authMiddleware from '../middlewares/authMiddleware';                        // Middleware de autenticação

// Inicialização do router para as rotas de usuários
const router = Router();

// Rota para registro de novos usuários
// POST /api/users/register - Cria uma nova conta de usuário
router.post('/register', registerUser);

// Rota para login de usuários
// POST /api/users/login - Autentica usuário e retorna token JWT
router.post('/login', loginUser);

// Rota para obter perfil do usuário (protegida por autenticação)
// GET /api/users/profile - Retorna dados do usuário autenticado
router.get('/profile', authMiddleware, getUserProfile);

export default router;