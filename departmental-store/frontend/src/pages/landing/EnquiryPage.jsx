import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { enquiryService } from '../../services/enquiryService';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

export default function EnquiryPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data) => enquiryService.create({ ...data, source: 'LANDING' }),
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
  });

  return (
    <div className="mx-auto max-w-xl px-4 py-16 lg:px-8">
      <Card>
        <h1 className="text-2xl font-bold">Send an Enquiry</h1>
        <p className="mt-2 text-sm text-slate-600">We'll get back to you within 24 hours.</p>

        {submitted ? (
          <p className="mt-6 text-primary-600">Thank you! Your enquiry has been submitted.</p>
        ) : (
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="mt-6 space-y-4">
            <Input label="Name" error={errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
            <Textarea label="Message" error={errors.message?.message} {...register('message')} />
            {mutation.error && <p className="text-sm text-red-600">{mutation.error.message}</p>}
            <Button type="submit" loading={mutation.isPending} className="w-full">Submit Enquiry</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
