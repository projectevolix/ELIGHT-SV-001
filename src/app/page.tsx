import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { UpcomingEvents } from '@/components/dashboard/upcoming-events';
import { Users, CalendarCheck, Trophy, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold font-headline tracking-tight">
        Dashboard
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Teams" value="1,250" icon={Users} />
        <StatCard title="Matches Played" value="10,482" icon={CalendarCheck} />
        <StatCard title="Tournaments Won" value="89" icon={Trophy} />
        <StatCard title="Active Players" value="+573" icon={TrendingUp} />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-8 lg:col-span-1">
          <UpcomingEvents />
          <UpcomingEvents />
        </div>
      </div>
    </DashboardLayout>
  );
}
