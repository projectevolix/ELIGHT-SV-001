
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
import { MoreVertical, Edit, Trash2, PlusCircle, UserCircle, X } from 'lucide-react';
import { Association } from '@/app/associations/page';
import { Badge } from '@/components/ui/badge';

export type Coach = {
  id: number;
  firstName: string;
  lastName: string;
};

const initialCoaches: Coach[] = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith' },
  { id: 3, firstName: 'Mike', lastName: 'Johnson' },
];

type ManageCoachesSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  association: Association | null;
};

export function ManageCoachesSheet({ open, onOpenChange, association }: ManageCoachesSheetProps) {
  const [coaches, setCoaches] = useState<Coach[]>(initialCoaches);

  const handleCreateCoach = () => {
    // TODO: Implement coach creation logic
  };

  const handleEditCoach = (coach: Coach) => {
    // TODO: Implement coach editing logic
  };

  const handleDeleteCoach = (coachId: number) => {
    setCoaches(coaches.filter(c => c.id !== coachId));
  };


  return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-4xl p-0">
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
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.map((coach) => (
                    <TableRow key={coach.id}>
                      <TableCell className="font-medium">{coach.firstName}</TableCell>
                      <TableCell>{coach.lastName}</TableCell>
                      <TableCell>
                        <UserCircle className="h-6 w-6 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCoach(coach)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCoach(coach.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>
  );
}
