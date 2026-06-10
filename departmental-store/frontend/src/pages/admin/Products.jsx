import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { PageHeader } from '../../components/admin/PageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { ProductPriceDisplay } from '../../components/admin/ProductPriceDisplay';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

const UNIT_OPTIONS = [
  { value: '', label: 'Select unit' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'piece', label: 'Piece' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'litre', label: 'Litre' },
  { value: 'ml', label: 'Millilitre (ml)' },
  { value: 'pack', label: 'Pack' },
  { value: 'bunch', label: 'Bunch' },
];

const emptyForm = {
  name: '',
  description: '',
  unit: '',
  price: '',
  oldPrice: '',
  offerPrice: '',
  stock: '',
  categoryId: '',
  status: 'ACTIVE',
  isTodaySpecial: false,
};

const toPayload = (form) => ({
  name: form.name.trim(),
  description: form.description.trim() || undefined,
  unit: form.unit || null,
  price: Number(form.price),
  oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
  offerPrice: form.offerPrice ? Number(form.offerPrice) : null,
  stock: Number(form.stock),
  categoryId: form.categoryId,
  status: form.status,
  isTodaySpecial: form.isTodaySpecial,
});

const syncStatusWithStock = (stock, status) => {
  if (status === 'INACTIVE') return status;
  return Number(stock) <= 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
};

const handleStockChange = (form, stock) => ({
  ...form,
  stock,
  status: syncStatusWithStock(stock, form.status),
});

export default function AdminProducts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    enabled: modalOpen,
  });

  const closeForm = () => {
    setModalOpen(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const openCreateModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? productService.update(editId, data) : productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      unit: product.unit || '',
      price: product.price,
      oldPrice: product.oldPrice ?? '',
      offerPrice: product.offerPrice ?? '',
      stock: product.stock,
      categoryId: product.categoryId,
      status: product.status || 'ACTIVE',
      isTodaySpecial: product.isTodaySpecial || false,
    });
    setModalOpen(true);
  };

  const list = products?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your catalogue, pricing, units, and today's special offers."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Product
          </Button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeForm}
        title={editId ? 'Edit Product' : 'New Product'}
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(toPayload(form));
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Input
            className="sm:col-span-2"
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            placeholder="Select category"
            options={[
              { value: '', label: 'Select category' },
              ...(categories?.data || []).map((c) => ({ value: c.id, label: c.name })),
            ]}
            required
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={STATUS_OPTIONS}
            required
          />
          <Select
            label="Unit"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="Select unit"
            options={UNIT_OPTIONS}
          />
          <Input
            label="Price (₹)"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <Input
            label="Old price (₹)"
            type="number"
            min="0"
            step="0.01"
            placeholder="MRP / before discount"
            value={form.oldPrice}
            onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
          />
          <Input
            label="Offer price (₹)"
            type="number"
            min="0"
            step="0.01"
            placeholder="Sale price customers pay"
            value={form.offerPrice}
            onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((prev) => handleStockChange(prev, e.target.value))}
            required
          />
          <Input
            className="sm:col-span-2"
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isTodaySpecial}
              onChange={(e) => setForm({ ...form, isTodaySpecial: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              <span className="block text-sm font-medium text-slate-900">Today&apos;s special sale</span>
              <span className="block text-xs text-slate-500">Show this product in today&apos;s specials on the storefront</span>
            </span>
          </label>
          {saveMutation.error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {saveMutation.error.message}
            </p>
          )}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saveMutation.isPending}>{editId ? 'Save Changes' : 'Create Product'}</Button>
            <Button variant="ghost" type="button" onClick={closeForm}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {isLoading ? (
        <div className="admin-card h-48 animate-pulse" />
      ) : list.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add your first product to start selling on FreshBasket."
          action={
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          }
        />
      ) : (
        <div className="admin-table-wrap">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                          <Package className="h-4 w-4 text-primary-600" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{p.name}</p>
                          {p.isTodaySpecial && (
                            <span className="text-xs font-medium text-gold-600">Today&apos;s Special</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-500">{p.category?.name || '—'}</td>
                    <td className="text-slate-500">{p.unit || '—'}</td>
                    <td>
                      <ProductPriceDisplay product={p} size="sm" />
                    </td>
                    <td>
                      <span className={p.stock === 0 ? 'font-medium text-red-600' : ''}>{p.stock}</span>
                    </td>
                    <td>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === 'ACTIVE'
                          ? 'bg-primary-50 text-primary-700'
                          : p.status === 'INACTIVE'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-red-50 text-red-600'
                      }`}>
                        {p.status === 'OUT_OF_STOCK' ? 'Out of Stock' : p.status === 'INACTIVE' ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary-600"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id);
                          }}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
