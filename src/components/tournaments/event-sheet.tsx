'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { EventDTO, EventStatus, EventType, Discipline } from '@/types/api/events';
import { EventForm } from './event-form';
import { EventDetails } from './event-details';
import { X } from 'lucide-react';
import { z } from 'zod';

const formSchema = z.object({
  discipline: z.enum([Discipline.KATA, Discipline.KUMITE]),
  ageCategory: z.string(),
  gender: z.string(),
  weightClass: z.string().optional().or(z.literal('')),
  eventType: z.nativeEnum(EventType),
  teamSize: z.coerce.number().int().positive().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type EventSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'create' | 'edit';
  event: EventDTO | null;
  onSave: (data: FormValues) => void;
  isLoading?: boolean;
};

export function EventSheet({ open, onOpenChange, mode, event, onSave, isLoading = false }: EventSheetProps) {
  const titles = {
    view: 'View Event',
    edit: 'Edit Event',
    create: 'Create New Event',
  };

  const descriptions = {
    view: 'Here are the details for the event.',
    edit: 'Update the details for this event.',
    create: 'Fill out the form to create a new event.',
  };

  const handleSave = (data: FormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-0" showCloseButton={false}>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
        <div className="px-6">
          <SheetHeader className="mt-6">
            <SheetTitle>{titles[mode]}</SheetTitle>
            <SheetDescription>{descriptions[mode]}</SheetDescription>
          </SheetHeader>
          <div className="py-8">
            {mode === 'view' ? (
              <EventDetails event={event} />
            ) : (
              <EventForm mode={mode} event={event} onSave={handleSave} onCancel={() => onOpenChange(false)} isLoading={isLoading} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
