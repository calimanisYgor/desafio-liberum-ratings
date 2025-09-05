import { Router } from 'express';
import { registerController, loginController } from './auth.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { UserRole } from '../../entities/User';

const router = Router();

// Apenas um admin logado pode registrar novos usuários
router.post('/register', authMiddleware([UserRole.ADMIN]), registerController);
router.post('/login', loginController);

export default router;