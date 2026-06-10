import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import { PageHeader } from '../../components/admin/PageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Tags } from 'lucide-react';

export default function AdminCategories() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => categoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const categories = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organise products into categories for easier browsing."
      />

      <div className="admin-card p-5">
        <form
          onSubmit={(e) => { e.preventDefault(); if (name.trim()) createMutation.mutate({ name: name.trim() }); }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <Input
            className="flex-1"
            label="New category"
            placeholder="e.g. Vegetables, Fruits, Dairy"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" loading={createMutation.isPending} className="sm:mb-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Category
          </Button>
        </form>
      </div>

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
                <button
                  onClick={() => deleteMutation.mutate(c.id)}
                  className="rounded-lg p-2 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${c.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
