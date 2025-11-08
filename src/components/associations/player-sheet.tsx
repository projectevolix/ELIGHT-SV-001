
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Player } from './manage-players-sheet';
import { PlayerForm } from './player-form';

type PlayerSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'edit' | 'create';
  player: Player | null;
  onSave: (data: Omit<Player, 'id'> & { id?: number }) => void;
};

export function PlayerSheet({ open, onOpenChange, mode, player, onSave }: PlayerSheetProps) {
  const titles = {
    edit: 'Edit Player',
    create: 'Create New Player',
  };

  const descriptions = {
    edit: 'Update the details for this player.',
    create: 'Fill out the form to create a new player.',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{titles[mode]}</SheetTitle>
          <SheetDescription>{descriptions[mode]}</SheetDescription>
        </SheetHeader>
        <div className="py-8">
            <PlayerForm
                mode={mode}
                player={player} 
                onSave={onSave}
                onCancel={() => onOpenChange(false)} 
            />
        </div>
      </SheetContent>
    </Sheet>
  );
}
