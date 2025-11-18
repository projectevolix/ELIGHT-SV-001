
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Association } from '@/types/api/associations';
import { AssociationForm } from './association-form';

type AssociationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'edit' | 'create';
  association: Association | null;
  onSave: (data: Omit<Association, 'id' | 'createdAt' | 'updatedAt'> & { id?: string | number }) => void;
  isLoading?: boolean;
};

export function AssociationSheet({ open, onOpenChange, mode, association, onSave, isLoading = false }: AssociationSheetProps) {
  const titles = {
    edit: 'Edit Association',
    create: 'Create New Association',
  };

  const descriptions = {
    edit: 'Update the details for this association.',
    create: 'Fill out the form to create a new association.',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{titles[mode]}</SheetTitle>
          <SheetDescription>{descriptions[mode]}</SheetDescription>
        </SheetHeader>
        <div className="py-8">
          <AssociationForm
            mode={mode}
            association={association}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
