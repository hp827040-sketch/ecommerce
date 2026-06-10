import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

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

  await prisma.product.createMany({
    data: [
      {
        name: 'Fresh Tomatoes',
        description: 'Farm-fresh red tomatoes',
        price: 40,
        stock: 100,
        categoryId: vegCategory.id,
        status: 'ACTIVE',
        isTodaySpecial: true,
      },
      {
        name: 'Green Spinach',
        description: 'Organic leafy spinach',
        price: 30,
        stock: 80,
        categoryId: vegCategory.id,
        status: 'ACTIVE',
        isTodaySpecial: true,
      },
      {
        name: 'Onions (1kg)',
        description: 'Premium quality onions',
        price: 35,
        stock: 150,
        categoryId: vegCategory.id,
        status: 'ACTIVE',
        isTodaySpecial: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed');
  console.log('Admin:    ', admin.email, '| Password: admin123');
  console.log('Customer: ', customer.email, '| Password: customer123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
