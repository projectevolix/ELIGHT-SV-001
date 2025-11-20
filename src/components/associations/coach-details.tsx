'use client';

import { type Coach } from './manage-coaches-sheet';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, IdCard, Trophy, User } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

type CoachDetailsProps = {
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

export function CoachDetails({ coach }: CoachDetailsProps) {
    if (!coach) return null;

    const photoUrl = coach.photo;
    const dobValue = typeof coach.dob === 'string' ? new Date(coach.dob) : coach.dob;

    return (
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
    );
}
