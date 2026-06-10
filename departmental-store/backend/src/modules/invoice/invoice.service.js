import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';

const generateInvoiceNumber = () => {
  const date = new Date();
  const prefix = `HB${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}-${random}`;
};

const generatePdf = (order, invoiceNumber) => {
  return new Promise((resolve, reject) => {
    const uploadPath = path.resolve(env.uploadDir, 'invoices');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filename = `${invoiceNumber}.pdf`;
    const filepath = path.join(uploadPath, filename);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    doc.fontSize(20).text('HariBasket', { align: 'center' });
    doc.fontSize(12).text('Fresh Vegetables & Departmental Store', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Invoice: ${invoiceNumber}`);
    doc.text(`Order ID: ${order.id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.moveDown();

    doc.fontSize(12).text('Items:', { underline: true });
    order.items.forEach((item) => {
      doc.text(
        `${item.product.name} x ${item.quantity} — ₹${Number(item.price).toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: ₹${Number(order.total).toFixed(2)}`, { align: 'right' });
    doc.text(`Payment: ${order.paymentMethod}`, { align: 'right' });
    doc.text(`Status: ${order.status}`, { align: 'right' });

    doc.end();

    stream.on('finish', () => resolve(`/uploads/invoices/${filename}`));
    stream.on('error', reject);
  });
};

export const generateInvoice = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      user: true,
      invoice: true,
    },
  });

  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  if (order.invoice) {
    return order.invoice;
  }

  const invoiceNumber = generateInvoiceNumber();
  const pdfUrl = await generatePdf(order, invoiceNumber);

  return prisma.invoice.create({
    data: { orderId, invoiceNumber, pdfUrl },
  });
};

export const getInvoices = async () => {
  return prisma.invoice.findMany({
    include: {
      order: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getInvoiceById = async (id) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          items: { include: { product: true } },
          user: true,
        },
      },
    },
  });

  if (!invoice) {
    const err = new Error('Invoice not found');
    err.statusCode = 404;
    throw err;
  }

  return invoice;
};

export const deleteInvoice = async (id) => {
  const invoice = await getInvoiceById(id);

  if (invoice.pdfUrl) {
    const filepath = path.resolve(env.uploadDir, invoice.pdfUrl.replace('/uploads/', ''));
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  await prisma.invoice.delete({ where: { id } });
  return { id };
};
