import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCourse, useCreateCourse, useUpdateCourse } from '../hooks/useCourses';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { COURSE_LEVELS, DURATION_UNITS, FEE_PER } from '@/config/constants';

export default function CourseFormPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(id || '');
  const createCourse = useCreateCourse(); const updateCourse = useUpdateCourse();
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => { if (course) reset({ name: course.name, level: course.level, durationValue: course.duration.value, durationUnit: course.duration.unit, stream: course.stream, specializations: course.specializations?.join(', '), feesAmount: course.fees?.amount, feesPer: course.fees?.per, description: course.description, eligibility: course.eligibility }); }, [course, reset]);
  const onSubmit = (data: any) => {
    const payload = { name: data.name, level: data.level, duration: { value: Number(data.durationValue), unit: data.durationUnit }, stream: data.stream || '', specializations: data.specializations ? data.specializations.split(',').map((s: string) => s.trim()).filter(Boolean) : [], fees: { amount: Number(data.feesAmount) || 0, per: data.feesPer || 'year' }, description: data.description || '', eligibility: data.eligibility || '' };
    if (isEdit) updateCourse.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/courses') });
    else createCourse.mutate(payload, { onSuccess: () => navigate('/admin/courses') });
  };
  if (isEdit && isLoading) return <LoadingOverlay />;
  return (
    <div className="max-w-2xl"><h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Course' : 'Create Course'}</h1>
      <Card><form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} />
        <Select label="Level" options={COURSE_LEVELS.map(l => ({ label: l.charAt(0).toUpperCase() + l.slice(1), value: l }))} {...register('level')} />
        <div className="grid grid-cols-2 gap-4"><Input label="Duration" type="number" {...register('durationValue')} /><Select label="Unit" options={DURATION_UNITS.map(u => ({ label: u, value: u }))} {...register('durationUnit')} /></div>
        <Input label="Stream" {...register('stream')} /><Input label="Specializations (comma-separated)" {...register('specializations')} />
        <div className="grid grid-cols-2 gap-4"><Input label="Fees" type="number" {...register('feesAmount')} /><Select label="Per" options={FEE_PER.map(f => ({ label: f, value: f }))} {...register('feesPer')} /></div>
        <Textarea label="Description" {...register('description')} /><Textarea label="Eligibility" {...register('eligibility')} />
        <div className="flex gap-3"><Button type="submit" isLoading={createCourse.isPending || updateCourse.isPending}>{isEdit ? 'Update' : 'Create'}</Button><Button variant="secondary" type="button" onClick={() => navigate('/admin/courses')}>Cancel</Button></div>
      </form></Card></div>
  );
}
