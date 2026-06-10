import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().min(5),
    notes: z.string().optional(),
    paymentMethod: z.enum(['COD', 'UPI', 'CARD']).default('COD'),
  }),
});

export const createAdminOrderSchema = z.object({
  body: z.object({
    userId: z.string(),
    items: z
      .array(
        z.object({
          productId: z.string(),
          quantity: z.coerce.number().int().min(1),
        })
      )
      .min(1),
    name: z.string().min(2).optional(),
    phone: z.string().min(10),
    address: z.string().min(5),
    notes: z.string().optional(),
    paymentMethod: z.enum(['COD', 'UPI', 'CARD']).default('COD'),
    status: z
      .enum(['PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])
      .optional(),
  }),
});

export const updateOrderSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    phone: z.string().min(10).optional(),
    address: z.string().min(5).optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(['COD', 'UPI', 'CARD']).optional(),
    status: z.enum(['PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']).optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.enum(['PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({ id: z.string() }),
});
