'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, PlusCircle, X } from 'lucide-react';
import { Tournament } from '@/app/tournaments/page';
import { Badge } from '@/components/ui/badge';
import { EventSheet } from './event-sheet';

export type Event = {
  id: number;
  discipline: string;
  ageCategory: string;
  gender: 'Male' | 'Female' | 'Mixed';
  weightClass: string;
  status: 'Upcoming' | 'Ongoing' | 'Finished';
};

const initialEvents: Event[] = [
  { id: 1, discipline: 'Singles', ageCategory: 'U19', gender: 'Male', weightClass: 'Featherweight', status: 'Upcoming' },
  { id: 2, discipline: 'Doubles', ageCategory: 'U19', gender: 'Female', weightClass: 'Bantamweight', status: 'Ongoing' },
  { id: 3, discipline: 'Mixed Doubles', ageCategory: 'Senior', gender: 'Mixed', weightClass: 'Heavyweight', status: 'Finished' },
  { id: 4, discipline: 'Singles', ageCategory: 'U15', gender: 'Male', weightClass: 'Lightweight', status: 'Upcoming' },
  { id: 5, discipline: 'Singles', ageCategory: 'U15', gender: 'Female', weightClass: 'Flyweight', status: 'Finished' },
];

type ManageEventsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament: Tournament | null;
};

export function ManageEventsSheet({ open, onOpenChange, tournament }: ManageEventsSheetProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [eventSheetOpen, setEventSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventSheetMode, setEventSheetMode] = useState<'create' | 'edit'>('create');


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

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setEventSheetMode('create');
    setEventSheetOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventSheetMode('edit');
    setEventSheetOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
  };
  
  const handleSaveEvent = (data: Omit<Event, 'id' | 'status'> & { id?: number }) => {
    const status: Event['status'] = 'Upcoming'; // Default status for new/edited events
    const eventWithStatus = { ...data, status };
    if (eventSheetMode === 'create') {
        setEvents([...events, { ...eventWithStatus, id: Date.now() }]);
    } else {
        setEvents(events.map(e => e.id === data.id ? { ...eventWithStatus, id: data.id } as Event : e));
    }
    setEventSheetOpen(false);
  };


  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-4xl p-0">
          <SheetHeader className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Manage Events</SheetTitle>
                <SheetDescription>
                  Add, edit, or remove events for {tournament?.name || 'the tournament'}.
                </SheetDescription>
              </div>
              <SheetClose asChild>
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="p-6 pt-0">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">
                      A list of events in this tournament.
                  </span>
                  <Button onClick={handleCreateEvent}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Event
                  </Button>
              </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discipline</TableHead>
                    <TableHead>Age Category</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Weight Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.discipline}</TableCell>
                      <TableCell>{event.ageCategory}</TableCell>
                      <TableCell>{event.gender}</TableCell>
                      <TableCell>{event.weightClass}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(event.status)}>{event.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <EventSheet
        open={eventSheetOpen}
        onOpenChange={setEventSheetOpen}
        mode={eventSheetMode}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />
    </>
  );
}
