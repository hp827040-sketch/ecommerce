import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User } from 'lucide-react';

export default function CustomerProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => customerService.updateProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer-dashboard'] }),
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="customer-page-title">Profile</h2>
        <p className="customer-page-subtitle">Manage your account details</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-500 text-lg font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || <User className="h-6 w-6" />}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <Input label="Name" {...register('name')} />
          <Input label="Phone" {...register('phone')} />
          <Textarea label="Delivery Address" {...register('address')} />
          {mutation.isSuccess && (
            <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700">Profile updated successfully!</p>
          )}
          <Button type="submit" loading={mutation.isPending}>Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
