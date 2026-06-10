import { prisma } from '../../config/prisma.js';

export const createEnquiry = async (data) => {
  return prisma.enquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source || 'LANDING',
    },
  });
};

export const getEnquiries = async (filters = {}) => {
  const where = {};
  if (filters.source) where.source = filters.source;
  if (filters.isRead !== undefined) where.isRead = filters.isRead === 'true';

  return prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const markAsRead = async (id) => {
  return prisma.enquiry.update({
    where: { id },
    data: { isRead: true },
  });
};

export const updateEnquiry = async (id, data) => {
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) {
    const err = new Error('Enquiry not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.enquiry.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.message !== undefined && { message: data.message }),
      ...(data.source !== undefined && { source: data.source }),
      ...(data.isRead !== undefined && { isRead: data.isRead }),
    },
  });
};

export const deleteEnquiry = async (id) => {
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) {
    const err = new Error('Enquiry not found');
    err.statusCode = 404;
    throw err;
  }

  await prisma.enquiry.delete({ where: { id } });
  return { id };
};
