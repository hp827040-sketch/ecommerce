import { prisma } from '../../config/prisma.js';
import { clearCart } from '../cart/cart.service.js';

const orderInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, image: true } },
    },
  },
  user: { select: { id: true, name: true, email: true, phone: true } },
  invoice: true,
};

export const createOrder = async (userId, orderData) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!cart?.items?.length) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      const err = new Error(`Insufficient stock for ${item.product.name}`);
      err.statusCode = 400;
      throw err;
    }
  }

  const total = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        paymentMethod: orderData.paymentMethod,
        address: orderData.address,
        phone: orderData.phone,
        notes: orderData.notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: orderInclude,
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    await tx.user.update({
      where: { id: userId },
      data: {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
      },
    });

    return newOrder;
  });

  return order;
};

export const getOrders = async (filters = {}) => {
  const where = {};
  if (filters.userId) where.userId = filters.userId;
  if (filters.status) where.status = filters.status;

  return prisma.order.findMany({
    where,
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderById = async (id, userId = null) => {
  const where = { id };
  if (userId) where.userId = userId;

  const order = await prisma.order.findFirst({
    where,
    include: orderInclude,
  });

  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  return order;
};

export const updateOrderStatus = async (id, status) => {
  await getOrderById(id);

  return prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });
};

export const deleteOrder = async (id) => {
  const order = await getOrderById(id);

  await prisma.$transaction(async (tx) => {
    if (order.status !== 'CANCELLED') {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    await tx.order.delete({ where: { id } });
  });

  return { id };
};
