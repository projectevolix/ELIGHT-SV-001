
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
import { PlayerSheet } from './player-sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { PlayerDetailsDialog } from './player-details-dialog';


export type Player = {
  id: number;
  firstName: string;
  lastName: string;
  dob: Date;
  weight: number;
  kyuId: string;
  photoUrl?: string;
};

const initialPlayers: Player[] = [
  { id: 1, firstName: 'Alice', lastName: 'Williams', dob: new Date('2005-02-10'), weight: 55, kyuId: 'KYU-001', photoUrl: 'https://picsum.photos/seed/player1/40/40' },
  { id: 2, firstName: 'Bob', lastName: 'Brown', dob: new Date('2006-07-18'), weight: 62, kyuId: 'KYU-002' },
  { id: 3, firstName: 'Charlie', lastName: 'Davis', dob: new Date('2004-09-25'), weight: 70, kyuId: 'KYU-003', photoUrl: 'https://picsum.photos/seed/player3/40/40' },
];

type ManagePlayersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  association: Association | null;
};

export function ManagePlayersSheet({ open, onOpenChange, association }: ManagePlayersSheetProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [playerSheetOpen, setPlayerSheetOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [sheetMode, setSheetMode] = useState<'view' | 'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);


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
    if (playerToDelete) {
      setPlayers(players.filter(c => c.id !== playerToDelete.id));
    }
    setDeleteAlertOpen(false);
    setPlayerToDelete(null);
  };

  const handleSavePlayer = (data: Omit<Player, 'id'> & { id?: number }) => {
    if (sheetMode === 'create') {
      setPlayers([...players, { ...data, id: Date.now() } as Player]);
    } else {
      setPlayers(players.map(c => c.id === data.id ? { ...data, id: data.id } as Player : c));
    }
    setPlayerSheetOpen(false);
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
                    <TableHead>Kyu ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => (
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
                      <TableCell>{format(player.dob, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{player.weight}</TableCell>
                      <TableCell>{player.kyuId}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleViewPlayer(player)}}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleEditPlayer(player)}}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleDeleteClick(player)}} className="text-destructive">
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
      />
      <PlayerDetailsDialog
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
