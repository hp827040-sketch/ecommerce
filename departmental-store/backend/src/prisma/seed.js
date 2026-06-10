import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { deriveProductStatus } from '../utils/productStatus.js';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@freshbasket.com' },
    update: {},
    create: {
      name: 'Store Admin',
      email: 'admin@freshbasket.com',
      phone: '9876543210',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@freshbasket.com' },
    update: {},
    create: {
      name: 'Demo Customer',
      email: 'customer@freshbasket.com',
      phone: '9123456789',
      password: customerPassword,
      role: 'CUSTOMER',
      address: '12 Green Valley Apartments, Main Road, Your City - 400001',
    },
  });

  await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  const categories = await Promise.all(
    ['Vegetables', 'Fruits', 'Groceries', 'Daily Essentials'].map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name, status: 'ACTIVE' },
      })
    )
  );

  const vegCategory = categories.find((c) => c.name === 'Vegetables');

  const productSeeds = [
    {
      name: 'Fresh Tomatoes',
      description: 'Farm-fresh red tomatoes',
      unit: 'kg',
      price: 45,
      oldPrice: 55,
      offerPrice: 40,
      stock: 100,
      categoryId: vegCategory.id,
      isTodaySpecial: true,
    },
    {
      name: 'Green Spinach',
      description: 'Organic leafy spinach',
      unit: 'bunch',
      price: 35,
      oldPrice: 40,
      offerPrice: 30,
      stock: 80,
      categoryId: vegCategory.id,
      isTodaySpecial: true,
    },
    {
      name: 'Onions',
      description: 'Premium quality onions',
      unit: 'kg',
      price: 35,
      stock: 150,
      categoryId: vegCategory.id,
      isTodaySpecial: false,
    },
  ];

  for (const seed of productSeeds) {
    const existing = await prisma.product.findFirst({ where: { name: seed.name } });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...seed,
          status: deriveProductStatus(existing.stock, existing.status),
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...seed,
          status: deriveProductStatus(seed.stock, 'ACTIVE'),
        },
      });
    }
  }

  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    const status = deriveProductStatus(product.stock, product.status);
    const unit = product.unit ?? (product.name.includes('(1kg)') ? 'kg' : null);
    if (status !== product.status || unit !== product.unit) {
      await prisma.product.update({
        where: { id: product.id },
        data: { status, ...(unit && { unit }) },
      });
    }
  }

  console.log('✅ Seed completed');
  console.log('Admin:    ', admin.email, '| Password: admin123');
  console.log('Customer: ', customer.email, '| Password: customer123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
