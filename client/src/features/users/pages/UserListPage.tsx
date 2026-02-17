import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUsers, useDeleteUser, useActivateUser } from '../hooks/useUsers';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/config/permissions';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { User } from '@/types/user';

export default function UserListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useUsers({ page, limit: 20, search });
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const handleSearch = useCallback((val: string) => { setSearch(val); setPage(1); }, []);

  const columns: Column<User>[] = [
    { key: 'firstName', header: 'Name', render: (u) => `${u.firstName} ${u.lastName}` },
    { key: 'email', header: 'Email' },
    { key: 'roles', header: 'Roles', render: (u) => <div className="flex gap-1 flex-wrap">{u.roles?.map((r: any) => <Badge key={r._id || r} variant="info">{r.displayName || r.name || r}</Badge>)}</div> },
    { key: 'isActive', header: 'Status', render: (u) => <Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', header: 'Actions', render: (u) => (
      <div className="flex gap-2">
        <PermissionGuard permission={PERMISSIONS.USER_UPDATE}><Link to={`/admin/users/${u._id}/edit`}><Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button></Link></PermissionGuard>
        <PermissionGuard permission={PERMISSIONS.USER_ACTIVATE}><Button variant="ghost" size="sm" onClick={() => activateUser.mutate(u._id)}>{u.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}</Button></PermissionGuard>
        <PermissionGuard permission={PERMISSIONS.USER_DELETE}><Button variant="ghost" size="sm" onClick={() => setDeleteId(u._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></PermissionGuard>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Users</h1><PermissionGuard permission={PERMISSIONS.USER_CREATE}><Link to="/admin/users/new"><Button><Plus className="h-4 w-4 mr-2" />Add User</Button></Link></PermissionGuard></div>
      <SearchInput value={search} onChange={handleSearch} placeholder="Search users..." />
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteUser.mutate(deleteId); setDeleteId(null); } }} title="Delete User" message="Are you sure?" confirmLabel="Delete" isLoading={deleteUser.isPending} />
    </div>
  );
}
