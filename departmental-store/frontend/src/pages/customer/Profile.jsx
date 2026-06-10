import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../../services/customerService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/customer/PageHeader';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, MapPin, Phone, User, ShieldCheck } from 'lucide-react';

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

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CU';

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Profile"
        description="Keep your contact and delivery details up to date for faster checkout."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="customer-card p-6 lg:col-span-2">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-500 text-2xl font-bold text-white shadow-lg shadow-primary-500/25">
              {initials}
            </div>
            <h3 className="customer-display mt-4 text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verified customer
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>{user?.phone || 'Add phone number'}</span>
            </div>
            <div className="flex items-start gap-3 text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>{user?.address || 'Add delivery address'}</span>
            </div>
          </div>
        </div>

        <div className="customer-card p-6 lg:col-span-3">
          <div className="mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" aria-hidden="true" />
            <h3 className="customer-display font-semibold text-slate-900">Account Details</h3>
          </div>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <Input label="Full Name" {...register('name')} />
            <Input label="Phone Number" {...register('phone')} />
            <Textarea label="Default Delivery Address" rows={4} {...register('address')} />
            {mutation.isSuccess && (
              <p className="rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
                Profile updated successfully!
              </p>
            )}
            {mutation.isError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {mutation.error?.message || 'Failed to update profile'}
              </p>
            )}
            <Button type="submit" loading={mutation.isPending}>
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
