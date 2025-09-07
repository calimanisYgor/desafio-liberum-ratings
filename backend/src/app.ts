import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/products.routes";
import orderRoutes from "./modules/orders/orders.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use(errorMiddleware);

export default app;
