import { z } from 'zod';
import { OrderStatus } from '../../entities/Order';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.uuid(),
        quantity: z.number().int().positive(),
      })
    ).min(1, 'Order must contain at least one item'),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    status: z.enum(OrderStatus),
  }),
});

export const listOrdersSchema = z.object({
  query: z.object({
    status: z.enum(OrderStatus).optional(),
  }),
});