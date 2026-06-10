import { prisma } from '../../config/prisma.js';

export const getDashboard = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [user, recentOrders, todayProducts, activeOrder] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, address: true },
    }),
    prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: { select: { name: true, image: true } } } },
      },
    }),
    prisma.product.findMany({
      where: { isTodaySpecial: true, status: 'ACTIVE' },
      take: 8,
      include: { category: { select: { name: true } } },
    }),
    prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['PENDING', 'PACKING', 'OUT_FOR_DELIVERY'] },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const lastOrder = recentOrders[0];

  return {
    user,
    recentOrders,
    todayProducts,
    deliveryStatus: activeOrder,
    quickReorder: lastOrder?.items || [],
  };
};

export const updateProfile = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone && { phone: data.phone }),
      ...(data.address && { address: data.address }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
    },
  });
};
