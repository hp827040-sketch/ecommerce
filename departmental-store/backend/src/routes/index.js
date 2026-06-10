import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import productRoutes from '../modules/product/product.routes.js';
import categoryRoutes from '../modules/category/category.routes.js';
import cartRoutes from '../modules/cart/cart.routes.js';
import orderRoutes from '../modules/order/order.routes.js';
import invoiceRoutes from '../modules/invoice/invoice.routes.js';
import enquiryRoutes from '../modules/enquiry/enquiry.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import customerRoutes from '../modules/customer/customer.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'HariBasket API is running' });
});

export default router;
