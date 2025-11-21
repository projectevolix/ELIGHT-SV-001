
'use client';

import { useState, useMemo } from 'react';
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
import { MoreVertical, Edit, Trash2, PlusCircle, UserCircle, X, Eye, Loader2 } from 'lucide-react';
import type { Association } from '@/types/api/associations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlayerSheet } from './player-sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PlayerDetails } from './player-details';
import { usePlayers, usePlayersByAssociation } from '@/hooks/api/usePlayerQueries';
import { useCreatePlayer, useUpdatePlayer, useDeletePlayer } from '@/hooks/api/usePlayerMutations';
import type { PlayerDTO } from '@/types/api/players';

export type Player = PlayerDTO & {
  id: string | number;
};

type ManagePlayersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  association: Association | null;
};

export function ManagePlayersSheet({ open, onOpenChange, association }: ManagePlayersSheetProps) {
  const [playerSheetOpen, setPlayerSheetOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // React Query hooks for API integration
  const { data: playersData, isLoading: playersLoading, error: playersError } = usePlayersByAssociation(association?.id ? Number(association.id) : null);
  const createPlayerMutation = useCreatePlayer();
  const updatePlayerMutation = useUpdatePlayer();
  const deletePlayerMutation = useDeletePlayer();

  const players = useMemo(() => playersData || [], [playersData]);


  const handleCreatePlayer = () => {
    setSheetMode('create');
    setSelectedPlayer(null);
    setPlayerSheetOpen(true);
  };

  const handleViewPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setDetailsDialogOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSheetMode('edit');
    setSelectedPlayer(player);
    setPlayerSheetOpen(true);
  };

  const handleDeleteClick = (player: Player) => {
    setPlayerToDelete(player);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (playerToDelete && typeof playerToDelete.id === 'number') {
      deletePlayerMutation.mutate(playerToDelete.id, {
        onSuccess: () => {
          setDeleteAlertOpen(false);
          setPlayerToDelete(null);
        },
      });
    }
  };

  const handleSavePlayer = (data: Omit<Player, 'id'> & { id?: number }) => {
    if (sheetMode === 'create') {
      if (association?.id && typeof association.id === 'number') {
        createPlayerMutation.mutate(
          {
            associationId: association.id,
            payload: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              gender: data.gender,
              dob: typeof data.dob === 'string' ? data.dob : (data.dob as Date).toISOString(),
              weight: data.weight,
              kyuLevel: data.kyuLevel,
              photoUrl: data.photoUrl || undefined,
              associationId: association.id,
            },
          },
          {
            onSuccess: () => {
              setPlayerSheetOpen(false);
            },
          }
        );
      }
    } else if (data.id && typeof data.id === 'number') {
      const assocId = (data as any).associationId && typeof (data as any).associationId === 'number'
        ? (data as any).associationId
        : 1; // Default fallback

      updatePlayerMutation.mutate(
        {
          id: data.id,
          associationId: assocId,
          payload: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            gender: data.gender,
            dob: typeof data.dob === 'string' ? data.dob : (data.dob as Date).toISOString(),
            weight: data.weight,
            kyuLevel: data.kyuLevel,
            photoUrl: data.photoUrl || undefined,
            associationId: assocId,
          },
        },
        {
          onSuccess: () => {
            setPlayerSheetOpen(false);
          },
        }
      );
    }
  };
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent showCloseButton={false} className="sm:max-w-6xl p-0">
          <SheetHeader className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Manage Players</SheetTitle>
                <SheetDescription>
                  Manage players for {association?.name || 'the selected association'}.
                </SheetDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleCreatePlayer}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Player
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
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Kyu Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playersLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading players...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : playersError || players.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {playersError ? 'Failed to load players' : 'No players found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    players.map((player) => (
                      <TableRow key={player.id} onClick={() => handleViewPlayer(player)} className="cursor-pointer">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            {player.photoUrl ? <AvatarImage src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} data-ai-hint="person face" /> : null}
                            <AvatarFallback>
                              <UserCircle className="h-6 w-6 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{player.firstName}</TableCell>
                        <TableCell>{player.lastName}</TableCell>
                        <TableCell>
                          {typeof player.dob === 'string'
                            ? format(new Date(player.dob), 'MMM d, yyyy')
                            : player.dob && typeof player.dob === 'object'
                              ? format(player.dob as Date, 'MMM d, yyyy')
                              : 'N/A'
                          }
                        </TableCell>
                        <TableCell>{player.weight}</TableCell>
                        <TableCell>{player.kyuLevel}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                                disabled={deletePlayerMutation.isPending || updatePlayerMutation.isPending}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewPlayer(player) }}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditPlayer(player) }}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(player) }} className="text-destructive">
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
      <PlayerSheet
        open={playerSheetOpen}
        onOpenChange={setPlayerSheetOpen}
        mode={sheetMode as 'edit' | 'create'}
        player={selectedPlayer}
        onSave={handleSavePlayer}
        association={association}
      />
      <PlayerDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        player={selectedPlayer}
      />
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the player
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
