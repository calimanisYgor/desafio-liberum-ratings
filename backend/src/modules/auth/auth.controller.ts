import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import * as AuthService from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse({ body: req.body });
  const user = await AuthService.register(validatedData.body);
  return res.status(201).json(user);
};

export const loginController = async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse({ body: req.body });
  const tokens = await AuthService.login(validatedData.body);
  return res.status(200).json(tokens);
};
