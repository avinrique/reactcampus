import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLead, useChangeLeadStatus, useAddLeadNote } from '../hooks/useLeads';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { LEAD_STATUSES, LEAD_STATUS_COLORS, PRIORITY_COLORS } from '@/config/constants';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { ArrowLeft, Clock } from 'lucide-react';

export default function LeadDetailPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(id || '');
  const changeStatus = useChangeLeadStatus(); const addNote = useAddLeadNote();
  const [newStatus, setNewStatus] = useState(''); const [statusNote, setStatusNote] = useState(''); const [noteContent, setNoteContent] = useState('');
  if (isLoading || !lead) return <LoadingOverlay />;
  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => navigate('/admin/leads')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      <Card><CardTitle className="mb-4">Lead Details</CardTitle><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-gray-500">Name:</span> {lead.name}</div><div><span className="text-gray-500">Email:</span> {lead.email || '-'}</div><div><span className="text-gray-500">Phone:</span> {lead.phone || '-'}</div><div><span className="text-gray-500">Status:</span> <StatusBadge status={lead.status} colorMap={LEAD_STATUS_COLORS} /></div><div><span className="text-gray-500">Priority:</span> <StatusBadge status={lead.priority} colorMap={PRIORITY_COLORS} /></div></div></Card>
      <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
        <Card><CardTitle className="mb-4">Change Status</CardTitle><div className="space-y-3"><Select options={LEAD_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))} value={newStatus} onChange={e => setNewStatus(e.target.value)} placeholder="Select status" /><Textarea placeholder="Note (optional)" value={statusNote} onChange={e => setStatusNote(e.target.value)} /><Button onClick={() => { if (newStatus) changeStatus.mutate({ id: id!, data: { status: newStatus as any, note: statusNote } }, { onSuccess: () => { setNewStatus(''); setStatusNote(''); } }); }} isLoading={changeStatus.isPending} disabled={!newStatus}>Update Status</Button></div></Card>
      </PermissionGuard>
      <PermissionGuard permission={PERMISSIONS.LEAD_UPDATE}>
        <Card><CardTitle className="mb-4">Add Note</CardTitle><div className="space-y-3"><Textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Write a note..." /><Button onClick={() => { if (noteContent.trim()) addNote.mutate({ id: id!, data: { content: noteContent } }, { onSuccess: () => setNoteContent('') }); }} isLoading={addNote.isPending}>Add Note</Button></div></Card>
      </PermissionGuard>
      <Card><CardTitle className="mb-4">Timeline</CardTitle><div className="space-y-4">{[...lead.statusHistory].reverse().map((e, i) => <div key={i} className="flex items-start gap-3 text-sm"><Clock className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" /><div><p><span className="capitalize">{e.from}</span> &rarr; <span className="capitalize font-medium">{e.to}</span></p>{e.note && <p className="text-gray-500">{e.note}</p>}<p className="text-xs text-gray-400">{new Date(e.changedAt).toLocaleString()}</p></div></div>)}</div></Card>
    </div>
  );
}
