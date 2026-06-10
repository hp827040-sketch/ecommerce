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

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.enum(['PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({ id: z.string() }),
});
