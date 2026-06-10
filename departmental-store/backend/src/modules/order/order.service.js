import { prisma } from '../../config/prisma.js';
import { clearCart } from '../cart/cart.service.js';
import { getSellingPrice } from '../../utils/productPrice.js';
import { applyStockChange } from '../../utils/productStatus.js';

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
    (sum, item) => sum + getSellingPrice(item.product) * item.quantity,
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
            price: getSellingPrice(item.product),
          })),
        },
      },
      include: orderInclude,
    });

    for (const item of cart.items) {
      await applyStockChange(tx, item.productId, -item.quantity);
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

const adjustStockForStatusChange = async (tx, order, nextStatus) => {
  if (nextStatus === order.status) return;

  if (nextStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
    for (const item of order.items) {
      await applyStockChange(tx, item.productId, item.quantity);
    }
    return;
  }

  if (order.status === 'CANCELLED' && nextStatus !== 'CANCELLED') {
    for (const item of order.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (product.stock < item.quantity) {
        const err = new Error(`Insufficient stock for ${product.name}`);
        err.statusCode = 400;
        throw err;
      }
    }
    for (const item of order.items) {
      await applyStockChange(tx, item.productId, -item.quantity);
    }
  }
};

export const createAdminOrder = async (data) => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }

  if (!data.items?.length) {
    const err = new Error('Order must include at least one item');
    err.statusCode = 400;
    throw err;
  }

  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== new Set(productIds).size) {
    const err = new Error('One or more products not found');
    err.statusCode = 400;
    throw err;
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let total = 0;

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (product.stock < item.quantity) {
      const err = new Error(`Insufficient stock for ${product.name}`);
      err.statusCode = 400;
      throw err;
    }
    total += getSellingPrice(product) * item.quantity;
  }

  const status = data.status || 'PENDING';
  const shouldReserveStock = status !== 'CANCELLED';

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        total,
        status,
        paymentMethod: data.paymentMethod || 'COD',
        address: data.address,
        phone: data.phone,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: getSellingPrice(productMap.get(item.productId)),
          })),
        },
      },
      include: orderInclude,
    });

    if (shouldReserveStock) {
      for (const item of data.items) {
        await applyStockChange(tx, item.productId, -item.quantity);
      }
    }

    await tx.user.update({
      where: { id: data.userId },
      data: {
        ...(data.name && { name: data.name }),
        phone: data.phone,
        address: data.address,
      },
    });

    return order;
  });
};

export const updateOrder = async (id, data) => {
  const order = await getOrderById(id);
  const { status, ...rest } = data;

  return prisma.$transaction(async (tx) => {
    if (status) {
      await adjustStockForStatusChange(tx, order, status);
    }

    return tx.order.update({
      where: { id },
      data: {
        ...(rest.phone && { phone: rest.phone }),
        ...(rest.address && { address: rest.address }),
        ...(rest.notes !== undefined && { notes: rest.notes }),
        ...(rest.paymentMethod && { paymentMethod: rest.paymentMethod }),
        ...(status && { status }),
      },
      include: orderInclude,
    });
  });
};

export const updateOrderStatus = async (id, status) => {
  return updateOrder(id, { status });
};

export const deleteOrder = async (id) => {
  const order = await getOrderById(id);

  await prisma.$transaction(async (tx) => {
    if (order.status !== 'CANCELLED') {
      for (const item of order.items) {
        await applyStockChange(tx, item.productId, item.quantity);
      }
    }

    await tx.order.delete({ where: { id } });
  });

  return { id };
};
