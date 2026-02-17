import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm as useFormHook, useCreateForm, useUpdateForm } from '../hooks/useForms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardTitle } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { FORM_FIELD_TYPES, FORM_PURPOSES } from '@/config/constants';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { FormField } from '@/types/form';

export default function FormBuilderPage() {
  const { id } = useParams(); const isEdit = !!id; const navigate = useNavigate();
  const { data: form, isLoading } = useFormHook(id || ''); const createForm = useCreateForm(); const updateForm = useUpdateForm();
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [purpose, setPurpose] = useState('generic');
  const [successMessage, setSuccessMessage] = useState('Thank you!'); const [fields, setFields] = useState<Partial<FormField>[]>([]);

  useEffect(() => { if (form) { setTitle(form.title); setDescription(form.description); setPurpose(form.purpose); setSuccessMessage(form.successMessage); setFields(form.fields || []); } }, [form]);

  const addField = () => setFields([...fields, { fieldId: crypto.randomUUID(), type: 'text', label: '', name: '', placeholder: '', validation: { required: false, minLength: null, maxLength: null, min: null, max: null, pattern: null, customMessage: '' }, options: [], order: fields.length, conditionalOn: { fieldName: null, value: null }, leadFieldMapping: null }]);
  const removeField = (idx: number) => setFields(fields.filter((_, i) => i !== idx));
  const updateField = (idx: number, updates: Partial<FormField>) => setFields(fields.map((f, i) => i === idx ? { ...f, ...updates } : f));

  const handleSave = () => {
    const payload = { title, description, purpose: purpose as any, successMessage, fields: fields as any };
    if (isEdit) updateForm.mutate({ id: id!, data: payload }, { onSuccess: () => navigate('/admin/forms') });
    else createForm.mutate(payload, { onSuccess: () => navigate('/admin/forms') });
  };
  if (isEdit && isLoading) return <LoadingOverlay />;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold">{isEdit ? 'Edit Form' : 'Create Form'}</h1><div className="flex gap-3"><Button onClick={handleSave} isLoading={createForm.isPending || updateForm.isPending}>Save</Button><Button variant="secondary" onClick={() => navigate('/admin/forms')}>Cancel</Button></div></div>
      <div className="space-y-6"><Card><div className="space-y-4"><Input label="Title" value={title} onChange={e => setTitle(e.target.value)} /><Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} /><Select label="Purpose" options={FORM_PURPOSES.map(p => ({ label: p.replace('_', ' '), value: p }))} value={purpose} onChange={e => setPurpose(e.target.value)} /><Input label="Success Message" value={successMessage} onChange={e => setSuccessMessage(e.target.value)} /></div></Card>
        <Card><div className="flex items-center justify-between mb-4"><CardTitle>Fields</CardTitle><Button variant="outline" size="sm" onClick={addField}><Plus className="h-4 w-4 mr-1" />Add</Button></div>
          <div className="space-y-4">{fields.map((field, idx) => (
            <div key={field.fieldId || idx} className="border rounded-lg p-4 space-y-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-gray-400" /><span className="text-sm font-medium">Field {idx + 1}</span></div><Button variant="ghost" size="sm" onClick={() => removeField(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
              <div className="grid grid-cols-3 gap-3"><Select label="Type" options={FORM_FIELD_TYPES.map(t => ({ label: t, value: t }))} value={field.type || 'text'} onChange={e => updateField(idx, { type: e.target.value as any })} /><Input label="Label" value={field.label || ''} onChange={e => updateField(idx, { label: e.target.value })} /><Input label="Name" value={field.name || ''} onChange={e => updateField(idx, { name: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.validation?.required || false} onChange={e => updateField(idx, { validation: { ...field.validation!, required: e.target.checked } })} />Required</label>
            </div>
          ))}</div></Card></div>
    </div>
  );
}
