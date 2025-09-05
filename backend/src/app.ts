import "dotenv/config";
import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from  "./modules/products/products.routes"
import orderRoutes from  "./modules/orders/orders.routes"
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(errorMiddleware);

export default app;
