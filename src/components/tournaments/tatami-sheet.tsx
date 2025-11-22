'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { TatamiForm } from './tatami-form';
import type { TatamiDTO } from '@/types/api/tatamis';
import { TatamiAvailabilityStatus as TAS } from '@/types/api/tatamis';
import { useCreateTatami, useUpdateTatami } from '@/hooks/api/useTatamis';

type TatamiSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tatami?: TatamiDTO | null;
    tournamentId: number;
};

export function TatamiSheet({
    open,
    onOpenChange,
    tatami,
    tournamentId,
}: TatamiSheetProps) {
    const createMutation = useCreateTatami();
    const updateMutation = useUpdateTatami();

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = (values: any) => {
        if (tatami) {
            updateMutation.mutate(
                {
                    id: tatami.id,
                    payload: {
                        tournamentId,
                        number: values.number,
                        capacity: values.capacity,
                        availabilityStatus: tatami.availabilityStatus, // Keep current status
                    },
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                }
            );
        } else {
            createMutation.mutate(
                {
                    tournamentId,
                    number: values.number,
                    capacity: values.capacity,
                    availabilityStatus: TAS.AVAILABLE, // Default to AVAILABLE for new tatamis
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                }
            );
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{tatami ? 'Edit Tatami' : 'Create New Tatami'}</SheetTitle>
                    <SheetDescription>
                        {tatami ? 'Update the tatami details' : 'Add a new tatami for the tournament'}
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                    <TatamiForm
                        tatami={tatami}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
