import "dotenv/config";
import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);


app.use(errorMiddleware);

export default app;
