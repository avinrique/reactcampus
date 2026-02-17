import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCollege, useCreateCollege, useUpdateCollege } from '../hooks/useColleges';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { COLLEGE_TYPES } from '@/config/constants';

export default function CollegeFormPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: college, isLoading } = useCollege(id || '');
  const createCollege = useCreateCollege(); const updateCollege = useUpdateCollege();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (college) reset({ name: college.name, type: college.type, description: college.description, city: college.location?.city, state: college.location?.state, address: college.location?.address, pincode: college.location?.pincode, feesMin: college.fees?.min, feesMax: college.fees?.max, ranking: college.ranking, established: college.established, website: college.website, accreditation: college.accreditation || '', affiliation: college.affiliation || '', facilities: college.facilities?.join(', ') || '' }); }, [college, reset]);

  const onSubmit = (data: any) => {
    const payload = { name: data.name, type: data.type, description: data.description || '', location: { city: data.city || '', state: data.state || '', address: data.address || '', pincode: data.pincode || '' }, fees: { min: Number(data.feesMin) || 0, max: Number(data.feesMax) || 0 }, ranking: Number(data.ranking) || null, established: Number(data.established) || null, website: data.website || '', accreditation: data.accreditation || '', affiliation: data.affiliation || '', facilities: data.facilities ? data.facilities.split(',').map((s: string) => s.trim()).filter(Boolean) : [] };
    if (isEdit) updateCollege.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/colleges') });
    else createCollege.mutate(payload, { onSuccess: () => navigate('/admin/colleges') });
  };
  if (isEdit && isLoading) return <LoadingOverlay />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit College' : 'Create College'}</h1>
      <Card><form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register('name')} />
        <Select label="Type" options={COLLEGE_TYPES.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))} {...register('type')} />
        <Textarea label="Description" {...register('description')} />
        <div className="grid grid-cols-2 gap-4"><Input label="City" {...register('city')} /><Input label="State" {...register('state')} /><Input label="Address" {...register('address')} /><Input label="Pincode" {...register('pincode')} /></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Min Fees" type="number" {...register('feesMin')} /><Input label="Max Fees" type="number" {...register('feesMax')} /></div>
        <div className="grid grid-cols-2 gap-4"><Input label="Ranking" type="number" {...register('ranking')} /><Input label="Established" type="number" {...register('established')} /></div>
        <Input label="Website" {...register('website')} />
        <div className="grid grid-cols-2 gap-4"><Input label="Accreditation" placeholder="e.g. NAAC A++ / NBA" {...register('accreditation')} /><Input label="Affiliation" placeholder="e.g. VTU, Autonomous" {...register('affiliation')} /></div>
        <Input label="Facilities (comma-separated)" placeholder="Library, Hostel, Sports Complex, WiFi Campus" {...register('facilities')} />
        <div className="flex gap-3"><Button type="submit" isLoading={createCollege.isPending || updateCollege.isPending}>{isEdit ? 'Update' : 'Create'}</Button><Button variant="secondary" type="button" onClick={() => navigate('/admin/colleges')}>Cancel</Button></div>
      </form></Card>
    </div>
  );
}
