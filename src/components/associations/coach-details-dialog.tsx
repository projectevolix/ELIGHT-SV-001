
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { X } from 'lucide-react';
import type { Coach } from './manage-coaches-sheet';
import { CoachDetails } from './coach-details';

type CoachDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: Coach | null;
};

export function CoachDetailsDialog({ open, onOpenChange, coach }: CoachDetailsDialogProps) {

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-0" showCloseButton={false}>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
        <div className="px-6">
          <SheetHeader className="mt-6">
            <SheetTitle>View Coach</SheetTitle>
            <SheetDescription>Coach information and details</SheetDescription>
          </SheetHeader>
          <div className="py-8">
            <CoachDetails coach={coach} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
