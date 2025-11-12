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
import type { Event } from './manage-events-sheet';
import { useEffect } from 'react';

const formSchema = z.object({
  discipline: z.string().min(2, 'Discipline is required.'),
  ageCategory: z.string().min(2, 'Age category is required.'),
  gender: z.enum(['Male', 'Female', 'Mixed']),
  weightClass: z.string().min(2, 'Weight class is required.'),
  status: z.enum(['Upcoming', 'Ongoing', 'Finished']),
  eventType: z.enum(['Individual', 'Team'], { required_error: 'Event type is required.' }),
  teamSize: z.coerce.number().optional(),
}).refine(data => {
    if (data.eventType === 'Team') {
        return data.teamSize && data.teamSize > 0;
    }
    return true;
}, {
    message: 'Team size must be a positive number for team events.',
    path: ['teamSize'],
});


type EventFormProps = {
  mode: 'create' | 'edit';
  event: Omit<Event, 'status'> | Event | null;
  onSave: (data: Omit<Event, 'id'> & { id?: number }) => void;
  onCancel: () => void;
};

export function EventForm({ mode, event, onSave, onCancel }: EventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        discipline: '',
        ageCategory: '',
        gender: 'Male',
        weightClass: '',
        status: 'Upcoming',
        eventType: 'Individual',
        teamSize: undefined,
        ...event,
    },
  });

  const eventType = form.watch('eventType');

  useEffect(() => {
    form.reset({
        discipline: '',
        ageCategory: '',
        gender: 'Male',
        weightClass: '',
        status: 'Upcoming',
        eventType: 'Individual',
        teamSize: undefined,
        ...event,
    });
  }, [event, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dataToSave = { ...values };
    if (dataToSave.eventType === 'Individual') {
        delete dataToSave.teamSize;
    }
    onSave({
      ...dataToSave,
      id: event?.id,
    });
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
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a discipline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Singles">Singles</SelectItem>
                  <SelectItem value="Doubles">Doubles</SelectItem>
                  <SelectItem value="Mixed Doubles">Mixed Doubles</SelectItem>
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
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an age category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="U15">U15</SelectItem>
                      <SelectItem value="U19">U19</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Mixed">Mixed</SelectItem>
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
                <Input placeholder="50 - 60 kg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {eventType === 'Team' && (
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Finished">Finished</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
