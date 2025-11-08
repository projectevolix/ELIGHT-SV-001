
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Player } from './manage-players-sheet';
import { PlayerForm } from './player-form';

type PlayerDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player | null;
};

export function PlayerDetailsDialog({ open, onOpenChange, player }: PlayerDetailsDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Player Details</DialogTitle>
          <DialogDescription>Here are the details for this player.</DialogDescription>
        </DialogHeader>
        <div className="py-8">
            <PlayerForm
                mode="view"
                player={player} 
                onSave={() => {}} // No save in view mode
                onCancel={() => onOpenChange(false)} 
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
