import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  createOrderController,
  listOrderController,
  updateOrderController,
} from "./orders.controller";
import { UserRole } from "../../entities/User";

const router = Router();

router.use(authMiddleware);

router.post("/", createOrderController);
router.get("/", listOrderController);

router.patch("/:id", authMiddleware([UserRole.ADMIN]), updateOrderController);

export default router;
