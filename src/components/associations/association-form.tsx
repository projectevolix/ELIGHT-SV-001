
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
import { useEffect } from 'react';
import type { Association } from '@/types/api/associations';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  province: z.string().min(2, 'Province is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Phone number is required.'),
  president: z.string().min(2, 'President name is required.'),
});

type AssociationFormProps = {
  mode: 'create' | 'edit';
  association: Association | null;
  onSave: (data: Omit<Association, 'id' | 'createdAt' | 'updatedAt'> & { id?: string | number }) => void;
  onCancel: () => void;
};

export function AssociationForm({ mode, association, onSave, onCancel }: AssociationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      province: '',
      email: '',
      phone: '',
      president: '',
      ...association,
    },
  });

  useEffect(() => {
    form.reset({
      name: '',
      province: '',
      email: '',
      phone: '',
      president: '',
      ...association,
    });
  }, [association, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      id: association?.id,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Association Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ontario Basketball" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ontario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. info@basketball.on.ca" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 416-555-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="president"
            render={({ field }) => (
              <FormItem>
                <FormLabel>President</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
