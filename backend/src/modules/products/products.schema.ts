import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(5),
    description: z.string(),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
  }),
  params: z.object({
    id: z.uuid("Invalid UUID format"),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    name: z.string().optional(),
    sortBy: z.string().optional().default("createdAt"),
    order: z.enum(["ASC", "DESC"]).optional().default("DESC"),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid UUID format"),
  }),
});
