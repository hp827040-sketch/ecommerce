import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from '../../utils/formatters';
import { Plus, Pencil, Trash2, Eye, X } from 'lucide-react';

const emptyForm = { name: '', email: '', phone: '', address: '', password: '' };

export default function AdminCustomers() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => adminService.getCustomers(),
  });

  const { data: customerDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['admin-customer', viewId],
    queryFn: () => adminService.getCustomer(viewId),
    enabled: !!viewId,
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const saveMutation = useMutation({
    mutationFn: (payload) => editId
      ? adminService.updateCustomer(editId, payload)
      : adminService.createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      if (viewId) setViewId(null);
    },
  });

  const customers = data?.data || [];
  const detail = customerDetail?.data;

  const handleEdit = (customer) => {
    setEditId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      password: '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editId && !payload.password) delete payload.password;
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input
              label={editId ? 'Password (leave blank to keep)' : 'Password'}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editId}
            />
            <Input className="sm:col-span-2" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="flex gap-3 sm:col-span-2">
              <Button type="submit" loading={saveMutation.isPending}>{editId ? 'Update' : 'Create'}</Button>
              <Button variant="ghost" type="button" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {viewId && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Details</h3>
            <button onClick={() => setViewId(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          {detailLoading ? (
            <div className="h-24 animate-pulse rounded-lg bg-white/5" />
          ) : detail ? (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <p><span className="text-slate-400">Name:</span> {detail.name}</p>
                <p><span className="text-slate-400">Email:</span> {detail.email}</p>
                <p><span className="text-slate-400">Phone:</span> {detail.phone || '—'}</p>
                <p><span className="text-slate-400">Joined:</span> {formatDate(detail.createdAt)}</p>
                <p className="sm:col-span-2"><span className="text-slate-400">Address:</span> {detail.address || '—'}</p>
              </div>
              {detail.orders?.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium">Order History</h4>
                  <div className="space-y-2">
                    {detail.orders.map((order) => (
                      <div key={order.id} className="rounded-lg bg-white/5 p-3 text-sm">
                        <div className="flex justify-between">
                          <span>{formatDate(order.createdAt)}</span>
                          <span className="text-gold-400">{formatCurrency(order.total)}</span>
                        </div>
                        <p className="text-slate-400">{ORDER_STATUS_LABELS[order.status]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </Card>
      )}

      {isLoading ? (
        <div className="glass-card h-48 animate-pulse" />
      ) : customers.length === 0 ? (
        <Card><p className="text-slate-400">No customers yet.</p></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-slate-400">{c.email}</p>
                  <p className="text-sm text-slate-400">{c.phone || 'No phone'}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {c._count?.orders || 0} orders · Joined {formatDate(c.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewId(c.id)} className="rounded-lg bg-white/5 p-2" title="View">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleEdit(c)} className="rounded-lg bg-white/5 p-2" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this customer?')) deleteMutation.mutate(c.id);
                    }}
                    className="rounded-lg bg-red-500/10 p-2 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
