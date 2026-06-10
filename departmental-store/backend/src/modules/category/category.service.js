import { prisma } from '../../config/prisma.js';

export const getCategories = async (filters = {}) => {
  const where = {};
  if (filters.status) where.status = filters.status;

  return prisma.category.findMany({
    where,
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
};

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }

  return category;
};

export const createCategory = async (data, image) => {
  return prisma.category.create({
    data: {
      name: data.name,
      status: data.status || 'ACTIVE',
      image: image || null,
    },
  });
};

export const updateCategory = async (id, data, image) => {
  await getCategoryById(id);

  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.status && { status: data.status }),
      ...(image && { image }),
    },
  });
};

export const deleteCategory = async (id) => {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    const err = new Error('Cannot delete category with existing products');
    err.statusCode = 400;
    throw err;
  }

  return prisma.category.delete({ where: { id } });
};
