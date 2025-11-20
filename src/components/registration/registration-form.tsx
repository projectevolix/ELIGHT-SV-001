
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTournaments } from '@/hooks/api/useTournaments';
import { useEventsByTournament } from '@/hooks/api/useEvents';
import { Skeleton } from '@/components/ui/skeleton';
import MultiSelect from '@/components/ui/multi-select';
import type { MultiSelectOption } from '@/components/ui/multi-select';

const formSchema = z.object({
  tournamentId: z.string({ required_error: 'Please select a tournament.' }),
  playerIds: z.array(z.string()).min(1, 'Please select at least one player.'),
  eventId: z.string({ required_error: 'Please select an event.' }),
});

type RegistrationFormProps = {
  onSave: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function RegistrationForm({ onSave, onCancel, isLoading = false }: RegistrationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentId: '',
      playerIds: [],
      eventId: '',
    },
  });

  // Fetch tournaments list
  const { data: tournamentsData, isPending: tournamentsLoading } = useTournaments(1, 100);
  const tournaments = tournamentsData?.tournaments || [];

  // Watch tournament selection to fetch events
  const selectedTournamentId = form.watch('tournamentId');
  const tournamentId = selectedTournamentId ? parseInt(selectedTournamentId, 10) : null;

  // Fetch events for selected tournament
  const { data: eventsData, isPending: eventsLoading } = useEventsByTournament(
    tournamentId,
    1,
    100
  );
  const events = eventsData || [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    form.reset();
  }

  const handleReset = () => {
    form.reset();
  };

  // Build player options - placeholder for when API comes
  const playerOptions: MultiSelectOption[] = [
    { value: '1', label: 'Kasun Perera' },
    { value: '2', label: 'John Doe' },
    { value: '3', label: 'Jane Smith' },
    { value: '4', label: 'Alice Williams' },
    { value: '5', label: 'Bob Brown' },
  ];

  // Build event display names from event properties
  const eventOptions = events.map(e => ({
    id: e.id,
    name: `${e.ageCategory} - ${e.gender} - ${e.discipline}${e.weightClass ? ` (${e.weightClass})` : ''}`
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tournament Selector */}
        <FormField
          control={form.control}
          name="tournamentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={tournamentsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={tournamentsLoading ? "Loading tournaments..." : "Select a tournament"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tournaments.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Players Multi-Select - Same as Tournament Administrators */}
        <FormField
          control={form.control}
          name="playerIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Players</FormLabel>
              <FormControl>
                <MultiSelect
                  options={playerOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  className="w-full"
                  placeholder="Select players..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event Selector - Conditional on tournament selection */}
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedTournamentId || eventsLoading || (selectedTournamentId && eventOptions.length === 0)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedTournamentId
                          ? "Select a tournament first"
                          : eventsLoading
                            ? "Loading events..."
                            : eventOptions.length === 0
                              ? "No events"
                              : "Select an event"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eventOptions.length > 0 ? (
                    eventOptions.map(e => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        {e.name}
                      </SelectItem>
                    ))
                  ) : (
                    selectedTournamentId && !eventsLoading && (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No events available
                      </div>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Registration'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
