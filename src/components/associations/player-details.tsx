'use client';

import { type Player } from './manage-players-sheet';
import { Calendar, Trophy, User, Weight, X } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';

type PlayerDetailsProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    player: Player | null;
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    </div>
);

export function PlayerDetails({ open, onOpenChange, player }: PlayerDetailsProps) {
    if (!player) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:max-w-lg overflow-y-auto p-0" showCloseButton={false}>
                    <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        );
    }

    const photoUrl = player.photoUrl;
    const dobValue = typeof player.dob === 'string' ? new Date(player.dob) : player.dob;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto p-0" showCloseButton={false}>
                <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </SheetClose>
                <div className="px-6">
                    <SheetHeader className="mt-6">
                        <SheetTitle>View Player</SheetTitle>
                        <SheetDescription>Player information and details</SheetDescription>
                    </SheetHeader>
                    <div className="py-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold font-headline">{player.firstName} {player.lastName}</h2>
                                <p className="text-muted-foreground">Player Details</p>
                            </div>

                            {photoUrl && (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                    <Image
                                        src={photoUrl}
                                        alt={`${player.firstName} ${player.lastName}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <DetailItem
                                    icon={User}
                                    label="Full Name"
                                    value={`${player.firstName} ${player.lastName}`}
                                />
                                <DetailItem
                                    icon={Weight}
                                    label="Weight"
                                    value={player.weight ? `${player.weight} kg` : 'N/A'}
                                />
                                <DetailItem
                                    icon={Calendar}
                                    label="Date of Birth"
                                    value={format(dobValue, 'MMM d, yyyy')}
                                />
                                <DetailItem
                                    icon={Trophy}
                                    label="Kyu Level"
                                    value={player.kyuLevel}
                                />
                                <DetailItem
                                    icon={User}
                                    label="Gender"
                                    value={player.gender}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
