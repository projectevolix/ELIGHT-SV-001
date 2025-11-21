
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { RegistrationForm } from './registration-form';
import type { Tournament } from '@/types/api/tournaments';

type RegistrationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  isLoading?: boolean;
  preSelectedTournament?: Tournament | null;
};

export function RegistrationSheet({ open, onOpenChange, onSave, isLoading = false, preSelectedTournament = null }: RegistrationSheetProps) {

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Registration Form</SheetTitle>
          <SheetDescription>Fill out the form to register players for a tournament event.</SheetDescription>
        </SheetHeader>
        <div className="py-8">
          <RegistrationForm
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
            preSelectedTournamentId={preSelectedTournament?.id.toString()}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
