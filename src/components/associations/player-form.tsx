
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UploadCloud } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Player } from './manage-players-sheet';
import type { Association } from '@/types/api/associations';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { KyuLevel, Gender } from '@/types/api/players';

const KYU_LEVELS = [
  KyuLevel.WHITE_BELT,
  KyuLevel.YELLOW_BELT,
  KyuLevel.ORANGE_BELT,
  KyuLevel.GREEN_BELT,
  KyuLevel.PURPLE_BELT,
  KyuLevel.BROWN_BELT,
  KyuLevel.BLACK_BELT,
];

const GENDERS = [Gender.MALE, Gender.FEMALE, Gender.OTHER];

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  gender: z.string().min(1, 'Gender is required.'),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  weight: z.coerce.number().positive('Weight must be a positive number.'),
  kyuLevel: z.string().min(1, 'Kyu level is required.'),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

type PlayerFormProps = {
  mode: 'view' | 'edit' | 'create';
  player: Player | null;
  onSave: (data: Omit<Player, 'id'> & { id?: number }) => void;
  onCancel: () => void;
  association?: Association | null;
};

export function PlayerForm({ mode, player, onSave, onCancel, association }: PlayerFormProps) {
  const isViewMode = mode === 'view';
  const [imagePreview, setImagePreview] = useState<string | null>(player?.photoUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: player?.firstName || '',
      lastName: player?.lastName || '',
      email: player?.email || '',
      gender: player?.gender || '',
      weight: player?.weight || 0,
      kyuLevel: player?.kyuLevel || '',
      photoUrl: player?.photoUrl || undefined,
      dob: player?.dob ? new Date(player.dob) : undefined,
    },
  });

  useEffect(() => {
    const defaultValues = {
      firstName: player?.firstName || '',
      lastName: player?.lastName || '',
      email: player?.email || '',
      gender: player?.gender || '',
      weight: player?.weight || 0,
      kyuLevel: player?.kyuLevel || '',
      photoUrl: player?.photoUrl || undefined,
      dob: player?.dob ? new Date(player.dob) : undefined,
    };
    form.reset(defaultValues as any);
    setImagePreview(defaultValues.photoUrl || null);
  }, [player, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      id: player?.id,
      associationId: player?.associationId || association?.id,
      createdAt: player?.createdAt,
      updatedAt: player?.updatedAt,
      createdBy: player?.createdBy,
      updatedBy: player?.updatedBy,
    };
    onSave(data as any);
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
                <Input type="email" placeholder="e.g. john@example.com" {...field} disabled={isViewMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => {
              const genderOptions = GENDERS.map(g => ({
                value: g,
                label: g,
              }));
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
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="kyuLevel"
            render={({ field }) => {
              const kyuOptions = KYU_LEVELS.map(level => ({
                value: level,
                label: level,
              }));
              return (
                <FormItem>
                  <FormLabel>Kyu Level</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={kyuOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      mode="single"
                      placeholder="Select kyu level"
                      disabled={isViewMode}
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
                    captionLayout="dropdown"
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
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 60" {...field} disabled={isViewMode} />
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
                    <Image src={imagePreview} alt="Player Photo" fill objectFit="cover" className="rounded-lg" />
                  </div>
                ) : <p className="text-sm text-muted-foreground">No photo.</p>
              ) : (
                <FormControl>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file-player"
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
                      <input id="dropzone-file-player" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
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
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
