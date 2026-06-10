import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingLayout } from './layouts/LandingLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import HomePage from './pages/landing/HomePage';
import AboutPage from './pages/landing/AboutPage';
import FreshCollectionPage from './pages/landing/FreshCollectionPage';
import DeliveryPage from './pages/landing/DeliveryPage';
import TestimonialsPage from './pages/landing/TestimonialsPage';
import FAQPage from './pages/landing/FAQPage';
import ContactPage from './pages/landing/ContactPage';
import EnquiryPage from './pages/landing/EnquiryPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProducts from './pages/customer/Products';
import CustomerCart from './pages/customer/Cart';
import CustomerCheckout from './pages/customer/Checkout';
import CustomerOrders from './pages/customer/Orders';
import CustomerProfile from './pages/customer/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminInvoices from './pages/admin/Invoices';
import AdminEnquiries from './pages/admin/Enquiries';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  User,
  Tags,
  Users,
  FileText,
  MessageSquare,
} from 'lucide-react';

const customerNavGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/customer', label: 'Dashboard', icon: LayoutDashboard, description: 'Your home' },
    ],
  },
  {
    label: 'Shop',
    items: [
      { to: '/customer/products', label: 'Products', icon: Package, description: 'Browse fresh items' },
      { to: '/customer/cart', label: 'Cart', icon: ShoppingCart, description: 'Your basket', badgeKey: 'cart' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/customer/orders', label: 'My Orders', icon: ClipboardList, description: 'Track deliveries' },
      { to: '/customer/profile', label: 'Profile', icon: User, description: 'Your details' },
    ],
  },
];

const adminNavGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, description: 'Stats & insights' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/products', label: 'Products', icon: Package, description: 'Manage inventory' },
      { to: '/admin/categories', label: 'Categories', icon: Tags, description: 'Product groups' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ClipboardList, description: 'Track deliveries' },
      { to: '/admin/invoices', label: 'Invoices', icon: FileText, description: 'Billing & PDFs' },
      { to: '/admin/customers', label: 'Customers', icon: Users, description: 'User accounts' },
    ],
  },
  {
    label: 'Support',
    items: [
      { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare, description: 'Messages & leads' },
    ],
  },
];

export default function App() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="fresh-collection" element={<FreshCollectionPage />} />
        <Route path="delivery" element={<DeliveryPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="enquiry" element={<EnquiryPage />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      <Route
        path="customer"
        element={
          <ProtectedRoute role="CUSTOMER">
            <CustomerLayout navGroups={customerNavGroups} title="Customer Panel" />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="products" element={<CustomerProducts />} />
        <Route path="cart" element={<CustomerCart />} />
        <Route path="checkout" element={<CustomerCheckout />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      <Route
        path="admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout navGroups={adminNavGroups} title="Admin Panel" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
