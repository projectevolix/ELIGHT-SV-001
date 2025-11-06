
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit, Trash2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Association = {
  id: number;
  name: string;
  province: string;
  email: string;
  phone: string;
  website: string;
  status: 'Active' | 'Inactive';
};

const initialAssociations: Association[] = [
  { id: 1, name: 'Ontario Basketball', province: 'Ontario', email: 'info@basketball.on.ca', phone: '416-555-1234', website: 'basketball.on.ca', status: 'Active' },
  { id: 2, name: 'BC Athletics', province: 'British Columbia', email: 'info@bcathletics.org', phone: '604-555-5678', website: 'bcathletics.org', status: 'Active' },
  { id: 3, name: 'Alberta Soccer Association', province: 'Alberta', email: 'mail@albertasoccer.com', phone: '780-555-9012', website: 'albertasoccer.com', status: 'Inactive' },
  { id: 4, name: 'Volleyball Québec', province: 'Québec', email: 'info@volleyball.qc.ca', phone: '514-555-3456', website: 'volleyball.qc.ca', status: 'Active' },
  { id: 5, name: 'Saskatchewan Hockey', province: 'Saskatchewan', email: 'info@sha.sk.ca', phone: '306-555-7890', website: 'sha.sk.ca', status: 'Active' },
];


export default function AssociationsPage() {
  const [associations, setAssociations] = useState<Association[]>(initialAssociations);
  
  const getStatusVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'outline';
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Associations
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Association
        </Button>
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
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associations.map((association) => (
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
                     <a href={`https://${association.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {association.website}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(association.status)}>{association.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
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
    </DashboardLayout>
  );
}
