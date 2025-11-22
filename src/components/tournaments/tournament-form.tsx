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
import { CalendarIcon, UploadCloud, ChevronsUpDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUsers } from '@/hooks/api/useUsers';
import type { Tournament, TournamentGrade, TournamentStatus } from '@/types/api/tournaments';
import { TournamentGrade as TournamentGradeEnum, TournamentStatus as TournamentStatusEnum } from '@/types/api/tournaments';
import MultiSelect from '../ui/multi-select';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  grade: z.nativeEnum(TournamentGradeEnum),
  venue: z.string().min(2, 'Venue is required.'),
  startDate: z.date({ required_error: 'A start date is required.' }),
  endDate: z.date({ required_error: 'An end date is required.' }),
  registrationStartDate: z.date({ required_error: 'A registration start date is required.' }),
  registrationEndDate: z.date({ required_error: 'A registration end date is required.' }),
  adminId: z.string().min(1, 'Please select an admin.'),
  bannerUrl: z.string().url().optional().or(z.literal('')).nullable(),
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
  tournament: Omit<Tournament, 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'adminName' | 'adminEmail' | 'adminId'> & { adminId?: number, adminIds?: number[] } | null;
  onSave: (data: any) => void;
  isLoading?: boolean;
};

export function TournamentForm({ mode, tournament, onSave, isLoading = false }: TournamentFormProps) {
  const isViewMode = mode === 'view';
  const [imagePreview, setImagePreview] = useState<string | null>(tournament?.bannerUrl || null);
  const { data: admins = [], isPending: adminsLoading } = useUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tournament?.name || '',
      grade: tournament?.grade || TournamentGradeEnum.LOCAL,
      venue: tournament?.venue || '',
      startDate: tournament?.startDate || new Date(),
      endDate: tournament?.endDate || new Date(),
      registrationStartDate: tournament?.registrationStartDate || new Date(),
      registrationEndDate: tournament?.registrationEndDate || new Date(),
      adminId: tournament?.adminId ? tournament.adminId.toString() : '',
      bannerUrl: tournament?.bannerUrl || '',
    },
  });

  useEffect(() => {
    if (tournament) {
      form.reset({
        name: tournament.name,
        grade: tournament.grade,
        venue: tournament.venue,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        registrationStartDate: tournament.registrationStartDate,
        registrationEndDate: tournament.registrationEndDate,
        adminId: tournament.adminId ? tournament.adminId.toString() : '',
        bannerUrl: tournament.bannerUrl,
      });
      setImagePreview(tournament.bannerUrl);
    }
  }, [tournament, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      ...values,
      adminId: parseInt(values.adminId, 10),
      status: TournamentStatusEnum.SCHEDULED,
      id: tournament?.id,
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
                <Input placeholder="Summer Championship 2024" {...field} disabled={isViewMode || isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => {
            const gradeOptions = [
              { value: TournamentGradeEnum.NATIONAL, label: TournamentGradeEnum.NATIONAL },
              { value: TournamentGradeEnum.LOCAL, label: TournamentGradeEnum.LOCAL },
              { value: TournamentGradeEnum.INTERNATIONAL, label: TournamentGradeEnum.INTERNATIONAL },
              { value: TournamentGradeEnum.REGIONAL, label: TournamentGradeEnum.REGIONAL },
              { value: TournamentGradeEnum.ELITE, label: TournamentGradeEnum.ELITE },
            ];
            return (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={gradeOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    mode="single"
                    placeholder="Select a grade"
                    disabled={isViewMode || isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Sugathadasa Stadium" {...field} disabled={isViewMode || isLoading} />
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
                  <PopoverTrigger asChild disabled={isViewMode || isLoading}>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewMode || isLoading}
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
                      disabled={(date) => isViewMode || isLoading || date < new Date("1900-01-01")}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear() + 10}
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
                  <PopoverTrigger asChild disabled={isViewMode || isLoading}>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewMode || isLoading}
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
                      disabled={(date) => isViewMode || isLoading || date < (form.getValues('registrationStartDate') || new Date("1900-01-01"))}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear() + 10}
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
                  <PopoverTrigger asChild disabled={isViewMode || isLoading}>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewMode || isLoading}
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
                      disabled={(date) => isViewMode || isLoading || date < (form.getValues('registrationEndDate') || new Date("1900-01-01"))}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear() + 10}
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
                  <PopoverTrigger asChild disabled={isViewMode || isLoading}>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewMode || isLoading}
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
                      disabled={(date) => isViewMode || isLoading || date < (form.getValues('startDate') || new Date("1900-01-01"))}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear() + 10}
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
          name="adminId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Administrator</FormLabel>
              <FormControl>
                <MultiSelect
                  options={adminOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  mode="single"
                  className="w-full"
                  placeholder={adminsLoading ? "Loading administrators..." : "Select administrator"}
                  disabled={isViewMode || isLoading}
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

        {!isViewMode && (
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Tournament'}
          </Button>
        )}
      </form>
    </Form>
  );
}
