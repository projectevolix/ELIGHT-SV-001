'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tournament } from '@/app/tournaments/page';
import { TournamentForm } from './tournament-form';
import { TournamentDetails } from './tournament-details';
import Image from 'next/image';

type TournamentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'edit' | 'create';
  tournament: Tournament | null;
  onSave: (data: Tournament) => void;
};

export function TournamentSheet({ open, onOpenChange, mode, tournament, onSave }: TournamentSheetProps) {
  const titles = {
    view: 'View Tournament',
    edit: 'Edit Tournament',
    create: 'Create New Tournament',
  };

  const descriptions = {
    view: 'Here are the details for the tournament.',
    edit: 'Update the details for the tournament.',
    create: 'Fill out the form to create a new tournament.',
  };
  
  const showBanner = mode === 'view' && tournament?.bannerUrl;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-0" showCloseButton={false}>
        {showBanner && (
          <div className="relative h-48 w-full mb-6">
            <Image src={tournament.bannerUrl!} alt={tournament.name} layout="fill" objectFit="cover" />
          </div>
        )}
        <div className="px-6">
            <SheetHeader>
              <SheetTitle>{titles[mode]}</SheetTitle>
              <SheetDescription>{descriptions[mode]}</SheetDescription>
            </SheetHeader>
            <div className="py-8">
              {mode === 'view' ? (
                <TournamentDetails tournament={tournament} />
              ) : (
                <TournamentForm mode={mode} tournament={tournament} onSave={onSave} />
              )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
