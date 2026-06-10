import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string(),
    quantity: z.coerce.number().int().min(1).default(1),
  }),
});

export const updateCartSchema = z.object({
  body: z.object({
    productId: z.string(),
    quantity: z.coerce.number().int().min(1),
  }),
});

export const removeFromCartSchema = z.object({
  body: z.object({
    productId: z.string(),
  }),
});
