import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/admin/PageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from '../../utils/formatters';
import { Plus, Pencil, Trash2, Eye, Users } from 'lucide-react';

const emptyForm = { name: '', email: '', phone: '', address: '', password: '' };

export default function AdminCustomers() {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
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
    setFormModalOpen(false);
  };

  const openCreateModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setFormModalOpen(true);
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
      if (editId) resetForm();
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
    setFormModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editId && !payload.password) delete payload.password;
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer accounts, contact details, and order history."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Customer
          </Button>
        }
      />

      <Modal
        open={formModalOpen}
        onClose={resetForm}
        title={editId ? 'Edit Customer' : 'New Customer'}
        size="md"
      >
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
          {saveMutation.error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {saveMutation.error.message}
            </p>
          )}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saveMutation.isPending}>{editId ? 'Save Changes' : 'Create Customer'}</Button>
            <Button variant="ghost" type="button" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!viewId}
        onClose={() => setViewId(null)}
        title="Customer Details"
        size="md"
      >
        {detailLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
        ) : detail ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</p>
                <p className="mt-1 text-sm text-slate-900">{detail.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</p>
                <p className="mt-1 text-sm text-slate-900">{detail.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Phone</p>
                <p className="mt-1 text-sm text-slate-900">{detail.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Joined</p>
                <p className="mt-1 text-sm text-slate-900">{formatDate(detail.createdAt)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Address</p>
                <p className="mt-1 text-sm text-slate-900">{detail.address || '—'}</p>
              </div>
            </div>
            {detail.orders?.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-900">Order History</h4>
                <div className="space-y-2">
                  {detail.orders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-700">{formatDate(order.createdAt)}</span>
                        <span className="font-semibold text-primary-700">{formatCurrency(order.total)}</span>
                      </div>
                      <p className="mt-1 text-slate-500">{ORDER_STATUS_LABELS[order.status]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {isLoading ? (
        <div className="admin-card h-48 animate-pulse" />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start managing accounts."
          action={
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4" /> Add Customer
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <div key={c.id} className="admin-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <p className="text-sm text-slate-500">{c.email}</p>
                  <p className="text-sm text-slate-500">{c.phone || 'No phone'}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {c._count?.orders || 0} orders · Joined {formatDate(c.createdAt)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setViewId(c.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(c)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-primary-50 hover:text-primary-600"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this customer?')) deleteMutation.mutate(c.id);
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
