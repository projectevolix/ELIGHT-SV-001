'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Search, ChevronLeft, ChevronRight, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TournamentSheet } from '@/components/tournaments/tournament-sheet';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export type Tournament = {
  id: number;
  name: string;
  grade: 'National' | 'Provincial' | 'Club';
  venue: string;
  startDate: Date;
  endDate: Date;
  status: 'Ongoing' | 'Upcoming' | 'Finished';
  bannerUrl?: string;
};

const tournamentsData: Tournament[] = [
  {
    id: 1,
    name: 'Summer Championship 2024',
    grade: 'National',
    venue: 'North America',
    startDate: new Date('2024-07-20'),
    endDate: new Date('2024-08-10'),
    status: 'Ongoing',
    bannerUrl: 'https://picsum.photos/seed/1/600/400'
  },
  {
    id: 2,
    name: 'The International 2024',
    grade: 'Provincial',
    venue: 'Global',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-15'),
    status: 'Upcoming',
    bannerUrl: 'https://picsum.photos/seed/2/600/400'
  },
  {
    id: 3,
    name: 'Masters Tokyo',
    grade: 'Club',
    venue: 'APAC',
    startDate: new Date('2024-06-10'),
    endDate: new Date('2024-06-25'),
    status: 'Finished',
  },
  {
    id: 4,
    name: 'BLAST Premier: Fall Finals',
    grade: 'National',
    venue: 'Europe',
    startDate: new Date('2024-11-20'),
    endDate: new Date('2024-11-28'),
    status: 'Upcoming',
  },
    {
    id: 5,
    name: 'World Cyber Games',
    grade: 'Provincial',
    venue: 'Global',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-15'),
    status: 'Finished',
    bannerUrl: 'https://picsum.photos/seed/5/600/400'
  },
  {
    id: 6,
    name: 'Rocket League Championship',
    grade: 'National',
    venue: 'Global',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-07-30'),
    status: 'Ongoing',
  },
  {
    id: 7,
    name: 'Fortnite World Cup',
    grade: 'Club',
    venue: 'Global',
    startDate: new Date('2024-08-25'),
    endDate: new Date('2024-09-05'),
    status: 'Upcoming',
    bannerUrl: 'https://picsum.photos/seed/7/600/400'
  },
  {
    id: 8,
    name: 'Overwatch League 2024',
    grade: 'National',
    venue: 'Global',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-09-30'),
    status: 'Ongoing',
    bannerUrl: 'https://picsum.photos/seed/8/600/400'
  },
  {
    id: 9,
    name: 'Six Invitational',
    grade: 'Provincial',
    venue: 'Global',
    startDate: new Date('2024-02-13'),
    endDate: new Date('2024-02-25'),
    status: 'Finished',
  },
];

const ITEMS_PER_PAGE = 6;

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState(tournamentsData);
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);


  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'default';
      case 'Upcoming':
        return 'secondary';
      case 'Finished':
        return 'outline';
      default:
        return 'default';
    }
  };

  const filteredTournaments = useMemo(() => {
    let filtered = tournaments
      .filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.venue.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((t) => statusFilter === 'all' || t.status === statusFilter);

    if (view === 'grid') {
      filtered = filtered.filter(t => !!t.bannerUrl);
    }
    
    return filtered;
  }, [searchTerm, statusFilter, tournaments, view]);

  const paginatedTournaments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTournaments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTournaments, currentPage]);

  const totalPages = Math.ceil(filteredTournaments.length / ITEMS_PER_PAGE);
  
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

  const handleDeleteClick = (tournament: Tournament) => {
    setTournamentToDelete(tournament);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (tournamentToDelete) {
      setTournaments(tournaments.filter(t => t.id !== tournamentToDelete.id));
    }
    setDeleteAlertOpen(false);
    setTournamentToDelete(null);
  };

  const handleSave = (data: Tournament) => {
    if (sheetMode === 'create') {
      setTournaments([...tournaments, { ...data, id: Date.now() }]);
    } else {
      setTournaments(tournaments.map(t => t.id === data.id ? data : t));
    }
    setSheetOpen(false);
  };


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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Finished">Finished</SelectItem>
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
      {view === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedTournaments.map((tournament) => (
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
                <TableHead>Grade</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell className="font-medium font-headline">{tournament.name}</TableCell>
                  <TableCell>{tournament.grade}</TableCell>
                  <TableCell>{tournament.venue}</TableCell>
                  <TableCell>{format(tournament.startDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(tournament.endDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(tournament.status)}>{tournament.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(tournament)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(tournament)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(tournament)} className="text-destructive">
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
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
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
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
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
