

'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight, UserCog, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AssociationSheet } from '@/components/associations/association-sheet';
import { ManageCoachesSheet } from '@/components/associations/manage-coaches-sheet';
import { ManagePlayersSheet } from '@/components/associations/manage-players-sheet';


export type Association = {
  id: number;
  name: string;
  province: string;
  email: string;
  phone: string;
  president: string;
};

const initialAssociations: Association[] = [
  { id: 1, name: 'Ontario Basketball', province: 'Ontario', email: 'info@basketball.on.ca', phone: '416-555-1234', president: 'John Doe' },
  { id: 2, name: 'BC Athletics', province: 'British Columbia', email: 'info@bcathletics.org', phone: '604-555-5678', president: 'Jane Smith' },
  { id: 3, name: 'Alberta Soccer Association', province: 'Alberta', email: 'mail@albertasoccer.com', phone: '780-555-9012', president: 'Mike Johnson' },
  { id: 4, name: 'Volleyball Québec', province: 'Québec', email: 'info@volleyball.qc.ca', phone: '514-555-3456', president: 'Emily Brown' },
  { id: 5, name: 'Saskatchewan Hockey', province: 'Saskatchewan', email: 'info@sha.sk.ca', phone: '306-555-7890', president: 'Chris Lee' },
  { id: 6, name: 'Manitoba Runners Association', province: 'Manitoba', email: 'contact@mra.mb.ca', phone: '204-555-1122', president: 'Patricia Williams' },
  { id: 7, name: 'Tennis Newfoundland', province: 'Newfoundland and Labrador', email: 'admin@tennisnl.ca', phone: '709-555-3344', president: 'Robert Davis' },
  { id: 8, name: 'Swim Nova Scotia', province: 'Nova Scotia', email: 'office@swimnovascotia.com', phone: '902-555-5566', president: 'Linda Martinez' },
];

const ITEMS_PER_PAGE = 5;

export default function AssociationsPage() {
  const [associations, setAssociations] = useState<Association[]>(initialAssociations);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [sheetMode, setSheetMode] = useState<'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [associationToDelete, setAssociationToDelete] = useState<Association | null>(null);
  const [manageCoachesSheetOpen, setManageCoachesSheetOpen] = useState(false);
  const [managePlayersSheetOpen, setManagePlayersSheetOpen] = useState(false);

  const filteredAssociations = useMemo(() => {
    return associations
      .filter((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.province.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, associations]);

  const paginatedAssociations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssociations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAssociations, currentPage]);

  const totalPages = Math.ceil(filteredAssociations.length / ITEMS_PER_PAGE);

  const handleCreate = () => {
    setSheetMode('create');
    setSelectedAssociation(null);
    setSheetOpen(true);
  };

  const handleEdit = (association: Association) => {
    setSheetMode('edit');
    setSelectedAssociation(association);
    setSheetOpen(true);
  };

  const handleDeleteClick = (association: Association) => {
    setAssociationToDelete(association);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (associationToDelete) {
      setAssociations(associations.filter(a => a.id !== associationToDelete.id));
    }
    setDeleteAlertOpen(false);
    setAssociationToDelete(null);
  };
  
  const handleSave = (data: Omit<Association, 'id'> & { id?: number }) => {
    if (sheetMode === 'create') {
      setAssociations([...associations, { ...data, id: Date.now() } as Association]);
    } else {
      setAssociations(associations.map(a => a.id === data.id ? { ...data, id: data.id } as Association : a));
    }
    setSheetOpen(false);
  };

  const handleManageCoaches = (association: Association) => {
    setSelectedAssociation(association);
    setManageCoachesSheetOpen(true);
  };

  const handleManagePlayers = (association: Association) => {
    setSelectedAssociation(association);
    setManagePlayersSheetOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Associations
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-48"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Association
          </Button>
        </div>
      </div>

      <Card className="mt-4 shadow">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>President</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAssociations.map((association) => (
                <TableRow key={association.id}>
                  <TableCell className="font-medium">{association.name}</TableCell>
                  <TableCell>{association.province}</TableCell>
                  <TableCell>
                    <a href={`mailto:${association.email}`} className="text-primary hover:underline">
                      {association.email}
                    </a>
                  </TableCell>
                  <TableCell>{association.phone}</TableCell>
                  <TableCell>
                     {association.president}
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(association)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleManageCoaches(association)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          <span>Manage Coaches</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManagePlayers(association)}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Manage Players</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(association)} className="text-destructive">
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
        </CardContent>
      </Card>
      
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
      <AssociationSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        association={selectedAssociation}
        onSave={handleSave}
      />
      <ManageCoachesSheet
        open={manageCoachesSheetOpen}
        onOpenChange={setManageCoachesSheetOpen}
        association={selectedAssociation}
      />
      <ManagePlayersSheet
        open={managePlayersSheetOpen}
        onOpenChange={setManagePlayersSheetOpen}
        association={selectedAssociation}
      />
       <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the association
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
