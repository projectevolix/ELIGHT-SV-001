
'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  { id: 6, name: 'Manitoba Runners Association', province: 'Manitoba', email: 'contact@mra.mb.ca', phone: '204-555-1122', website: 'mra.mb.ca', status: 'Active' },
  { id: 7, name: 'Tennis Newfoundland', province: 'Newfoundland and Labrador', email: 'admin@tennisnl.ca', phone: '709-555-3344', website: 'tennisnl.ca', status: 'Inactive' },
  { id: 8, name: 'Swim Nova Scotia', province: 'Nova Scotia', email: 'office@swimnovascotia.com', phone: '902-555-5566', website: 'swimnovascotia.com', status: 'Active' },
];

const ITEMS_PER_PAGE = 5;

export default function AssociationsPage() {
  const [associations, setAssociations] = useState<Association[]>(initialAssociations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'outline';
  };

  const filteredAssociations = useMemo(() => {
    return associations
      .filter((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.province.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((a) => statusFilter === 'all' || a.status === statusFilter);
  }, [searchTerm, statusFilter, associations]);

  const paginatedAssociations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssociations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAssociations, currentPage]);

  const totalPages = Math.ceil(filteredAssociations.length / ITEMS_PER_PAGE);

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
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button>
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
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
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
    </DashboardLayout>
  );
}
