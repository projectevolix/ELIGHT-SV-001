'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventDTO, EventStatus, EventType, Discipline } from '@/types/api/events';
import { useEffect } from 'react';

const formSchema = z.object({
  discipline: z.enum([Discipline.KATA, Discipline.KUMITE], {
    required_error: 'Discipline is required.',
  }),
  ageCategory: z.string().min(1, 'Age category is required.'),
  gender: z.string().min(1, 'Gender is required.'),
  weightClass: z.string().min(1, 'Weight class is required.'),
  status: z.nativeEnum(EventStatus, { required_error: 'Status is required.' }),
  eventType: z.nativeEnum(EventType, { required_error: 'Event type is required.' }),
  rounds: z.coerce.number().min(0, 'Rounds must be 0 or greater.'),
  // teamSize: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type EventFormProps = {
  mode: 'create' | 'edit';
  event: EventDTO | null;
  onSave: (data: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function EventForm({ mode, event, onSave, onCancel, isLoading = false }: EventFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discipline: Discipline.KATA,
      ageCategory: '',
      gender: '',
      weightClass: '',
      status: EventStatus.DRAFT,
      eventType: EventType.INDIVIDUAL,
      rounds: 0,
      // teamSize: undefined,
    },
  });

  const eventType = form.watch('eventType');

  useEffect(() => {
    if (event) {
      form.reset({
        discipline: (event.discipline as any),
        ageCategory: event.ageCategory || '',
        gender: event.gender?.toUpperCase() || '',
        weightClass: event.weightClass || '',
        status: event.status,
        eventType: event.eventType,
        rounds: event.rounds || 0,
        // teamSize: undefined,
      });
    } else {
      form.reset({
        discipline: Discipline.KATA,
        ageCategory: '',
        gender: '',
        weightClass: '',
        status: EventStatus.DRAFT,
        eventType: EventType.INDIVIDUAL,
        rounds: 0,
        // teamSize: undefined,
      });
    }
  }, [event, form]);

  function onSubmit(values: FormValues) {
    onSave(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="discipline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discipline</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a discipline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Discipline.KATA}>KATA</SelectItem>
                  <SelectItem value={Discipline.KUMITE}>KUMITE</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ageCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. U15, 12-15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="weightClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight Class</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 50-60, 44KG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EventType.INDIVIDUAL}>Individual</SelectItem>
                    <SelectItem value={EventType.TEAM}>Team</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rounds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rounds</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Commented out - not in API model
        {eventType === EventType.TEAM && (
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Members</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EventStatus.DRAFT}>DRAFT</SelectItem>
                  <SelectItem value={EventStatus.PUBLISHED}>PUBLISHED</SelectItem>
                  <SelectItem value={EventStatus.COMPLETED}>COMPLETED</SelectItem>
                  <SelectItem value={EventStatus.LOCKED}>LOCKED</SelectItem>
                  <SelectItem value={EventStatus.REG_CLOSED}>REG_CLOSED</SelectItem>
                  <SelectItem value={EventStatus.CANCELLED}>CANCELLED</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
}
