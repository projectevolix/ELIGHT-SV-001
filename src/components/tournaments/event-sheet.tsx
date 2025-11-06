'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import { Event } from './manage-events-sheet';
import { EventForm } from './event-form';
import { Button } from '@/components/ui/button';

type EventSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  event: Event | null;
  onSave: (data: Omit<Event, 'status'>) => void;
};

export function EventSheet({ open, onOpenChange, mode, event, onSave }: EventSheetProps) {
  const titles = {
    edit: 'Edit Event',
    create: 'Create New Event',
  };

  const descriptions = {
    edit: 'Update the details for this event.',
    create: 'Fill out the form to create a new event.',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{titles[mode]}</SheetTitle>
          <SheetDescription>{descriptions[mode]}</SheetDescription>
        </SheetHeader>
        <div className="py-8">
            <EventForm 
                mode={mode}
                event={event} 
                onSave={onSave}
                onCancel={() => onOpenChange(false)} 
            />
        </div>
      </SheetContent>
    </Sheet>
  );
}
