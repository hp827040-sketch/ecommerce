import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma.js';

const SALT_ROUNDS = 10;

const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  createdAt: true,
  _count: { select: { orders: true } },
};

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todayOrders,
    pendingOrders,
    deliveredOrders,
    totalCustomers,
    revenueResult,
    recentOrders,
    unreadEnquiries,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.enquiry.count({ where: { isRead: false } }),
  ]);

  return {
    todayOrders,
    pendingOrders,
    deliveredOrders,
    totalCustomers,
    revenue: Number(revenueResult._sum.total || 0).toFixed(2),
    recentOrders,
    unreadEnquiries,
  };
};

export const getCustomers = async () => {
  return prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: customerSelect,
    orderBy: { createdAt: 'desc' },
  });
};

export const createCustomer = async (data) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      address: data.address,
      role: 'CUSTOMER',
    },
    select: customerSelect,
  });

  await prisma.cart.create({ data: { userId: user.id } });
  return user;
};

export const updateCustomer = async (id, data) => {
  await getCustomerById(id);

  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, id: { not: id } },
    });
    if (existing) {
      const err = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }
  }

  const updateData = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: customerSelect,
  });
};

export const deleteCustomer = async (id) => {
  const customer = await prisma.user.findFirst({
    where: { id, role: 'CUSTOMER' },
    include: { _count: { select: { orders: true } } },
  });

  if (!customer) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }

  if (customer._count.orders > 0) {
    const err = new Error('Cannot delete customer with existing orders');
    err.statusCode = 400;
    throw err;
  }

  await prisma.cart.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
  return { id };
};

export const getCustomerById = async (id) => {
  const customer = await prisma.user.findFirst({
    where: { id, role: 'CUSTOMER' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      },
    },
  });

  if (!customer) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }

  return customer;
};
