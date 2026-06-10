import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import { PageHeader } from '../../components/admin/PageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export default function AdminCategories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const resetForm = () => {
    setEditId(null);
    setName('');
    setStatus('ACTIVE');
    setModalOpen(false);
  };

  const openCreateModal = () => {
    setEditId(null);
    setName('');
    setStatus('ACTIVE');
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (payload) => editId
      ? categoryService.update(editId, payload)
      : categoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      if (editId) resetForm();
    },
  });

  const handleEdit = (category) => {
    setEditId(category.id);
    setName(category.name);
    setStatus(category.status || 'ACTIVE');
    setModalOpen(true);
  };

  const categories = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organise products into categories for easier browsing."
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Category
          </Button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={resetForm}
        title={editId ? 'Edit Category' : 'New Category'}
        size="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            const payload = { name: name.trim() };
            if (editId) payload.status = status;
            saveMutation.mutate(payload);
          }}
          className="space-y-4"
        >
          <Input
            label={editId ? 'Category name' : 'New category'}
            placeholder="e.g. Vegetables, Fruits, Dairy"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {editId && (
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={STATUS_OPTIONS}
            />
          )}
          {saveMutation.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {saveMutation.error.message}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saveMutation.isPending}>
              {editId ? 'Save Changes' : 'Add Category'}
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card h-24 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories"
          description="Create categories to group your products."
          action={
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => (
            <div key={c.id} className="admin-card group p-5 transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Tags className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{c.name}</h3>
                    <p className="text-sm text-slate-500">{c._count?.products || 0} products</p>
                  </div>
                </div>
                <div className="flex opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleEdit(c)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-primary-50 hover:text-primary-600"
                    aria-label={`Edit ${c.name}`}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${c.name}"? This cannot be undone.`)) {
                        deleteMutation.mutate(c.id);
                      }
                    }}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${c.name}`}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <span className={`mt-4 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                c.status === 'ACTIVE' ? 'bg-primary-50 text-primary-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {c.status || 'ACTIVE'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
