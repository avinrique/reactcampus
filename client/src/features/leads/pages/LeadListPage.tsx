import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLeads, useDeleteLead } from '../hooks/useLeads';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { LEAD_STATUSES, LEAD_STATUS_COLORS, PRIORITY_COLORS } from '@/config/constants';
import { Eye, Trash2 } from 'lucide-react';
import type { Lead } from '@/types/lead';

export default function LeadListPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(''); const [status, setStatus] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useLeads({ page, limit: 20, search, status: status || undefined }); const deleteLead = useDeleteLead();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
  const columns: Column<Lead>[] = [
    { key: 'name', header: 'Name' }, { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (l) => <StatusBadge status={l.status} colorMap={LEAD_STATUS_COLORS} /> },
    { key: 'priority', header: 'Priority', render: (l) => <StatusBadge status={l.priority} colorMap={PRIORITY_COLORS} /> },
    { key: 'createdAt', header: 'Created', render: (l) => new Date(l.createdAt).toLocaleDateString() },
    { key: 'actions', header: 'Actions', render: (l) => (<div className="flex gap-2"><Link to={`/admin/leads/${l._id}`}><Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button></Link><PermissionGuard permission={PERMISSIONS.LEAD_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(l._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard></div>) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Leads</h1><Link to="/admin/leads/pipeline"><Button variant="outline">Pipeline View</Button></Link></div>
      <div className="flex gap-4"><SearchInput value={search} onChange={handleSearch} className="flex-1" /><Select options={[{ label: 'All', value: '' }, ...LEAD_STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))]} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="w-40" /></div>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteLead.mutate(deleteId); setDeleteId(null); } }} title="Delete" message="Are you sure?" confirmLabel="Delete" />
    </div>
  );
}
