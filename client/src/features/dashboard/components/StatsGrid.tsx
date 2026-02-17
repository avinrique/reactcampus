import { Building2, GraduationCap, BookOpen, ClipboardList, Users, Globe } from 'lucide-react';
import { StatCard } from './StatCard';
import type { DashboardStats } from '@/types/dashboard';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    { title: 'Total Colleges', value: stats.totalColleges, icon: <Building2 className="h-6 w-6 text-blue-600" />, color: 'bg-blue-100' },
    { title: 'Published', value: stats.publishedColleges, icon: <Globe className="h-6 w-6 text-green-600" />, color: 'bg-green-100' },
    { title: 'Courses', value: stats.totalCourses, icon: <GraduationCap className="h-6 w-6 text-purple-600" />, color: 'bg-purple-100' },
    { title: 'Exams', value: stats.totalExams, icon: <BookOpen className="h-6 w-6 text-orange-600" />, color: 'bg-orange-100' },
    { title: 'Leads', value: stats.totalLeads, icon: <ClipboardList className="h-6 w-6 text-yellow-600" />, color: 'bg-yellow-100' },
    { title: 'Users', value: stats.totalUsers, icon: <Users className="h-6 w-6 text-indigo-600" />, color: 'bg-indigo-100' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
