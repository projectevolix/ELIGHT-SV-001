
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


// Mock data - replace with actual data fetching
const tournaments = [
  { id: 1, name: 'Summer Championship 2024' },
  { id: 2, name: 'The International 2024' },
  { id: 3, name: 'Masters Tokyo' },
];

const allPlayers = [
  { id: 1, name: 'Kasun Perera' },
  { id: 2, name: 'John Doe' },
  { id: 3, name: 'Jane Smith' },
  { id: 4, name: 'Alice Williams' },
  { id: 5, name: 'Bob Brown' },
];

const events = [
    { id: 1, name: 'U19 - Male - Singles (58 - 68 kg)' },
    { id: 2, name: 'U19 - Female - Doubles (53 - 57 kg)' },
    { id: 3, name: 'Senior - Mixed - Mixed Doubles (90+ kg)' },
];

export default function RegistrationPage() {
  const [selectedTournament, setSelectedTournament] = useState<string | undefined>(undefined);
  const [selectedPlayers, setSelectedPlayers] = useState<{ id: number, name: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  const [openPlayersPopover, setOpenPlayersPopover] = useState(false);

  const handlePlayerSelect = (player: { id: number, name: string }) => {
    setSelectedPlayers(prev => 
      prev.find(p => p.id === player.id) 
        ? prev.filter(p => p.id !== player.id)
        : [...prev, player]
    );
  };
  
  const handlePlayerRemove = (playerId: number) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handleReset = () => {
    setSelectedTournament(undefined);
    setSelectedPlayers([]);
    setSelectedEvent(undefined);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Registration
        </h1>
      </div>

      <div className="flex justify-center pt-8">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Registration Form</CardTitle>
            <CardDescription>Fill out the form to register players for a tournament event.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tournament</label>
                 <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Players</label>
                <Popover open={openPlayersPopover} onOpenChange={setOpenPlayersPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPlayersPopover}
                      className="w-full justify-between font-normal"
                    >
                      {selectedPlayers.length > 0 ? `${selectedPlayers.length} selected` : 'Select players...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
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
                              onSelect={() => handlePlayerSelect(player)}
                              value={player.name}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPlayers.find(p => p.id === player.id) ? "opacity-100" : "opacity-0"
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Event</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(e => (
                      <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                 <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                 <Button type="submit" onClick={(e) => e.preventDefault()}>Save Registration</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
