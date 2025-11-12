

'use client';

import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight, UserCog, Users, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AssociationSheet } from '@/components/associations/association-sheet';
import { ManageCoachesSheet } from '@/components/associations/manage-coaches-sheet';
import { ManagePlayersSheet } from '@/components/associations/manage-players-sheet';
import { useAssociations, useSearchAssociations } from '@/hooks/api/useAssociations';
import { useCreateAssociation, useUpdateAssociation, useDeleteAssociation } from '@/hooks/api/useAssociationMutations';
import type { Association } from '@/types/api/associations';
import type { CreateAssociationRequest, UpdateAssociationRequest } from '@/types/api/associations';

const ITEMS_PER_PAGE = 5;

export default function AssociationsPage() {
  // Query hooks for fetching data
  const { data: associations = [], isPending: isLoadingAssociations, error: associationsError } = useAssociations();

  // Mutation hooks for modifying data
  const { mutate: createAssoc, isPending: isCreating } = useCreateAssociation();
  const { mutate: updateAssoc, isPending: isUpdating } = useUpdateAssociation();
  const { mutate: deleteAssoc, isPending: isDeleting } = useDeleteAssociation();

  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [sheetMode, setSheetMode] = useState<'edit' | 'create'>('create');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [associationToDelete, setAssociationToDelete] = useState<Association | null>(null);
  const [manageCoachesSheetOpen, setManageCoachesSheetOpen] = useState(false);
  const [managePlayersSheetOpen, setManagePlayersSheetOpen] = useState(false);

  // Filter associations based on search term
  const filteredAssociations = useMemo(() => {
    return associations.filter((a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.province.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, associations]);

  // Paginate filtered results
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
      deleteAssoc(associationToDelete.id);
      setDeleteAlertOpen(false);
      setAssociationToDelete(null);
    }
  };

  const handleSave = (data: Omit<Association, 'id' | 'createdAt' | 'updatedAt'> & { id?: string | number }) => {
    if (sheetMode === 'create') {
      // Create new association
      const createPayload: CreateAssociationRequest = {
        name: data.name,
        province: data.province,
        contactEmail: data.email,
        contactNumber: data.phone,
        presidentName: data.president,
      };
      createAssoc(createPayload);
    } else if (data.id) {
      // Update existing association
      const updatePayload: UpdateAssociationRequest = {
        name: data.name,
        province: data.province,
        contactEmail: data.email,
        contactNumber: data.phone,
        presidentName: data.president,
      };
      updateAssoc({ id: data.id, data: updatePayload });
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
              disabled={isLoadingAssociations}
            />
          </div>
          <Button onClick={handleCreate} disabled={isLoadingAssociations}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Association
          </Button>
        </div>
      </div>

      <Card className="mt-4 shadow">
        <CardContent className="p-0">
          {isLoadingAssociations ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading associations...</span>
            </div>
          ) : associationsError ? (
            <div className="p-8 text-center text-destructive">
              Failed to load associations. Please try again.
            </div>
          ) : (
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
                {paginatedAssociations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No associations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssociations.map((association) => (
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
                            <Button variant="ghost" size="icon" disabled={isDeleting || isUpdating}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(association)} disabled={isUpdating}>
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
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(association)}
                              className="text-destructive"
                              disabled={isDeleting}
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
          )}
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
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
