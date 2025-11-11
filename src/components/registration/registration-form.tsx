
'use client';

import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with actual data fetching
const tournaments = [
  { id: '1', name: 'Summer Championship 2024' },
  { id: '2', name: 'The International 2024' },
  { id: '3', name: 'Masters Tokyo' },
];

const allPlayers = [
  { id: '1', name: 'Kasun Perera' },
  { id: '2', name: 'John Doe' },
  { id: '3', name: 'Jane Smith' },
  { id: '4', name: 'Alice Williams' },
  { id: '5', name: 'Bob Brown' },
];

const events = [
    { id: '1', name: 'U19 - Male - Singles (58 - 68 kg)' },
    { id: '2', name: 'U19 - Female - Doubles (53 - 57 kg)' },
    { id: '3', name: 'Senior - Mixed - Mixed Doubles (90+ kg)' },
];

const formSchema = z.object({
  tournamentId: z.string({ required_error: 'Please select a tournament.' }),
  playerIds: z.array(z.string()).min(1, 'Please select at least one player.'),
  eventId: z.string({ required_error: 'Please select an event.' }),
});

type RegistrationFormProps = {
  onSave: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
};

export function RegistrationForm({ onSave, onCancel }: RegistrationFormProps) {
  const [openPlayersPopover, setOpenPlayersPopover] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerIds: [],
    },
  });

  const selectedPlayers = form.watch('playerIds').map(id => allPlayers.find(p => p.id === id)!);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    form.reset();
  }

  const handlePlayerSelect = (playerId: string) => {
    const currentIds = form.getValues('playerIds');
    const newIds = currentIds.includes(playerId)
      ? currentIds.filter(id => id !== playerId)
      : [...currentIds, playerId];
    form.setValue('playerIds', newIds, { shouldValidate: true });
  };
  
  const handlePlayerRemove = (playerId: string) => {
    const currentIds = form.getValues('playerIds');
    form.setValue('playerIds', currentIds.filter(id => id !== playerId), { shouldValidate: true });
  };
  
  const handleReset = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tournamentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tournament" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tournaments.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="playerIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Players</FormLabel>
              <Popover open={openPlayersPopover} onOpenChange={setOpenPlayersPopover}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPlayersPopover}
                      className="w-full justify-between font-normal"
                    >
                      {selectedPlayers.length > 0 ? `${selectedPlayers.length} selected` : 'Select players...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search players..." />
                    <CommandList>
                      <CommandEmpty>No players found.</CommandEmpty>
                      <CommandGroup>
                        {allPlayers.map((player) => (
                          <CommandItem
                            key={player.id}
                            onSelect={() => handlePlayerSelect(player.id)}
                            value={player.name}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value?.includes(player.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {player.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="pt-2 flex flex-wrap gap-2">
                {selectedPlayers.map(player => (
                  <Badge key={player.id} variant="secondary" className="pl-2 pr-1">
                    {player.name}
                    <button 
                      type="button" 
                      onClick={() => handlePlayerRemove(player.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      aria-label={`Remove ${player.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {events.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="button" variant="ghost" onClick={handleReset}>Reset</Button>
            <Button type="submit">Save Registration</Button>
        </div>
      </form>
    </Form>
  );
}
