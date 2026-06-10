import { prisma } from '../../config/prisma.js';

const cartInclude = {
  items: {
    include: {
      product: {
        include: { category: { select: { id: true, name: true } } },
      },
    },
  },
};

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  return cart;
};

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: subtotal.toFixed(2),
    total: subtotal.toFixed(2),
  };
};

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return { ...cart, summary: calculateTotals(cart.items) };
};

export const addToCart = async (userId, { productId, quantity }) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || product.status !== 'ACTIVE') {
    const err = new Error('Product not available');
    err.statusCode = 400;
    throw err;
  }

  if (product.stock < quantity) {
    const err = new Error('Insufficient stock');
    err.statusCode = 400;
    throw err;
  }

  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  return getCart(userId);
};

export const updateCartItem = async (userId, { productId, quantity }) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId === productId);

  if (!item) {
    const err = new Error('Item not in cart');
    err.statusCode = 404;
    throw err;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (product.stock < quantity) {
    const err = new Error('Insufficient stock');
    err.statusCode = 400;
    throw err;
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });

  return getCart(userId);
};

export const removeFromCart = async (userId, { productId }) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId === productId);

  if (!item) {
    const err = new Error('Item not in cart');
    err.statusCode = 404;
    throw err;
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
  return getCart(userId);
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getCart(userId);
};
