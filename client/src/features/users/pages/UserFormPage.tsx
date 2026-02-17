import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useUser, useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

const createSchema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.email(), password: z.string().min(8) });
const updateSchema = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.email() });

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

export default function UserFormPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id || '');
  const createUser = useCreateUser(); const updateUser = useUpdateUser();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateFormData | UpdateFormData>({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
  });

  useEffect(() => { if (user) reset({ firstName: user.firstName, lastName: user.lastName, email: user.email }); }, [user, reset]);

  const onSubmit = (data: any) => {
    if (isEdit) updateUser.mutate({ id: id!, data }, { onSuccess: () => navigate('/admin/users') });
    else createUser.mutate(data, { onSuccess: () => navigate('/admin/users') });
  };

  if (isEdit && isLoading) return <LoadingOverlay />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit User' : 'Create User'}</h1>
      <Card><form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4"><Input label="First Name" {...register('firstName')} error={errors.firstName?.message as string} /><Input label="Last Name" {...register('lastName')} error={errors.lastName?.message as string} /></div>
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message as string} />
        {!isEdit && <Input label="Password" type="password" {...register('password' as any)} error={(errors as any).password?.message as string} />}
        <div className="flex gap-3"><Button type="submit" isLoading={createUser.isPending || updateUser.isPending}>{isEdit ? 'Update' : 'Create'}</Button><Button variant="secondary" type="button" onClick={() => navigate('/admin/users')}>Cancel</Button></div>
      </form></Card>
    </div>
  );
}
