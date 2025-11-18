
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
import { useCreateCoach, useUpdateCoach } from '@/hooks/api/useCoachMutations';
import { CreateCoachPayload, UpdateCoachPayload } from '@/types/api/coaches';

type CoachSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'edit' | 'create';
  coach: Coach | null;
  associationId?: number;
};

export function CoachSheet({ open, onOpenChange, mode, coach, associationId }: CoachSheetProps) {
  const createMutation = useCreateCoach();
  const updateMutation = useUpdateCoach();

  const titles = {
    edit: 'Edit Coach',
    create: 'Create New Coach',
  };

  const descriptions = {
    edit: 'Update the details for this coach.',
    create: 'Fill out the form to create a new coach.',
  };

  const handleSave = (data: any) => {
    if (!associationId) return;

    if (mode === 'create') {
      const payload: CreateCoachPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dob: data.dob instanceof Date ? data.dob.toISOString().split('T')[0] : data.dob,
        photo: data.photoUrl || '',
        slkfId: data.slkfId,
        wkfId: data.wkfId,
      };
      createMutation.mutate({ associationId, payload }, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else if (coach) {
      const payload: UpdateCoachPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dob: data.dob instanceof Date ? data.dob.toISOString().split('T')[0] : data.dob,
        photo: data.photoUrl || '',
        slkfId: data.slkfId,
        wkfId: data.wkfId,
      };
      updateMutation.mutate({ id: coach.id, associationId, payload }, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
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
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
