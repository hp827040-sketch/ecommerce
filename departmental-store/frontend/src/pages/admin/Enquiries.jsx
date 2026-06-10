import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enquiryService } from '../../services/enquiryService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { formatDate } from '../../utils/formatters';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const emptyForm = { name: '', email: '', phone: '', message: '', source: 'CONTACT' };
const sources = [
  { value: 'LANDING', label: 'Landing Page' },
  { value: 'CUSTOMER', label: 'Customer Portal' },
  { value: 'CONTACT', label: 'Contact Form' },
];

export default function AdminEnquiries() {
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(false);
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
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Enquiry Management</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Enquiry
        </Button>
      </div>

      {showForm && (
        <Card>
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
            <div className="flex gap-3 sm:col-span-2">
              <Button type="submit" loading={saveMutation.isPending}>{editId ? 'Update' : 'Create'}</Button>
              <Button variant="ghost" type="button" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="glass-card h-48 animate-pulse" />
      ) : enquiries.length === 0 ? (
        <Card><p className="text-slate-400">No enquiries yet.</p></Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <Card key={e.id} className={!e.isRead ? 'border-primary-500/30' : ''}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{e.name}</h3>
                    {!e.isRead && (
                      <span className="rounded-full bg-primary-500/20 px-2 py-0.5 text-xs text-primary-300">New</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{e.email} · {e.source}</p>
                  {e.phone && <p className="text-sm text-slate-400">{e.phone}</p>}
                  <p className="mt-2 text-sm">{e.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(e.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(e)} className="rounded-lg bg-white/5 p-2" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this enquiry?')) deleteMutation.mutate(e.id);
                      }}
                      className="rounded-lg bg-red-500/10 p-2 text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleRead.mutate({ id: e.id, isRead: !e.isRead })}
                    className="text-xs text-primary-400 hover:underline"
                  >
                    Mark as {e.isRead ? 'unread' : 'read'}
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
