'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Search, ChevronLeft, ChevronRight, MoreVertical, Edit, Trash2, Eye, Settings, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { TournamentSheet } from '@/components/tournaments/tournament-sheet';
import { ManageEventsSheet } from '@/components/tournaments/manage-events-sheet';
import { ManageTatamisSheet } from '@/components/tournaments/manage-tatamis-sheet';
import { RegistrationSheet } from '@/components/registration/registration-sheet';
import { TournamentCardGridSkeleton, TournamentRowListSkeleton } from '@/components/tournaments/tournament-skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTournaments, useTournamentsByStatus } from '@/hooks/api/useTournaments';
import { useCreateTournament, useUpdateTournament, useDeleteTournament, useResendAdminInvite } from '@/hooks/api/useTournamentMutations';
import { useToast } from '@/hooks/use-toast';
import type { Tournament } from '@/types/api/tournaments';
import { TournamentStatus } from '@/types/api/tournaments';

// Disable static prerendering for this page since it uses useSearchParams
export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 10;

function TournamentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // URL-based pagination state
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentStatus = (searchParams.get('status') || 'all') as string;
  const searchTerm = searchParams.get('search') || '';

  const [view, setView] = useState<'grid' | 'list'>('list');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [manageEventsSheetOpen, setManageEventsSheetOpen] = useState(false);
  const [manageTatamisSheetOpen, setManageTatamisSheetOpen] = useState(false);
  const [registrationSheetOpen, setRegistrationSheetOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);

  // Fetch tournaments based on status filter
  const {
    data: tournamentsData,
    isPending: isLoading,
    error: fetchError,
  } = currentStatus && currentStatus !== 'all'
      ? useTournamentsByStatus(
        currentStatus.toUpperCase() as TournamentStatus,
        currentPage,
        ITEMS_PER_PAGE
      )
      : useTournaments(currentPage, ITEMS_PER_PAGE);

  const tournaments = tournamentsData?.tournaments || [];
  const pagination = tournamentsData?.pagination;

  const deleteMutation = useDeleteTournament();
  const resendInviteMutation = useResendAdminInvite();
  const createMutation = useCreateTournament();
  const updateMutation = useUpdateTournament();

  // Update URL when filters change
  const updateURL = useCallback(
    (page: number = 1, status: string = 'all', search: string = '') => {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      if (status !== 'all') params.set('status', status);
      if (search) params.set('search', search);

      const newURL = params.toString() ? `/tournaments?${params.toString()}` : '/tournaments';
      router.push(newURL);
    },
    [router]
  );

  // Show error toast if fetch fails
  useEffect(() => {
    if (fetchError) {
      toast({
        title: 'Failed to load tournaments',
        description: (fetchError as any)?.message || 'Please try again',
        variant: 'destructive',
      });
    }
  }, [fetchError, toast]);

  const handleStatusChange = (value: string) => {
    updateURL(1, value, searchTerm);
  };

  const handleSearchChange = (value: string) => {
    updateURL(1, currentStatus, value);
  };

  const handlePageChange = (newPage: number) => {
    updateURL(newPage, currentStatus, searchTerm);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreate = () => {
    setSheetMode('create');
    setSelectedTournament(null);
    setSheetOpen(true);
  };

  const handleView = (tournament: Tournament) => {
    setSheetMode('view');
    setSelectedTournament(tournament);
    setSheetOpen(true);
  };

  const handleEdit = (tournament: Tournament) => {
    setSheetMode('edit');
    setSelectedTournament(tournament);
    setSheetOpen(true);
  };

  const handleManageEvents = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setManageEventsSheetOpen(true);
  };

  const handleManageTatamis = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setManageTatamisSheetOpen(true);
  };

  const handleRegisterPlayers = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setRegistrationSheetOpen(true);
  };

  const handleDeleteClick = (tournament: Tournament) => {
    setTournamentToDelete(tournament);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (tournamentToDelete) {
      deleteMutation.mutate(tournamentToDelete.id);
      setDeleteAlertOpen(false);
      setTournamentToDelete(null);
    }
  };

  const handleResendInvite = (tournament: Tournament) => {
    resendInviteMutation.mutate(tournament.id);
  };

  const handleSave = (data: any) => {
    // Transform dates to ISO strings for API
    const payload = {
      name: data.name,
      grade: data.grade,
      venue: data.venue,
      startDate: data.startDate instanceof Date ? data.startDate.toISOString().split('T')[0] : data.startDate,
      endDate: data.endDate instanceof Date ? data.endDate.toISOString().split('T')[0] : data.endDate,
      regStartDate: data.registrationStartDate instanceof Date ? data.registrationStartDate.toISOString().split('T')[0] : data.registrationStartDate,
      regEndDate: data.registrationEndDate instanceof Date ? data.registrationEndDate.toISOString().split('T')[0] : data.registrationEndDate,
      status: data.status,
      bannerUrl: data.bannerUrl || null,
      adminId: data.adminId,
    };

    if (sheetMode === 'create') {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setSheetOpen(false);
          toast({
            title: "Success",
            description: "Tournament created successfully",
          });
        },
      });
    } else if (sheetMode === 'edit' && data.id) {
      updateMutation.mutate(
        { id: data.id, data: payload },
        {
          onSuccess: () => {
            setSheetOpen(false);
            toast({
              title: "Success",
              description: "Tournament updated successfully",
            });
          },
        }
      );
    }
  };

  const handleRegistrationSave = (data: any) => {
    // Handle registration save - the registration form will handle the API call
    setRegistrationSheetOpen(false);
    toast({
      title: "Success",
      description: "Player registered successfully",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case TournamentStatus.ONGOING:
        return 'default';
      case TournamentStatus.SCHEDULED:
        return 'secondary';
      case TournamentStatus.FINISHED:
        return 'outline';
      default:
        return 'default';
    }
  };

  // Filter tournaments by search term (client-side for now, ready for backend search filter)
  const filteredTournaments = tournaments.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.adminName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = pagination?.totalPages || 1;


  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Tournaments
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tournaments..."
              className="pl-10 w-48"
              defaultValue={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={TournamentStatus.SCHEDULED}>Scheduled</SelectItem>
              <SelectItem value={TournamentStatus.ONGOING}>Ongoing</SelectItem>
              <SelectItem value={TournamentStatus.FINISHED}>Finished</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 rounded-md bg-muted p-1">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleCreate}>Create Tournament</Button>
        </div>
      </div>
      {isLoading ? (
        view === 'grid' ? (
          <TournamentCardGridSkeleton count={ITEMS_PER_PAGE} />
        ) : (
          <TournamentRowListSkeleton count={ITEMS_PER_PAGE} />
        )
      ) : filteredTournaments.length === 0 ? (
        <Card className="shadow">
          <CardContent className="pt-8 text-center text-muted-foreground">
            <p>No tournaments found</p>
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              {tournament.bannerUrl && (
                <div className="relative h-40 w-full">
                  <Image src={tournament.bannerUrl} alt={tournament.name} fill className="object-cover rounded-t-lg" data-ai-hint="tournament banner" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline">{tournament.name}</CardTitle>
                <CardDescription>{tournament.grade} - {tournament.venue}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="font-semibold">{format(tournament.startDate, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="font-semibold">{format(tournament.endDate, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={getStatusVariant(tournament.status)}>{tournament.status}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="w-full" onClick={() => handleView(tournament)}>
                  View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(tournament)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManageEvents(tournament)}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Manage Events</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManageTatamis(tournament)}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Manage Tatamis</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteClick(tournament)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Register</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTournaments.map((tournament) => (
                <TableRow key={tournament.id} onClick={() => handleView(tournament)} className="cursor-pointer">
                  <TableCell className="font-medium font-headline">{tournament.name}</TableCell>
                  <TableCell>{tournament.venue}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tournament.adminName}</TableCell>
                  <TableCell>{format(tournament.startDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(tournament.endDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(tournament.status)}>{tournament.status}</Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleRegisterPlayers(tournament)}
                    >
                      Register
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleView(tournament) }}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(tournament) }}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleManageEvents(tournament) }}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Manage Events</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleManageTatamis(tournament) }}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Manage Tatamis</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(tournament) }} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination?.hasPreviousPage || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination?.hasNextPage || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      <TournamentSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        tournament={selectedTournament}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <ManageEventsSheet
        open={manageEventsSheetOpen}
        onOpenChange={setManageEventsSheetOpen}
        tournament={selectedTournament}
      />
      <ManageTatamisSheet
        open={manageTatamisSheetOpen}
        onOpenChange={setManageTatamisSheetOpen}
        tournament={selectedTournament}
      />
      <RegistrationSheet
        open={registrationSheetOpen}
        onOpenChange={setRegistrationSheetOpen}
        onSave={handleRegistrationSave}
        preSelectedTournament={selectedTournament}
      />
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tournament
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

export default function TournamentsPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>}>
      <TournamentsContent />
    </Suspense>
  );
}
