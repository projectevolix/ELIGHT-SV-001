
'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { RegistrationSheet } from '@/components/registration/registration-sheet';

// Mock data
const tournaments = [
    { id: '1', name: 'Summer Championship 2024' },
    { id: '2', name: 'The International 2024' },
    { id: '3', name: 'Masters Tokyo' },
];

const events = [
    { id: '1', name: 'U19 - Male - Singles (58 - 68 kg)', tournamentId: '1' },
    { id: '2', name: 'U19 - Female - Doubles (53 - 57 kg)', tournamentId: '1' },
    { id: '3', name: 'Senior - Mixed - Mixed Doubles (90+ kg)', tournamentId: '2' },
];

type Registration = {
    id: number;
    playerName: string;
    tournamentId: string;
    eventId: string;
    status: 'Pending' | 'Approved' | 'Declined';
};

const initialRegistrations: Registration[] = [
    { id: 1, playerName: 'Nipun Silva', tournamentId: '1', eventId: '1', status: 'Pending' },
    { id: 2, playerName: 'John Doe', tournamentId: '1', eventId: '1', status: 'Approved' },
    { id: 3, playerName: 'Jane Smith', tournamentId: '1', eventId: '2', status: 'Pending' },
    { id: 4, playerName: 'Alice Williams', tournamentId: '2', eventId: '3', status: 'Approved' },
    { id: 5, playerName: 'Bob Brown', tournamentId: '2', eventId: '3', status: 'Declined' },
    { id: 6, playerName: 'Kasun Perera', tournamentId: '1', eventId: '1', status: 'Approved' },
];


export default function RegistrationPage() {
    const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
    const [filteredTournament, setFilteredTournament] = useState<string>('all');
    const [filteredEvent, setFilteredEvent] = useState<string>('all');
    const [sheetOpen, setSheetOpen] = useState(false);

    const availableEvents = useMemo(() => {
        if (filteredTournament === 'all') {
            return events;
        }
        return events.filter(e => e.tournamentId === filteredTournament);
    }, [filteredTournament]);

    const filteredRegistrations = useMemo(() => {
        return registrations.filter(r => {
            const tournamentMatch = filteredTournament === 'all' || r.tournamentId === filteredTournament;
            const eventMatch = filteredEvent === 'all' || r.eventId === filteredEvent;
            return tournamentMatch && eventMatch;
        });
    }, [registrations, filteredTournament, filteredEvent]);

    const approvedCount = useMemo(() => {
        return filteredRegistrations.filter(r => r.status === 'Approved').length;
    }, [filteredRegistrations]);

    const handleStatusChange = (id: number, status: 'Approved' | 'Declined') => {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const handleSaveRegistration = (data: any) => {
        console.log('New Registration:', data);
        const newRegistration: Registration = {
            id: Date.now(),
            playerName: `Player ${Date.now()}`,
            tournamentId: data.tournamentId,
            eventId: data.eventId,
            status: 'Pending',
        };
        // In a real app, you would get the player name from the data
        // For now, we add a placeholder.
        setRegistrations(prev => [newRegistration, ...prev]);
        setSheetOpen(false);
    };

    const getStatusVariant = (status: Registration['status']) => {
        switch (status) {
            case 'Approved': return 'secondary';
            case 'Pending': return 'default';
            case 'Declined': return 'destructive';
            default: return 'outline';
        }
    };


    return (
        <DashboardLayout>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Registration
                </h1>
                <Button onClick={() => setSheetOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register Player
                </Button>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="font-headline">Registered Players</CardTitle>
                    <CardDescription>View and manage player registrations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Tournament</label>
                            <Select value={filteredTournament} onValueChange={setFilteredTournament}>
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="All Tournaments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tournaments</SelectItem>
                                    {tournaments.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Event</label>
                            <Select value={filteredEvent} onValueChange={setFilteredEvent} disabled={availableEvents.length === 0}>
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="All Events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    {availableEvents.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="ml-auto">
                            <Button>public draw</Button>
                        </div>
                    </div>

                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Tournament</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRegistrations.map(reg => (
                                    <TableRow key={reg.id}>
                                        <TableCell className="font-medium">{reg.playerName}</TableCell>
                                        <TableCell>{tournaments.find(t => t.id === reg.tournamentId)?.name}</TableCell>
                                        <TableCell>{events.find(e => e.id === reg.eventId)?.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(reg.status)}>{reg.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(reg.id, 'Approved')}
                                                    disabled={reg.status === 'Approved'}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => handleStatusChange(reg.id, 'Declined')}
                                                >
                                                    Decline
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        Approved players in the current filter: {approvedCount}
                    </p>
                </CardContent>
            </Card>
            <RegistrationSheet open={sheetOpen} onOpenChange={setSheetOpen} onSave={handleSaveRegistration} />
        </DashboardLayout>
    );
}
