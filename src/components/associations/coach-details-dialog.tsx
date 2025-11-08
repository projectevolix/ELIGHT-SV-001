
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Coach } from './manage-coaches-sheet';
import { CoachForm } from './coach-form';

type CoachDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coach: Coach | null;
};

export function CoachDetailsDialog({ open, onOpenChange, coach }: CoachDetailsDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Coach Details</DialogTitle>
          <DialogDescription>Here are the details for this coach.</DialogDescription>
        </DialogHeader>
        <div className="py-8">
            <CoachForm
                mode="view"
                coach={coach} 
                onSave={() => {}} // No save in view mode
                onCancel={() => onOpenChange(false)} 
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
