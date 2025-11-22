
'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Loader2 } from 'lucide-react';
import { RegistrationSheet } from '@/components/registration/registration-sheet';
import { useRegistrations, useRegistrationsByTournament } from '@/hooks/api/useRegistrationQueries';
import { useTournaments } from '@/hooks/api/useTournaments';
import { useUpdateRegistrationStatus } from '@/hooks/api/useRegistrationMutations';
import { useCreateRegistration } from '@/hooks/api/useRegistrationMutations';
import { RegistrationStatus } from '@/types/api/registrations';
import { Skeleton } from '@/components/ui/skeleton';

export default function RegistrationPage() {
    const [filteredTournament, setFilteredTournament] = useState<string>('all');
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rejectAlertOpen, setRejectAlertOpen] = useState(false);
    const [selectedRegistrationForReject, setSelectedRegistrationForReject] = useState<any>(null);

    // Fetch tournaments
    const { data: tournamentsData, isPending: tournamentsLoading } = useTournaments(1, 100);
    const tournaments = tournamentsData?.tournaments || [];

    // Fetch registrations
    const tournamentIdFilter = filteredTournament === 'all' ? null : parseInt(filteredTournament, 10);
    const { data: allRegistrations, isPending: allRegsLoading } = useRegistrations(1, 100);
    const { data: filteredRegs, isPending: filteredRegsLoading } = useRegistrationsByTournament(
        tournamentIdFilter,
        1,
        100
    );

    const registrations = filteredTournament === 'all' ? allRegistrations : filteredRegs;
    const isLoadingRegs = filteredTournament === 'all' ? allRegsLoading : filteredRegsLoading;

    // Mutations
    const updateStatusMutation = useUpdateRegistrationStatus();
    const createRegistrationMutation = useCreateRegistration();

    const approvedCount = useMemo(() => {
        return registrations?.filter(r => r.status === 'APPROVED').length || 0;
    }, [registrations]);

    const handleStatusChange = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        updateStatusMutation.mutate({ id, status: status as RegistrationStatus });
    };

    const handleRejectClick = (registration: any) => {
        setSelectedRegistrationForReject(registration);
        setRejectAlertOpen(true);
    };

    const handleRejectConfirm = () => {
        if (selectedRegistrationForReject) {
            handleStatusChange(selectedRegistrationForReject.id, 'REJECTED');
            setRejectAlertOpen(false);
            setSelectedRegistrationForReject(null);
        }
    };

    const handleSaveRegistration = async (data: any) => {
        setIsLoading(true);
        try {
            createRegistrationMutation.mutate({
                tournamentId: parseInt(data.tournamentId),
                playerId: parseInt(data.playerId),
                eventId: parseInt(data.eventId),
                status: RegistrationStatus.PENDING,
                registeredBy: data.registeredBy,
            });
            setSheetOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'secondary';
            case 'PENDING': return 'default';
            case 'REJECTED': return 'destructive';
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
                            <Select value={filteredTournament} onValueChange={setFilteredTournament} disabled={tournamentsLoading}>
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder={tournamentsLoading ? "Loading..." : "All Tournaments"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tournaments</SelectItem>
                                    {tournaments.map(t => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="ml-auto">
                            <Button>Publish draw</Button>
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
                                {isLoadingRegs ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                        </TableCell>
                                    </TableRow>
                                ) : !registrations || registrations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No registrations found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    registrations.map(reg => (
                                        <TableRow key={reg.id}>
                                            <TableCell className="font-medium">
                                                {reg.player.firstName} {reg.player.lastName}
                                            </TableCell>
                                            <TableCell>{reg.tournament.name}</TableCell>
                                            <TableCell>
                                                {reg.event.ageCategory} - {reg.event.gender} - {reg.event.discipline}
                                                {reg.event.weightClass && ` (${reg.event.weightClass})`}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(reg.status)}>{reg.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleStatusChange(reg.id, 'APPROVED')}
                                                        disabled={reg.status === 'APPROVED' || updateStatusMutation.isPending}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => handleRejectClick(reg)}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        Approved players in the current filter: {approvedCount}
                    </p>
                </CardContent>
            </Card>
            <RegistrationSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                onSave={handleSaveRegistration}
                isLoading={isLoading}
            />
            <AlertDialog open={rejectAlertOpen} onOpenChange={setRejectAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Registration?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject the registration for{' '}
                            <span className="font-semibold">
                                {selectedRegistrationForReject?.player.firstName}{' '}
                                {selectedRegistrationForReject?.player.lastName}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
