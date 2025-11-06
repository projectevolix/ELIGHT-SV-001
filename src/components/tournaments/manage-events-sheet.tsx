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

type Event = {
  id: number;
  discipline: string;
  ageCategory: string;
  gender: 'Male' | 'Female' | 'Mixed';
  maxEntries: number;
  fee: number;
};

const initialEvents: Event[] = [
  { id: 1, discipline: 'Singles', ageCategory: 'U19', gender: 'Male', maxEntries: 64, fee: 25 },
  { id: 2, discipline: 'Doubles', ageCategory: 'U19', gender: 'Female', maxEntries: 32, fee: 40 },
  { id: 3, discipline: 'Mixed Doubles', ageCategory: 'Senior', gender: 'Mixed', maxEntries: 16, fee: 50 },
  { id: 4, discipline: 'Singles', ageCategory: 'U15', gender: 'Male', maxEntries: 64, fee: 20 },
  { id: 5, discipline: 'Singles', ageCategory: 'U15', gender: 'Female', maxEntries: 64, fee: 20 },
];

type ManageEventsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament: Tournament | null;
};

export function ManageEventsSheet({ open, onOpenChange, tournament }: ManageEventsSheetProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const handleAddEvent = () => {
    // Logic to add a new event - opens another form/dialog
    console.log('Add event for tournament:', tournament?.name);
  };

  const handleEditEvent = (event: Event) => {
    // Logic to edit an event
    console.log('Edit event:', event.id);
  };

  const handleDeleteEvent = (eventId: number) => {
    // Logic to delete an event
    setEvents(events.filter(e => e.id !== eventId));
  };

  return (
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
                <Button onClick={handleAddEvent}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                </Button>
            </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Age Category</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Max Entries</TableHead>
                  <TableHead>Fee ($)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.discipline}</TableCell>
                    <TableCell>{event.ageCategory}</TableCell>
                    <TableCell>{event.gender}</TableCell>
                    <TableCell>{event.maxEntries}</TableCell>
                    <TableCell>{event.fee.toFixed(2)}</TableCell>
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
  );
}
