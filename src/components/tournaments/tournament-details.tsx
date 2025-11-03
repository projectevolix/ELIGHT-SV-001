'use client';

import { Tournament } from '@/app/tournaments/page';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Shield, Trophy, Users } from 'lucide-react';
import { format } from 'date-fns';

type TournamentDetailsProps = {
  tournament: Tournament | null;
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <Icon className="h-5 w-5 text-muted-foreground mt-1" />
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  </div>
);

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Ongoing':
      return 'default';
    case 'Upcoming':
      return 'secondary';
    case 'Finished':
      return 'outline';
    default:
      return 'default';
  }
};


export function TournamentDetails({ tournament }: TournamentDetailsProps) {
  if (!tournament) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-headline">{tournament.name}</h2>
        <p className="text-muted-foreground">Tournament Details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DetailItem icon={Trophy} label="Name" value={tournament.name} />
        <DetailItem icon={Shield} label="Grade" value={tournament.grade} />
        <DetailItem icon={MapPin} label="Venue" value={tournament.venue} />
        <DetailItem 
          icon={Calendar} 
          label="Start Date" 
          value={format(new Date(tournament.startDate), 'MMM d, yyyy')} 
        />
        <DetailItem 
          icon={Calendar} 
          label="End Date" 
          value={format(new Date(tournament.endDate), 'MMM d, yyyy')} 
        />
        <DetailItem 
          icon={Users} 
          label="Status" 
          value={<Badge variant={getStatusVariant(tournament.status)}>{tournament.status}</Badge>}
        />
      </div>
    </div>
  );
}
