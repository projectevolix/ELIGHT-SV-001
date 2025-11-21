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
import MultiSelect from '@/components/ui/multi-select';
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
          render={({ field }) => {
            const disciplineOptions = [
              { value: Discipline.KATA, label: 'KATA' },
              { value: Discipline.KUMITE, label: 'KUMITE' },
            ];
            return (
              <FormItem>
                <FormLabel>Discipline</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={disciplineOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    mode="single"
                    placeholder="Select a discipline"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
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
            render={({ field }) => {
              const genderOptions = [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
              ];
              return (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={genderOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      mode="single"
                      placeholder="Select gender"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
            render={({ field }) => {
              const eventTypeOptions = [
                { value: EventType.INDIVIDUAL, label: 'Individual' },
                { value: EventType.TEAM, label: 'Team' },
              ];
              return (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={eventTypeOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      mode="single"
                      placeholder="Select event type"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
          render={({ field }) => {
            const statusOptions = [
              { value: EventStatus.DRAFT, label: 'DRAFT' },
              { value: EventStatus.PUBLISHED, label: 'PUBLISHED' },
              { value: EventStatus.COMPLETED, label: 'COMPLETED' },
              { value: EventStatus.LOCKED, label: 'LOCKED' },
              { value: EventStatus.REG_CLOSED, label: 'REG_CLOSED' },
              { value: EventStatus.CANCELLED, label: 'CANCELLED' },
            ];
            return (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={statusOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    mode="single"
                    placeholder="Select a status"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
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
