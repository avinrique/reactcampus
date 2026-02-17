import { useLeads } from '../hooks/useLeads';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { LEAD_STATUSES, LEAD_STATUS_COLORS } from '@/config/constants';
import { Link } from 'react-router-dom';

export default function LeadPipelinePage() {
  const { data, isLoading } = useLeads({ limit: 200 });
  if (isLoading) return <LoadingOverlay />;
  const leads = data?.data || [];
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Lead Pipeline</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">{LEAD_STATUSES.map(status => {
        const items = leads.filter(l => l.status === status);
        return (<div key={status} className="min-w-[250px] flex-shrink-0"><div className="flex items-center justify-between mb-3"><StatusBadge status={status} colorMap={LEAD_STATUS_COLORS} /><span className="text-sm text-gray-500">{items.length}</span></div><div className="space-y-2">{items.map(lead => <Card key={lead._id} className="!p-3 cursor-pointer hover:shadow-md"><Link to={`/admin/leads/${lead._id}`}><p className="font-medium text-sm">{lead.name}</p><p className="text-xs text-gray-500">{lead.email || lead.phone}</p></Link></Card>)}</div></div>);
      })}</div>
    </div>
  );
}
