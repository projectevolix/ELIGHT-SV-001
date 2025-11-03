'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Tournament } from '@/app/tournaments/page';
import { TournamentForm } from './tournament-form';
import { TournamentDetails } from './tournament-details';
import Image from 'next/image';
import { X } from 'lucide-react';

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
        {showBanner ? (
          <div className="relative h-48 w-full">
            <Image src={tournament.bannerUrl!} alt={tournament.name} layout="fill" objectFit="cover" />
            <SheetClose className="absolute right-4 top-4 rounded-full bg-black/50 p-1 text-white/80 opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        ) : (
           <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
        )}
        <div className="px-6">
            <SheetHeader className={showBanner ? 'mt-6' : ''}>
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
