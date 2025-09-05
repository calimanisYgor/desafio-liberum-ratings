import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../shared/AppError";
import { AppDataSource } from "../database/data-source";
import { User, UserRole } from "../entities/User";

interface TokenPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export const authMiddleware = (roles: UserRole[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new AppError("Authorization token not provided", 401);
    }

    const [, token] = authorization.split(" ");

    try {
      const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      const { id, role } = data as TokenPayload;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id });
      console.log(user);

      if (!user) {
        throw new AppError("User not found", 401);
      }

      req.user = { id, role };

      if (roles.length > 0 && !roles.includes(role)) {
        throw new AppError("Forbidden", 403);
      }

      return next();
    } catch {
      throw new AppError("Invalid token", 401);
    }
  };
};
