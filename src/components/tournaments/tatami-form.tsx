'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import type { TatamiDTO } from '@/types/api/tatamis';

const formSchema = z.object({
    number: z.coerce.number().int().positive('Tatami number must be a positive number'),
    capacity: z.coerce.number().int().positive('Capacity must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

type TatamiFormProps = {
    tatami?: TatamiDTO | null;
    isSubmitting?: boolean;
    onSubmit: (values: FormValues) => void;
};

export function TatamiForm({ tatami, isSubmitting = false, onSubmit }: TatamiFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            number: tatami?.number || undefined,
            capacity: tatami?.capacity || undefined,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tatami Number</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="4" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Saving...' : tatami ? 'Update Tatami' : 'Create Tatami'}
                </Button>
            </form>
        </Form>
    );
}
