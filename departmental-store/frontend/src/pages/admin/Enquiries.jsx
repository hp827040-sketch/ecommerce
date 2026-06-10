import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enquiryService } from '../../services/enquiryService';
import { PageHeader } from '../../components/admin/PageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { ENQUIRY_SOURCE_LABELS, formatDate } from '../../utils/formatters';
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
        <div className="admin-table-wrap">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Source</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id} className={!e.isRead ? 'bg-primary-50/40' : undefined}>
                    <td>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{e.name}</p>
                        {!e.isRead && (
                          <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-slate-600">{e.email}</td>
                    <td className="text-slate-500">{e.phone || '—'}</td>
                    <td>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        e.source === 'LANDING'
                          ? 'bg-primary-50 text-primary-700'
                          : e.source === 'CUSTOMER'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {ENQUIRY_SOURCE_LABELS[e.source] || e.source}
                      </span>
                    </td>
                    <td className="max-w-xs">
                      <p className="truncate text-slate-700" title={e.message}>
                        {e.message}
                      </p>
                    </td>
                    <td className="whitespace-nowrap text-slate-500">{formatDate(e.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleRead.mutate({ id: e.id, isRead: !e.isRead })}
                        className={`text-xs font-medium hover:underline ${
                          e.isRead ? 'text-slate-500' : 'text-primary-600'
                        }`}
                      >
                        {e.isRead ? 'Read' : 'Unread'}
                      </button>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
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
