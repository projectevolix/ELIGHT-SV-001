
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

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
                    <TableRow key={coach.id}>
                        <TableCell>
                            <Avatar className="h-8 w-8">
                                {coach.photoUrl ? <AvatarImage src={coach.photoUrl} alt={`${coach.firstName} ${coach.lastName}`} /> : null}
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
