import { Request, Response } from "express";
import {
  createOrderSchema,
  listOrdersSchema,
  updateOrderStatusSchema,
} from "./orders.schema";
import * as OrderService from "./orders.service";

export const createOrderController = async (req: Request, res: Response) => {
  const { body } = createOrderSchema.parse(req);
  const userId = req.user.id; // Id obtido através do AuthMiddleware

  const order = await OrderService.createOrder({ userId, items: body.items });
  res.status(201).json(order);
};

export const listOrderController = async (req: Request, res: Response) => {
  const { query } = listOrdersSchema.parse(req);
  const user = req.user;

  const orders = await OrderService.listOrders({ user, status: query.status });
  res.status(200).json(orders);
};

export const updateOrderController = async (req: Request, res: Response) => {
  const { params, body } = updateOrderStatusSchema.parse(req);

  const order = await OrderService.updateOrderStatus(params.id, body.status);
  res.status(200).json(order);
};
