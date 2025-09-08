import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/AppError";

interface IErrorPayload {
  status: "fail" | "error";
  statusCode: number;
  message: string;
}

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorPayload: IErrorPayload;
  console.log(error)
  if (error instanceof AppError && error.isOperational) {
    errorPayload = {
      status: "fail",
      statusCode: error.statusCode,
      message: error.message,
    };
  } else {

    errorPayload = {
      status: "error",
      statusCode: 500,
      message:
        "Internal server error. Please try again later or contact support if the problem persists.",
    };
  }

  res.status(errorPayload.statusCode).json(errorPayload);
};
