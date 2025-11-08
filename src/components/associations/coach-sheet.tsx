
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Coach } from './manage-coaches-sheet';
import { CoachForm } from './coach-form';

type CoachSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'edit' | 'create';
  coach: Coach | null;
  onSave: (data: Omit<Coach, 'id'> & { id?: number }) => void;
};

export function CoachSheet({ open, onOpenChange, mode, coach, onSave }: CoachSheetProps) {
  const titles = {
    edit: 'Edit Coach',
    create: 'Create New Coach',
  };

  const descriptions = {
    edit: 'Update the details for this coach.',
    create: 'Fill out the form to create a new coach.',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{titles[mode]}</SheetTitle>
          <SheetDescription>{descriptions[mode]}</SheetDescription>
        </SheetHeader>
        <div className="py-8">
            <CoachForm
                mode={mode}
                coach={coach} 
                onSave={onSave}
                onCancel={() => onOpenChange(false)} 
            />
        </div>
      </SheetContent>
    </Sheet>
  );
}
