'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { MoreVertical, PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TatamiSheet } from './tatami-sheet';
import {
    useTatamisByTournament,
    useDeleteTatami,
    useUpdateTatamiAvailability,
} from '@/hooks/api/useTatamis';
import type { TatamiDTO } from '@/types/api/tatamis';
import { TatamiAvailabilityStatus as TAS } from '@/types/api/tatamis';
import type { Tournament } from '@/types/api/tournaments';

type ManageTatamisSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tournament: Tournament | null;
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'AVAILABLE':
            return 'default';
        case 'IN_USE':
            return 'secondary';
        case 'MAINTENANCE':
            return 'outline';
        case 'BLOCKED':
            return 'destructive';
        default:
            return 'default';
    }
};

export function ManageTatamisSheet({
    open,
    onOpenChange,
    tournament,
}: ManageTatamisSheetProps) {
    const [tatamiSheetOpen, setTatamiSheetOpen] = useState(false);
    const [selectedTatami, setSelectedTatami] = useState<TatamiDTO | null>(null);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [tatamiToDelete, setTatamiToDelete] = useState<TatamiDTO | null>(null);

    const { data: tatamis = [], isLoading } = useTatamisByTournament(tournament?.id || null);
    const deleteMutation = useDeleteTatami();
    const updateAvailabilityMutation = useUpdateTatamiAvailability();

    const handleCreateNew = () => {
        setSelectedTatami(null);
        setTatamiSheetOpen(true);
    };

    const handleEdit = (tatami: TatamiDTO) => {
        setSelectedTatami(tatami);
        setTatamiSheetOpen(true);
    };

    const handleDeleteClick = (tatami: TatamiDTO) => {
        setTatamiToDelete(tatami);
        setDeleteAlertOpen(true);
    };

    const handleConfirmDelete = () => {
        if (tatamiToDelete) {
            deleteMutation.mutate(tatamiToDelete.id, {
                onSuccess: () => {
                    setDeleteAlertOpen(false);
                    setTatamiToDelete(null);
                },
            });
        }
    };

    const handleStatusChange = (tatami: TatamiDTO, newStatus: TAS) => {
        updateAvailabilityMutation.mutate({
            id: tatami.id,
            status: newStatus,
        });
    };

    if (!tournament) return null;

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-3xl">
                    <SheetHeader>
                        <SheetTitle>Manage Tatamis</SheetTitle>
                        <SheetDescription>
                            Manage tatamis for {tournament.name}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-4">
                        <Button onClick={handleCreateNew} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Tatami
                        </Button>

                        {/* Tatamis Table */}
                        <div className="border rounded-lg overflow-hidden" data-tatamis-table>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center w-24">Number</TableHead>
                                        <TableHead className="text-center w-24">Capacity</TableHead>
                                        <TableHead className="text-center flex-1">Status</TableHead>
                                        <TableHead className="text-center w-16">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={4}>
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : tatamis.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                No tatamis yet. Create one to get started.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        tatamis.map((tatami) => (
                                            <TableRow key={tatami.id}>
                                                <TableCell className="text-center font-medium">{tatami.number}</TableCell>
                                                <TableCell className="text-center">{tatami.capacity}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={getStatusVariant(tatami.availabilityStatus)} className="justify-center">
                                                        {tatami.availabilityStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEdit(tatami)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleStatusChange(tatami, TAS.AVAILABLE)}>
                                                                Mark Available
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(tatami, TAS.IN_USE)}>
                                                                Mark In Use
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(tatami, TAS.MAINTENANCE)}>
                                                                Mark Maintenance
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleStatusChange(tatami, TAS.BLOCKED)}>
                                                                Mark Blocked
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteClick(tatami)}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
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

            {/* Tatami Form Sheet */}
            <TatamiSheet
                open={tatamiSheetOpen}
                onOpenChange={setTatamiSheetOpen}
                tatami={selectedTatami}
                tournamentId={tournament.id}
            />

            {/* Delete Alert */}
            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tatami</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete Tatami {tatamiToDelete?.number}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
