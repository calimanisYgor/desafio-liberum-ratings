import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do produto deve conter no mínimo 3 caracteres"),
  description: z.string(),
  price: z.coerce.number().positive("O preçco deve ser um número positivo"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("O estoque dever ser um número inteiro não negativo"),
});

export type ProductFormData = z.infer<typeof productSchema>;
