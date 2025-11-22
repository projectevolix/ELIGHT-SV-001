'use client';

import { useState, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';
import MultiSelect from '@/components/ui/multi-select';
import { MoreVertical, Edit, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight, Eye, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EventSheet } from './event-sheet';
import { useEventsByTournament } from '@/hooks/api/useEvents';
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useUpdateEventStatus,
} from '@/hooks/api/useEventMutations';
import { EventDTO, EventStatus, EventType, Discipline } from '@/types/api/events';
import type { Tournament } from '@/types/api/tournaments';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  discipline: z.enum([Discipline.KATA, Discipline.KUMITE]),
  ageCategory: z.string(),
  gender: z.string(),
  weightClass: z.string().optional().or(z.literal('')),
  eventType: z.nativeEnum(EventType),
  teamSize: z.coerce.number().int().positive().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ITEMS_PER_PAGE = 10;

type ManageEventsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament: Tournament | null;
};

export function ManageEventsSheet({
  open,
  onOpenChange,
  tournament,
}: ManageEventsSheetProps) {
  const { toast } = useToast();
  const [eventSheetOpen, setEventSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | null>(null);
  const [eventSheetMode, setEventSheetMode] = useState<'view' | 'create' | 'edit'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch events for tournament
  const { data: allEvents = [], isLoading } = useEventsByTournament(tournament?.id || 0, 1, 1000);

  // Mutations
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const updateStatusMutation = useUpdateEventStatus();

  // Filter events based on search and status
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ageCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.weightClass.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginate filtered events
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'default';
      case 'DRAFT':
        return 'secondary';
      case 'COMPLETED':
        return 'outline';
      case 'LOCKED':
        return 'destructive';
      case 'REG_CLOSED':
        return 'default';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'default';
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setEventSheetMode('create');
    setEventSheetOpen(true);
  };

  const handleViewEvent = (event: EventDTO) => {
    setSelectedEvent(event);
    setEventSheetMode('view');
    setEventSheetOpen(true);
  };

  const handleEditEvent = (event: EventDTO) => {
    setSelectedEvent(event);
    setEventSheetMode('edit');
    setEventSheetOpen(true);
  };

  const handleDeleteEvent = (event: EventDTO) => {
    setEventToDelete(event);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete.id);
      setDeleteAlertOpen(false);
      setEventToDelete(null);
    }
  };

  const handleUpdateStatus = (event: EventDTO, newStatus: EventStatus) => {
    updateStatusMutation.mutate(
      { id: event.id, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: `Event status updated to ${newStatus}`,
          });
        },
      }
    );
  };

  const handleSaveEvent = (data: FormValues) => {
    if (!tournament) return;

    const payload = {
      discipline: data.discipline,
      ageCategory: data.ageCategory,
      gender: data.gender,
      eventType: data.eventType,
    } as any;

    // For KUMITE, always include weightClass
    if (data.discipline === Discipline.KUMITE && data.weightClass) {
      payload.weightClass = data.weightClass;
    }

    // For TEAM events, always include teamSize
    if (data.eventType === EventType.TEAM && data.teamSize) {
      payload.teamSize = data.teamSize;
    }

    if (eventSheetMode === 'create') {
      createMutation.mutate({
        tournamentId: tournament.id,
        payload,
      });
    } else if (selectedEvent && eventSheetMode === 'edit') {
      updateMutation.mutate({
        id: selectedEvent.id,
        tournamentId: tournament.id,
        payload,
      });
    }

    setEventSheetOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of table
    const tableElement = document.querySelector('[data-events-table]');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string | string[]) => {
    const status = Array.isArray(value) ? value[0] : value;
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...Object.values(EventStatus).map(status => ({
      value: status,
      label: status,
    })),
  ];

  if (!tournament) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-4xl p-6 overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Manage Events</SheetTitle>
                <SheetDescription>
                  Add, edit, or remove events for {tournament?.name || 'the tournament'}.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="pt-4 space-y-4">
            {/* Toolbar with search and filters */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <MultiSelect
                options={statusOptions}
                selected={statusFilter}
                onChange={handleStatusFilterChange}
                mode="single"
                placeholder="Filter by status"
                className="w-[150px]"
              />
              <Button onClick={handleCreateEvent} disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>

            {/* Events count */}
            <div className="text-sm text-muted-foreground">
              {isLoading
                ? 'Loading events...'
                : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}${searchTerm || statusFilter !== 'all' ? ' (filtered)' : ''
                }`}
            </div>

            {/* Events table */}
            <div className="border rounded-lg" data-events-table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discipline</TableHead>
                    <TableHead>Age Category</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Weight Class</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : paginatedEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {searchTerm || statusFilter !== 'all'
                          ? 'No events match your filters.'
                          : 'No events yet. Create one to get started.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEvents.map((event) => (
                      <TableRow
                        key={event.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setSelectedEvent(event);
                          setEventSheetMode('view');
                          setEventSheetOpen(true);
                        }}
                      >
                        <TableCell className="font-medium">{event.discipline}</TableCell>
                        <TableCell>{event.ageCategory}</TableCell>
                        <TableCell>{event.gender}</TableCell>
                        <TableCell>{event.weightClass}</TableCell>
                        <TableCell>{event.eventType}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(event.status)}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewEvent(event)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    <span>Change Status</span>
                                  </DropdownMenuItem>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="left">
                                  {Object.values(EventStatus)
                                    .filter((status) => status !== event.status)
                                    .map((status) => (
                                      <DropdownMenuItem
                                        key={status}
                                        onClick={() => handleUpdateStatus(event, status)}
                                      >
                                        {status}
                                      </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteEvent(event)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
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
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <EventSheet
        open={eventSheetOpen}
        onOpenChange={setEventSheetOpen}
        mode={eventSheetMode}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
