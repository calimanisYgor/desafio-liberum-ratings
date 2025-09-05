import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { UserRole } from "../../entities/User";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  listProductsController,
  updateProductController,
} from "./products.controller";

const router = Router();

router.get("/", listProductsController);
router.get("/:id", getProductByIdController);


router.post("/", authMiddleware([UserRole.ADMIN]), createProductController);
router.patch("/:id", authMiddleware([UserRole.ADMIN]), updateProductController);
router.delete(
  "/:id",
  authMiddleware([UserRole.ADMIN]),
  deleteProductController
);

export default router;
