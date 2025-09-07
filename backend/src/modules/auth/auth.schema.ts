import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(5),
    email: z.email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
});
