import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { PageHeader } from '../../components/admin/PageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Pencil, Trash2, Package, X } from 'lucide-react';

export default function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '', categoryId: '', description: '' });
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

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

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ name: '', price: '', stock: '', categoryId: '', description: '' });
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      description: product.description || '',
    });
    setShowForm(true);
  };

  const list = products?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your catalogue, pricing, and inventory levels."
        action={
          <Button onClick={() => { setShowForm(true); setEditId(null); }}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Product
          </Button>
        }
      />

      {showForm && (
        <div className="admin-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="admin-display font-semibold text-slate-900">
              {editId ? 'Edit Product' : 'New Product'}
            </h3>
            <button onClick={closeForm} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Close form">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={(categories?.data || []).map((c) => ({ value: c.id, label: c.name }))}
            />
            <Input className="sm:col-span-2" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-3 sm:col-span-2">
              <Button type="submit" loading={saveMutation.isPending}>{editId ? 'Save Changes' : 'Create Product'}</Button>
              <Button variant="ghost" type="button" onClick={closeForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="admin-card h-48 animate-pulse" />
      ) : list.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add your first product to start selling on FreshBasket."
          action={
            <Button onClick={() => setShowForm(true)}>
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
                    <td className="font-semibold text-slate-900">{formatCurrency(p.price)}</td>
                    <td>
                      <span className={p.stock === 0 ? 'font-medium text-red-600' : ''}>{p.stock}</span>
                    </td>
                    <td>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.status === 'ACTIVE' ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(p)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary-600"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(p.id)}
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
