import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    stock: z.coerce.number().int().min(0),
    categoryId: z.string(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
    isTodaySpecial: z.coerce.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().min(0).optional(),
    categoryId: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
    isTodaySpecial: z.coerce.boolean().optional(),
  }),
});

export const productIdSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const productQuerySchema = z.object({
  query: z.object({
    categoryId: z.string().optional(),
    status: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    isTodaySpecial: z.coerce.boolean().optional(),
    search: z.string().optional(),
  }),
});
