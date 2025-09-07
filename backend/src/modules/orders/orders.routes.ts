import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { UserRole } from '../../entities/User';
import {
  createOrderController,
  listOrdersController,
  updateOrderStatusController,
} from './orders.controller';

const router = Router();

router.use(authMiddleware());

router.post('/', createOrderController);
router.get('/', listOrdersController);


router.patch(
  '/:id/status',
  authMiddleware([UserRole.ADMIN]),
  updateOrderStatusController
);

export default router;