import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/customer/PageHeader';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, Truck, CreditCard } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  address: z.string().min(5),
  notes: z.string().optional(),
  paymentMethod: z.enum(['COD', 'UPI', 'CARD']),
});

export default function CustomerCheckout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      paymentMethod: 'COD',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => orderService.create(data),
    onSuccess: () => navigate('/customer/orders'),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link
          to="/customer/cart"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-primary-600"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to cart
        </Link>
        <PageHeader
          title="Checkout"
          description="Confirm your delivery details and choose how you'd like to pay."
        />
      </div>

      <div className="customer-card p-6">
        <div className="customer-delivery-banner mb-6">
          <Truck className="h-5 w-5 shrink-0" aria-hidden="true" />
          Free delivery on all orders in your area
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" error={errors.name?.message} {...register('name')} />
            <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          </div>
          <Textarea label="Delivery Address" rows={3} error={errors.address?.message} {...register('address')} />
          <Textarea label="Order Notes (optional)" rows={2} error={errors.notes?.message} {...register('notes')} />

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <CreditCard className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Payment Method
            </label>
            <Select
              error={errors.paymentMethod?.message}
              value={watch('paymentMethod')}
              onChange={(e) => setValue('paymentMethod', e.target.value, { shouldValidate: true })}
              options={[
                { value: 'COD', label: 'Cash on Delivery' },
                { value: 'UPI', label: 'UPI' },
                { value: 'CARD', label: 'Debit / Credit Card' },
              ]}
            />
            <input type="hidden" {...register('paymentMethod')} />
          </div>

          {mutation.error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{mutation.error.message}</p>
          )}

          <Button type="submit" loading={mutation.isPending} className="w-full">
            Place Order
          </Button>
        </form>
      </div>
    </div>
  );
}
