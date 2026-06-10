import { prisma } from '../../config/prisma.js';

export const getProducts = async (filters = {}) => {
  const where = {};

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.status) where.status = filters.status;
  if (filters.isTodaySpecial !== undefined) where.isTodaySpecial = filters.isTodaySpecial;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  return prisma.product.findMany({
    where,
    include: { category: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  return product;
};

export const createProduct = async (data, image) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      status: data.status || 'ACTIVE',
      isTodaySpecial: data.isTodaySpecial || false,
      image: image || null,
    },
    include: { category: true },
  });
};

export const updateProduct = async (id, data, image) => {
  await getProductById(id);

  return prisma.product.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.status && { status: data.status }),
      ...(data.isTodaySpecial !== undefined && { isTodaySpecial: data.isTodaySpecial }),
      ...(image && { image }),
    },
    include: { category: true },
  });
};

export const deleteProduct = async (id) => {
  await getProductById(id);
  return prisma.product.delete({ where: { id } });
};
