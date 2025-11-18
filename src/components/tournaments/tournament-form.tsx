
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UploadCloud } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tournament } from '@/app/(root)/tournaments/page';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUsers } from '@/hooks/api/useUsers';
import MultiSelect from '../ui/multi-select';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  grade: z.enum(['National', 'Provincial', 'Club']),
  venue: z.string().min(2, 'Venue is required.'),
  startDate: z.date({ required_error: 'A start date is required.' }),
  endDate: z.date({ required_error: 'An end date is required.' }),
  registrationStartDate: z.date({ required_error: 'A registration start date is required.' }),
  registrationEndDate: z.date({ required_error: 'A registration end date is required.' }),
  admin: z.array(z.string()).min(1, 'Please select at least one admin.'),
  bannerUrl: z.string().url().optional().or(z.literal('')),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
}).refine(data => data.registrationEndDate >= data.registrationStartDate, {
  message: "Registration end date cannot be before start date",
  path: ["registrationEndDate"],
}).refine(data => data.startDate > data.registrationEndDate, {
  message: "Tournament start date must be after registration ends",
  path: ["startDate"],
});

type TournamentFormProps = {
  mode: 'view' | 'edit' | 'create';
  tournament: Omit<Tournament, 'status'> | null;
  onSave: (data: Omit<Tournament, 'status' | 'id'> & { id?: number }) => void;
};

export function TournamentForm({ mode, tournament, onSave }: TournamentFormProps) {
  const isViewMode = mode === 'view';
  const [imagePreview, setImagePreview] = useState<string | null>(tournament?.bannerUrl || null);
  const { data: admins = [], isPending: adminsLoading } = useUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      grade: 'Club',
      venue: '',
      admin: [],
      bannerUrl: '',
      ...tournament,
      admin: tournament?.admin ? [tournament.admin] : [],
    },
  });

  useEffect(() => {
    const defaultValues = {
      name: '',
      grade: 'Club',
      venue: '',
      admin: [],
      bannerUrl: '',
      ...tournament,
      admin: tournament?.admin ? [tournament.admin] : [],
    };
    form.reset(defaultValues);
    setImagePreview(defaultValues.bannerUrl || null);
  }, [tournament, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      id: tournament?.id,
      admin: values.admin.join(', '), // Convert array to string for saving
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue('bannerUrl', dataUrl, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const adminOptions = admins.map(admin => ({
    value: admin.id.toString(),
    label: admin.name
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Name</FormLabel>
              <FormControl>
                <Input placeholder="Summer Championship 2024" {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isViewMode}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="National">National</SelectItem>
                  <SelectItem value="Provincial">Provincial</SelectItem>
                  <SelectItem value="Club">Club</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="e.g. North America" {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registrationStartDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Registration Starts</FormLabel>
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
                      disabled={(date) => isViewMode || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registrationEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Registration Ends</FormLabel>
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
                      disabled={(date) => isViewMode || date < (form.getValues('registrationStartDate') || new Date("1900-01-01"))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
                      disabled={(date) => isViewMode || date < (form.getValues('registrationEndDate') || new Date("1900-01-01"))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
                      disabled={(date) => isViewMode || date < (form.getValues('startDate') || new Date("1900-01-01"))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="admin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrator</FormLabel>
              <FormControl>
                <MultiSelect
                    options={adminOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder={adminsLoading ? 'Loading...' : 'Select administrators...'}
                    className={isViewMode ? 'pointer-events-none opacity-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="bannerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              {isViewMode ? (
                imagePreview ? null : <p className="text-sm text-muted-foreground">No banner image.</p>
              ) : (
                <FormControl>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <Image src={imagePreview} alt="Banner Preview" layout="fill" objectFit="cover" className="rounded-lg" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-center p-2 rounded-lg">
                            Click or drag file to replace
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                        </div>
                      )}
                      <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                </FormControl>
              )}
              <FormDescription>
                {isViewMode ? "" : "Upload a banner image for the tournament."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isViewMode && <Button type="submit">Save</Button>}
      </form>
    </Form>
  );
}

    