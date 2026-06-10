import { z } from 'zod';

export const createEnquirySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(10),
    source: z.enum(['LANDING', 'CUSTOMER', 'CONTACT']).optional(),
  }),
});

export const updateEnquirySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    message: z.string().min(10).optional(),
    source: z.enum(['LANDING', 'CUSTOMER', 'CONTACT']).optional(),
    isRead: z.boolean().optional(),
  }),
});

export const enquiryIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
