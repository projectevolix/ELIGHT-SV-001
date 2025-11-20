
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
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
import { MoreVertical, Edit, Trash2, PlusCircle, UserCircle, X, Eye } from 'lucide-react';
import type { Association } from '@/types/api/associations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CoachSheet } from './coach-sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { CoachDetails } from './coach-details';
import { useCoachesByAssociation } from '@/hooks/api/useCoaches';
import { useDeleteCoach } from '@/hooks/api/useCoachMutations';
import { CoachDTO } from '@/types/api/coaches';
import { Skeleton } from '@/components/ui/skeleton';


export type Coach = CoachDTO & {
  dob: string | Date;
};

type ManageCoachesSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  association: Association | null;
};

export function ManageCoachesSheet({ open, onOpenChange, association }: ManageCoachesSheetProps) {
  const [coachSheetOpen, setCoachSheetOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<Coach | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Fetch coaches for the association
  const {
    data: coaches = [],
    isLoading,
    error,
  } = useCoachesByAssociation(association?.id);

  // Delete mutation
  const deleteMutation = useDeleteCoach();

  const handleCreateCoach = () => {
    setSheetMode('create');
    setSelectedCoach(null);
    setCoachSheetOpen(true);
  };

  const handleViewCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setDetailsDialogOpen(true);
  };

  const handleEditCoach = (coach: Coach) => {
    setSheetMode('edit');
    setSelectedCoach(coach);
    setCoachSheetOpen(true);
  };

  const handleDeleteClick = (coach: Coach) => {
    setCoachToDelete(coach);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (coachToDelete && association?.id) {
      deleteMutation.mutate({ id: coachToDelete.id, associationId: association.id });
    }
    setDeleteAlertOpen(false);
    setCoachToDelete(null);
  };

  if (!association) return null;


  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent showCloseButton={false} className="sm:max-w-6xl p-0">
          <SheetHeader className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Manage Coaches</SheetTitle>
                <SheetDescription>
                  Manage coaches for {association?.name || 'the selected association'}.
                </SheetDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleCreateCoach} disabled={isLoading}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Coach
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetHeader>
          <div className="px-6 pb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                {isLoading ? 'Loading coaches...' : `${coaches.length} coach${coaches.length !== 1 ? 'es' : ''} in this association.`}
              </span>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>SLKF ID</TableHead>
                    <TableHead>WKF ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : coaches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No coaches yet. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    coaches.map((coach) => (
                      <TableRow key={coach.id} onClick={() => handleViewCoach(coach)} className="cursor-pointer">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            {coach.photo ? <AvatarImage src={coach.photo} alt={`${coach.firstName} ${coach.lastName}`} data-ai-hint="person face" /> : null}
                            <AvatarFallback>
                              <UserCircle className="h-6 w-6 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{coach.firstName}</TableCell>
                        <TableCell>{coach.lastName}</TableCell>
                        <TableCell>{coach.email}</TableCell>
                        <TableCell>{format(parseISO(coach.dob as string), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{coach.slkfId}</TableCell>
                        <TableCell>{coach.wkfId}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewCoach(coach) }}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditCoach(coach) }}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(coach) }} className="text-destructive">
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
          </div>
        </SheetContent>
      </Sheet>
      <CoachSheet
        open={coachSheetOpen}
        onOpenChange={setCoachSheetOpen}
        mode={sheetMode as 'edit' | 'create'}
        coach={selectedCoach}
        associationId={association?.id}
      />
      <CoachDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        coach={selectedCoach}
      />
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coach
              and remove their data from our servers.
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
