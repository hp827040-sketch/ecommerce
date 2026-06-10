import { prisma } from '../../config/prisma.js';
import { deriveProductStatus } from '../../utils/productStatus.js';

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
  const status = deriveProductStatus(data.stock, data.status || 'ACTIVE');

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      unit: data.unit || null,
      price: data.price,
      oldPrice: data.oldPrice ?? null,
      offerPrice: data.offerPrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId,
      status,
      isTodaySpecial: data.isTodaySpecial || false,
      image: image || null,
    },
    include: { category: true },
  });
};

export const updateProduct = async (id, data, image) => {
  const existing = await getProductById(id);
  const stock = data.stock !== undefined ? data.stock : existing.stock;

  const updateData = {
    ...(data.name && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.unit !== undefined && { unit: data.unit || null }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.oldPrice !== undefined && { oldPrice: data.oldPrice ?? null }),
    ...(data.offerPrice !== undefined && { offerPrice: data.offerPrice ?? null }),
    ...(data.stock !== undefined && { stock: data.stock }),
    ...(data.categoryId && { categoryId: data.categoryId }),
    ...(data.isTodaySpecial !== undefined && { isTodaySpecial: data.isTodaySpecial }),
    ...(image && { image }),
  };

  if (data.status !== undefined) {
    updateData.status = deriveProductStatus(stock, data.status);
  } else if (data.stock !== undefined) {
    updateData.status = deriveProductStatus(stock, existing.status);
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: { category: true },
  });
};

export const deleteProduct = async (id) => {
  await getProductById(id);
  return prisma.product.delete({ where: { id } });
};
