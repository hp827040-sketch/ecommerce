import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, Truck } from 'lucide-react';

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
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link to="/customer/cart" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
          <ChevronLeft className="h-4 w-4" /> Back to cart
        </Link>
        <h2 className="customer-page-title">Checkout</h2>
        <p className="customer-page-subtitle">Confirm delivery details and place your order</p>
      </div>

      <Card>
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
          <Truck className="h-5 w-5 shrink-0" />
          Free delivery on all orders in your area
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Textarea label="Delivery Address" error={errors.address?.message} {...register('address')} />
          <Textarea label="Notes (optional)" error={errors.notes?.message} {...register('notes')} />
          <Select
            label="Payment Type"
            error={errors.paymentMethod?.message}
            value={watch('paymentMethod')}
            onChange={(e) => setValue('paymentMethod', e.target.value, { shouldValidate: true })}
            options={[
              { value: 'COD', label: 'Cash on Delivery' },
              { value: 'UPI', label: 'UPI' },
              { value: 'CARD', label: 'Card' },
            ]}
          />
          <input type="hidden" {...register('paymentMethod')} />
          {mutation.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{mutation.error.message}</p>
          )}
          <Button type="submit" loading={mutation.isPending} className="w-full">Place Order</Button>
        </form>
      </Card>
    </div>
  );
}
