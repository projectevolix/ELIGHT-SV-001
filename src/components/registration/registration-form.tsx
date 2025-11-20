
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
import { usePlayers } from '@/hooks/api/usePlayerQueries';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  tournamentId: z.string({ required_error: 'Please select a tournament.' }),
  playerId: z.string({ required_error: 'Please select a player.' }),
  eventId: z.string({ required_error: 'Please select an event.' }),
});

type RegistrationFormProps = {
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function RegistrationForm({ onSave, onCancel, isLoading = false }: RegistrationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentId: '',
      playerId: '',
      eventId: '',
    },
  });

  // Fetch current user for registeredBy
  const { data: currentUser, isPending: userLoading } = useCurrentUser();

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

  // Fetch all players with pagination
  const { data: playersData, isPending: playersLoading } = usePlayers(1, 100);
  const players = playersData || [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Add registeredBy from current user
    const registeredByName = currentUser?.name || 'Unknown';
    onSave({
      ...values,
      registeredBy: registeredByName,
    });
    form.reset();
  }

  const handleReset = () => {
    form.reset();
  };

  // Build player options from API data
  const playerOptions = players.map(player => ({
    id: player.id,
    label: `${player.firstName} ${player.lastName}`,
  }));

  // Build event display names from event properties
  const eventOptions = events.map(e => ({
    id: e.id,
    name: `${e.ageCategory} - ${e.gender} - ${e.discipline}${e.weightClass ? ` (${e.weightClass})` : ''}`
  }));

  if (userLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

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

        {/* Player Selector */}
        <FormField
          control={form.control}
          name="playerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={playersLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={playersLoading ? "Loading players..." : "Select a player"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {playersLoading ? (
                    <div className="p-2 text-sm text-muted-foreground">Loading players...</div>
                  ) : playerOptions.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No players available</div>
                  ) : (
                    playerOptions.map(player => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
                value={field.value || ''}
                disabled={Boolean(!selectedTournamentId) || eventsLoading || Boolean(selectedTournamentId && eventOptions.length === 0)}
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
            {isLoading ? 'Saving...' : 'Register Player'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
