
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UploadCloud } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Coach } from './manage-coaches-sheet';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  slkfId: z.string().min(2, 'SLKF ID is required.'),
  wkfId: z.string().min(2, 'WKF ID is required.'),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

type CoachFormProps = {
  mode: 'view' | 'edit' | 'create';
  coach: Coach | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function CoachForm({ mode, coach, onSave, onCancel, isLoading = false }: CoachFormProps) {
  const isViewMode = mode === 'view';
  const [imagePreview, setImagePreview] = useState<string | null>(
    coach && 'photo' in coach ? coach.photo : (coach as any)?.photoUrl || null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: coach?.firstName || '',
      lastName: coach?.lastName || '',
      email: coach?.email || '',
      slkfId: coach?.slkfId || '',
      wkfId: coach?.wkfId || '',
      photoUrl: coach && 'photo' in coach ? coach.photo : (coach as any)?.photoUrl || '',
      dob: coach?.dob ? (coach.dob instanceof Date ? coach.dob : new Date(coach.dob as string)) : undefined,
    },
  });

  useEffect(() => {
    const photoValue = coach && 'photo' in coach ? coach.photo : (coach as any)?.photoUrl || '';
    const dobValue = coach?.dob ? (coach.dob instanceof Date ? coach.dob : new Date(coach.dob as string)) : undefined;

    const defaultValues = {
      firstName: coach?.firstName || '',
      lastName: coach?.lastName || '',
      email: coach?.email || '',
      slkfId: coach?.slkfId || '',
      wkfId: coach?.wkfId || '',
      photoUrl: photoValue,
      dob: dobValue,
    };
    form.reset(defaultValues);
    setImagePreview(photoValue || null);
  }, [coach, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      id: coach?.id,
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue('photoUrl', dataUrl, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John" {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Doe" {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. john.doe@example.com" {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild disabled={isViewMode}>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => isViewMode || date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    captionLayout="dropdown-nav"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slkfId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SLKF ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. SLKF-001" {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wkfId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WKF ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. WKF-101" {...field} disabled={isViewMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              {isViewMode ? (
                imagePreview ? (
                  <div className="relative w-32 h-32">
                    <Image src={imagePreview} alt="Coach Photo" fill objectFit="cover" className="rounded-lg" />
                  </div>
                ) : <p className="text-sm text-muted-foreground">No photo.</p>
              ) : (
                <FormControl>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file-coach"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <Image src={imagePreview} alt="Photo Preview" fill objectFit="cover" className="rounded-lg" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-2 rounded-lg">
                            Click or drag file to replace
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span>
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                        </div>
                      )}
                      <input id="dropzone-file-coach" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {!isViewMode && (
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
