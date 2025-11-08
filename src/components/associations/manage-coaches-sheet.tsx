
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
import { Association } from '@/app/associations/page';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CoachSheet } from './coach-sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export type Coach = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  photoUrl?: string;
  slkfId: string;
  wkfId: string;
};

const initialCoaches: Coach[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', dob: new Date('1985-05-15'), slkfId: 'SLKF-001', wkfId: 'WKF-101', photoUrl: 'https://picsum.photos/seed/coach1/40/40' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', dob: new Date('1990-08-22'), slkfId: 'SLKF-002', wkfId: 'WKF-102' },
  { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', dob: new Date('1978-11-30'), slkfId: 'SLKF-003', wkfId: 'WKF-103', photoUrl: 'https://picsum.photos/seed/coach3/40/40'  },
];

type ManageCoachesSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  association: Association | null;
};

export function ManageCoachesSheet({ open, onOpenChange, association }: ManageCoachesSheetProps) {
  const [coaches, setCoaches] = useState<Coach[]>(initialCoaches);
  const [coachSheetOpen, setCoachSheetOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<Coach | null>(null);


  const handleCreateCoach = () => {
    setSheetMode('create');
    setSelectedCoach(null);
    setCoachSheetOpen(true);
  };

  const handleViewCoach = (coach: Coach) => {
    setSheetMode('view');
    setSelectedCoach(coach);
    setCoachSheetOpen(true);
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
    if (coachToDelete) {
      setCoaches(coaches.filter(c => c.id !== coachToDelete.id));
    }
    setDeleteAlertOpen(false);
    setCoachToDelete(null);
  };

  const handleSaveCoach = (data: Omit<Coach, 'id'> & { id?: number }) => {
    if (sheetMode === 'create') {
      setCoaches([...coaches, { ...data, id: Date.now() } as Coach]);
    } else {
      setCoaches(coaches.map(c => c.id === data.id ? { ...data, id: data.id } as Coach : c));
    }
    setCoachSheetOpen(false);
  };


  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-6xl p-0">
            <SheetHeader className="p-6">
                <div className="flex items-center justify-between">
                <div>
                    <SheetTitle>Manage Coaches</SheetTitle>
                    <SheetDescription>
                    Manage coaches for {association?.name || 'the selected association'}.
                    </SheetDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleCreateCoach}>
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
                  {coaches.map((coach) => (
                    <TableRow key={coach.id} onClick={() => handleViewCoach(coach)} className="cursor-pointer">
                        <TableCell>
                            <Avatar className="h-8 w-8">
                                {coach.photoUrl ? <AvatarImage src={coach.photoUrl} alt={`${coach.firstName} ${coach.lastName}`} data-ai-hint="person face" /> : null}
                                <AvatarFallback>
                                    <UserCircle className="h-6 w-6 text-muted-foreground" />
                                </AvatarFallback>
                            </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{coach.firstName}</TableCell>
                      <TableCell>{coach.lastName}</TableCell>
                      <TableCell>{coach.email}</TableCell>
                      <TableCell>{format(coach.dob, 'MMM d, yyyy')}</TableCell>
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
                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleViewCoach(coach)}}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleEditCoach(coach)}}>
                                    <Edit className="h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleDeleteClick(coach)}} className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <CoachSheet 
        open={coachSheetOpen}
        onOpenChange={setCoachSheetOpen}
        mode={sheetMode}
        coach={selectedCoach}
        onSave={handleSaveCoach}
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
