import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import { PageHeader } from '../../components/admin/PageHeader';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { EmptyState } from '../../components/admin/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from '../../utils/formatters';
import { Plus, Pencil, Trash2, ClipboardList, X } from 'lucide-react';

const STATUSES = ['PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const PAYMENT_OPTIONS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
];

const emptyCreateForm = {
  userId: '',
  name: '',
  phone: '',
  address: '',
  notes: '',
  paymentMethod: 'COD',
  status: 'PENDING',
  items: [{ productId: '', quantity: 1 }],
};

const emptyEditForm = {
  phone: '',
  address: '',
  notes: '',
  paymentMethod: 'COD',
  status: 'PENDING',
};

export default function AdminOrders() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getAll(),
  });

  const { data: customersData } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => adminService.getCustomers(),
    enabled: showCreateForm,
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAll(),
    enabled: showCreateForm,
  });

  const resetCreateForm = () => {
    setCreateForm(emptyCreateForm);
    setShowCreateForm(false);
  };

  const resetEditForm = () => {
    setEditId(null);
    setEditForm(emptyEditForm);
  };

  const createMutation = useMutation({
    mutationFn: (payload) => orderService.createAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetCreateForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => orderService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetEditForm();
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => orderService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      if (editId) resetEditForm();
    },
  });

  const orders = data?.data || [];
  const customers = customersData?.data || [];
  const products = productsData?.data || [];

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  const createTotal = useMemo(() => {
    return createForm.items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      if (!product || !item.quantity) return sum;
      return sum + Number(product.price) * Number(item.quantity);
    }, 0);
  }, [createForm.items, productMap]);

  const handleCustomerChange = (userId) => {
    const customer = customers.find((c) => c.id === userId);
    setCreateForm((prev) => ({
      ...prev,
      userId,
      name: customer?.name || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
    }));
  };

  const handleEdit = (order) => {
    setEditId(order.id);
    setEditForm({
      phone: order.phone || '',
      address: order.address || '',
      notes: order.notes || '',
      paymentMethod: order.paymentMethod || 'COD',
      status: order.status || 'PENDING',
    });
    setShowCreateForm(false);
  };

  const updateCreateItem = (index, field, value) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addCreateItem = () => {
    setCreateForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }],
    }));
  };

  const removeCreateItem = (index) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const items = createForm.items
      .filter((item) => item.productId && Number(item.quantity) > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      }));

    if (!createForm.userId || items.length === 0) return;

    createMutation.mutate({
      userId: createForm.userId,
      name: createForm.name.trim(),
      phone: createForm.phone.trim(),
      address: createForm.address.trim(),
      notes: createForm.notes.trim() || undefined,
      paymentMethod: createForm.paymentMethod,
      status: createForm.status,
      items,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editId) return;
    updateMutation.mutate({
      id: editId,
      payload: {
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        notes: editForm.notes.trim() || undefined,
        paymentMethod: editForm.paymentMethod,
        status: editForm.status,
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Create, track, and manage customer orders from pending to delivered."
        action={
          <Button onClick={() => { resetEditForm(); setShowCreateForm(true); }}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Order
          </Button>
        }
      />

      {showCreateForm && (
        <div className="admin-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="admin-display font-semibold text-slate-900">Create Order</h3>
            <button
              type="button"
              onClick={resetCreateForm}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Customer"
                value={createForm.userId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                options={[
                  { value: '', label: 'Select customer' },
                  ...customers.map((c) => ({ value: c.id, label: `${c.name} (${c.email})` })),
                ]}
                required
              />
              <Input
                label="Customer name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
              />
              <Input
                label="Phone"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                required
              />
              <Select
                label="Payment method"
                value={createForm.paymentMethod}
                onChange={(e) => setCreateForm({ ...createForm, paymentMethod: e.target.value })}
                options={PAYMENT_OPTIONS}
              />
              <Select
                label="Status"
                value={createForm.status}
                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                options={STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] }))}
              />
            </div>

            <Textarea
              label="Delivery address"
              value={createForm.address}
              onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
              required
            />
            <Textarea
              label="Notes (optional)"
              value={createForm.notes}
              onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
            />

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Order items</p>
                <Button type="button" variant="ghost" onClick={addCreateItem}>
                  <Plus className="h-4 w-4" />
                  Add item
                </Button>
              </div>
              <div className="space-y-3">
                {createForm.items.map((item, index) => (
                  <div key={index} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <Select
                      className="flex-1"
                      label={index === 0 ? 'Product' : undefined}
                      value={item.productId}
                      onChange={(e) => updateCreateItem(index, 'productId', e.target.value)}
                      options={[
                        { value: '', label: 'Select product' },
                        ...products.map((p) => ({
                          value: p.id,
                          label: `${p.name} — ${formatCurrency(p.price)} (${p.stock} in stock)`,
                        })),
                      ]}
                      required
                    />
                    <Input
                      className="sm:w-28"
                      label={index === 0 ? 'Qty' : undefined}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCreateItem(index, 'quantity', e.target.value)}
                      required
                    />
                    {createForm.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCreateItem(index)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 sm:mb-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Order total: {formatCurrency(createTotal)}
              </p>
            </div>

            {createMutation.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {createMutation.error.message}
              </p>
            )}

            <div className="flex gap-3">
              <Button type="submit" loading={createMutation.isPending}>Create Order</Button>
              <Button type="button" variant="ghost" onClick={resetCreateForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {editId && (
        <div className="admin-card p-6 ring-2 ring-primary-500 ring-offset-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="admin-display font-semibold text-slate-900">Edit Order</h3>
            <button
              type="button"
              onClick={resetEditForm}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close edit form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              required
            />
            <Select
              label="Payment method"
              value={editForm.paymentMethod}
              onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
              options={PAYMENT_OPTIONS}
            />
            <Select
              label="Status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              options={STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] }))}
            />
            <Textarea
              className="sm:col-span-2"
              label="Delivery address"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              required
            />
            <Textarea
              className="sm:col-span-2"
              label="Notes (optional)"
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            />

            {updateMutation.error && (
              <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {updateMutation.error.message}
              </p>
            )}

            <div className="flex gap-3 sm:col-span-2">
              <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
              <Button type="button" variant="ghost" onClick={resetEditForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="admin-card h-48 animate-pulse" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Create a new order or wait for customers to place orders."
          action={
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4" /> New Order
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`admin-card overflow-hidden ${
                editId === order.id ? 'ring-2 ring-primary-500 ring-offset-2' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-slate-900">{order.user?.name}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {order.phone} · {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{order.address}</p>
                  {order.notes && (
                    <p className="mt-1 text-xs text-slate-400">Note: {order.notes}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(order)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-primary-50 hover:text-primary-600"
                      aria-label={`Edit order for ${order.user?.name}`}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete order for ${order.user?.name}? Stock will be restored if not cancelled.`)) {
                          deleteMutation.mutate(order.id);
                        }
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete order for ${order.user?.name}`}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="admin-display text-xl font-bold text-slate-900">{formatCurrency(order.total)}</p>
                  <Select
                    className="w-48"
                    value={order.status}
                    onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                    options={STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] }))}
                  />
                </div>
              </div>
              <div className="bg-slate-50/50 px-5 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Order Items</p>
                <div className="space-y-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-700">
                        {item.product?.name} <span className="text-slate-400">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
