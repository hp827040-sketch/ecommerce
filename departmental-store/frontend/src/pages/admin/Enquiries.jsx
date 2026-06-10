import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enquiryService } from '../../services/enquiryService';
import { PageHeader } from '../../components/admin/PageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { formatDate } from '../../utils/formatters';
import { Plus, Pencil, Trash2, MessageSquare } from 'lucide-react';

const emptyForm = { name: '', email: '', phone: '', message: '', source: 'CONTACT' };
const sources = [
  { value: 'LANDING', label: 'Landing Page' },
  { value: 'CUSTOMER', label: 'Customer Portal' },
  { value: 'CONTACT', label: 'Contact Form' },
];

export default function AdminEnquiries() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['enquiries'],
    queryFn: () => enquiryService.getAll(),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setModalOpen(false);
  };

  const openCreateModal = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (payload) => editId
      ? enquiryService.update(editId, payload)
      : enquiryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => enquiryService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enquiries'] }),
  });

  const toggleRead = useMutation({
    mutationFn: ({ id, isRead }) => enquiryService.update(id, { isRead }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enquiries'] }),
  });

  const enquiries = data?.data || [];

  const handleEdit = (enquiry) => {
    setEditId(enquiry.id);
    setForm({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone || '',
      message: enquiry.message,
      source: enquiry.source,
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description="Review and respond to customer messages from your store."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Enquiry
          </Button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={resetForm}
        title={editId ? 'Edit Enquiry' : 'New Enquiry'}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(form);
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select
            label="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            options={sources}
          />
          <Input
            className="sm:col-span-2"
            label="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          {saveMutation.error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {saveMutation.error.message}
            </p>
          )}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saveMutation.isPending}>{editId ? 'Save Changes' : 'Create Enquiry'}</Button>
            <Button variant="ghost" type="button" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {isLoading ? (
        <div className="admin-card h-48 animate-pulse" />
      ) : enquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No enquiries yet"
          description="Customer messages from your store will appear here."
          action={
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4" /> Add Enquiry
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div
              key={e.id}
              className={`admin-card p-5 ${!e.isRead ? 'ring-2 ring-primary-200' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{e.name}</h3>
                    {!e.isRead && (
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">New</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{e.email} · {e.source}</p>
                  {e.phone && <p className="text-sm text-slate-500">{e.phone}</p>}
                  <p className="mt-2 text-sm text-slate-700">{e.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{formatDate(e.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(e)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-primary-50 hover:text-primary-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this enquiry?')) deleteMutation.mutate(e.id);
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRead.mutate({ id: e.id, isRead: !e.isRead })}
                    className="text-xs font-medium text-primary-600 hover:underline"
                  >
                    Mark as {e.isRead ? 'unread' : 'read'}
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
