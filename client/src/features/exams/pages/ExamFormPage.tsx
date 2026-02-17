import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useExam, useCreateExam, useUpdateExam } from '../hooks/useExams';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { EXAM_TYPES, EXAM_MODES } from '@/config/constants';
import { Plus, Trash2 } from 'lucide-react';
import type { CreateExamRequest } from '@/types/exam';

export default function ExamFormPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: exam, isLoading } = useExam(id || '');
  const createExam = useCreateExam(); const updateExam = useUpdateExam();
  const { register, handleSubmit, control, reset } = useForm<CreateExamRequest>({
    defaultValues: {
      name: '', examType: 'national', conductedBy: '', description: '', eligibility: '', website: '',
      pattern: { mode: 'online', duration: '', totalMarks: 0, sections: [] },
      importantDates: [],
    },
  });
  const { fields: sections, append: addSection, remove: removeSection } = useFieldArray({ control, name: 'pattern.sections' as any });
  const { fields: dates, append: addDate, remove: removeDate } = useFieldArray({ control, name: 'importantDates' as any });
  useEffect(() => { if (exam) reset({ name: exam.name, examType: exam.examType, conductedBy: exam.conductedBy, description: exam.description, eligibility: exam.eligibility, website: exam.website, pattern: { mode: exam.pattern?.mode || 'online', duration: exam.pattern?.duration || '', totalMarks: exam.pattern?.totalMarks || 0, sections: exam.pattern?.sections || [] }, importantDates: exam.importantDates?.map(d => ({ ...d, date: d.date ? new Date(d.date).toISOString().split('T')[0] : '' })) || [] }); }, [exam, reset]);
  const onSubmit = (data: any) => { if (isEdit) updateExam.mutate({ id: id!, data }, { onSuccess: () => navigate('/admin/exams') }); else createExam.mutate(data, { onSuccess: () => navigate('/admin/exams') }); };
  if (isEdit && isLoading) return <LoadingOverlay />;
  return (
    <div className="max-w-3xl"><h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Exam' : 'Create Exam'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card><div className="space-y-4"><Input label="Name" {...register('name')} /><Select label="Type" options={EXAM_TYPES.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))} {...register('examType')} /><Input label="Conducted By" {...register('conductedBy')} /><Textarea label="Description" {...register('description')} /><Textarea label="Eligibility" {...register('eligibility')} /><Input label="Website" {...register('website')} /></div></Card>
        <Card><CardTitle className="mb-4">Pattern</CardTitle><div className="space-y-4"><Select label="Mode" options={EXAM_MODES.map(m => ({ label: m, value: m }))} {...register('pattern.mode')} /><div className="grid grid-cols-2 gap-4"><Input label="Duration" {...register('pattern.duration')} /><Input label="Total Marks" type="number" {...register('pattern.totalMarks', { valueAsNumber: true })} /></div><div><div className="flex items-center justify-between mb-2"><h4 className="text-sm font-medium">Sections</h4><Button type="button" variant="ghost" size="sm" onClick={() => addSection({ name: '', questions: 0, marks: 0 })}><Plus className="h-4 w-4 mr-1" />Add</Button></div>{sections.map((s, i) => <div key={s.id} className="flex gap-2 items-end"><Input label="Name" {...register(`pattern.sections.${i}.name` as any)} /><Input label="Q" type="number" {...register(`pattern.sections.${i}.questions` as any, { valueAsNumber: true })} /><Input label="Marks" type="number" {...register(`pattern.sections.${i}.marks` as any, { valueAsNumber: true })} /><Button type="button" variant="ghost" size="sm" onClick={() => removeSection(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>)}</div></div></Card>
        <Card><CardTitle className="mb-4">Important Dates</CardTitle><Button type="button" variant="ghost" size="sm" onClick={() => addDate({ event: '', date: '', description: '' })}><Plus className="h-4 w-4 mr-1" />Add Date</Button>{dates.map((d, i) => <div key={d.id} className="flex gap-2 items-end mt-2"><Input label="Event" {...register(`importantDates.${i}.event` as any)} /><Input label="Date" type="date" {...register(`importantDates.${i}.date` as any)} /><Input label="Desc" {...register(`importantDates.${i}.description` as any)} /><Button type="button" variant="ghost" size="sm" onClick={() => removeDate(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>)}</Card>
        <div className="flex gap-3"><Button type="submit" isLoading={createExam.isPending || updateExam.isPending}>{isEdit ? 'Update' : 'Create'}</Button><Button variant="secondary" type="button" onClick={() => navigate('/admin/exams')}>Cancel</Button></div>
      </form></div>
  );
}
