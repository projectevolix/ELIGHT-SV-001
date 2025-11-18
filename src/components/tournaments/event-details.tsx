'use client';

import { EventDTO } from '@/types/api/events';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, Award, Dumbbell, ListChecks, Calendar } from 'lucide-react';
import { format } from 'date-fns';

type EventDetailsProps = {
  event: EventDTO | null;
};

const DetailItem = ({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ElementType, 
  label: string, 
  value: React.ReactNode 
}) => (
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
    case 'PUBLISHED':
      return 'default';
    case 'DRAFT':
      return 'secondary';
    case 'COMPLETED':
      return 'outline';
    case 'LOCKED':
      return 'destructive';
    case 'REG_CLOSED':
      return 'default';
    case 'CANCELLED':
      return 'outline';
    default:
      return 'default';
  }
};

export function EventDetails({ event }: EventDetailsProps) {
  if (!event) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-headline">{event.discipline}</h2>
        <p className="text-muted-foreground">Event Details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DetailItem icon={Zap} label="Discipline" value={event.discipline} />
        <DetailItem icon={Award} label="Age Category" value={event.ageCategory} />
        <DetailItem icon={Users} label="Gender" value={event.gender} />
        <DetailItem icon={Dumbbell} label="Weight Class" value={event.weightClass} />
        <DetailItem icon={ListChecks} label="Event Type" value={event.eventType} />
        <DetailItem icon={Calendar} label="Rounds" value={event.rounds} />
        <DetailItem
          icon={Badge}
          label="Status"
          value={<Badge variant={getStatusVariant(event.status)}>{event.status}</Badge>}
        />
        {event.createdAt && (
          <DetailItem
            icon={Calendar}
            label="Created"
            value={format(new Date(event.createdAt), 'MMM d, yyyy')}
          />
        )}
        {event.createdBy && (
          <DetailItem icon={Users} label="Created By" value={event.createdBy} />
        )}
      </div>
    </div>
  );
}
