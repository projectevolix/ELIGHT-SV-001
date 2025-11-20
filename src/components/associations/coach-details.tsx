'use client';

import { type Coach } from './manage-coaches-sheet';
import { Mail, Calendar, IdCard, Trophy, User, X } from 'lucide-react';
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

type CoachDetailsProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coach: Coach | null;
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

export function CoachDetails({ open, onOpenChange, coach }: CoachDetailsProps) {
    if (!coach) {
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

    const photoUrl = coach.photo;
    const dobValue = typeof coach.dob === 'string' ? new Date(coach.dob) : coach.dob;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-lg overflow-y-auto p-0" showCloseButton={false}>
                <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </SheetClose>
                <div className="px-6">
                    <SheetHeader className="mt-6">
                        <SheetTitle>View Coach</SheetTitle>
                        <SheetDescription>Coach information and details</SheetDescription>
                    </SheetHeader>
                    <div className="py-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold font-headline">{coach.firstName} {coach.lastName}</h2>
                                <p className="text-muted-foreground">Coach Details</p>
                            </div>

                            {photoUrl && (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                    <Image
                                        src={photoUrl}
                                        alt={`${coach.firstName} ${coach.lastName}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <DetailItem
                                    icon={User}
                                    label="Full Name"
                                    value={`${coach.firstName} ${coach.lastName}`}
                                />
                                <DetailItem
                                    icon={Mail}
                                    label="Email"
                                    value={coach.email}
                                />
                                <DetailItem
                                    icon={Calendar}
                                    label="Date of Birth"
                                    value={format(dobValue, 'MMM d, yyyy')}
                                />
                                <DetailItem
                                    icon={IdCard}
                                    label="SLKF ID"
                                    value={coach.slkfId}
                                />
                                <DetailItem
                                    icon={Trophy}
                                    label="WKF ID"
                                    value={coach.wkfId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
