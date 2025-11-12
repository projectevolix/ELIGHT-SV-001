
'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

// --- Mock Data ---

const tournaments = [
  { id: '1', name: 'Summer Championship 2024' },
  { id: '2', name: 'The International 2024' },
  { id: '3', name: 'Masters Tokyo' },
];

const disciplines = ['Singles', 'Doubles', 'Mixed Doubles'];
const ageCategories = ['U15', 'U19', 'Senior'];
const genders = ['Male', 'Female'];

type PlayerRanking = {
  id: number;
  rank: number;
  firstName: string;
  lastName: string;
  association: string;
  discipline: string;
  age: string;
  gender: 'Male' | 'Female';
  events: number;
  wins: number;
  points: number;
  tournamentId: string;
};

const initialRankings: PlayerRanking[] = [
  { id: 1, rank: 1, firstName: 'Nipun', lastName: 'Silva', association: 'Ontario Basketball', discipline: 'Singles', age: 'U19', gender: 'Male', events: 5, wins: 4, points: 1200, tournamentId: '1' },
  { id: 2, rank: 2, firstName: 'John', lastName: 'Doe', association: 'BC Athletics', discipline: 'Singles', age: 'U19', gender: 'Male', events: 5, wins: 3, points: 1100, tournamentId: '1' },
  { id: 3, rank: 3, firstName: 'Jane', lastName: 'Smith', association: 'Volleyball Québec', discipline: 'Doubles', age: 'Senior', gender: 'Female', events: 4, wins: 4, points: 1050, tournamentId: '2' },
  { id: 4, rank: 4, firstName: 'Alice', lastName: 'Williams', association: 'Alberta Soccer', discipline: 'Singles', age: 'U15', gender: 'Female', events: 6, wins: 5, points: 1000, tournamentId: '1' },
  { id: 5, rank: 5, firstName: 'Bob', lastName: 'Brown', association: 'Saskatchewan Hockey', discipline: 'Mixed Doubles', age: 'Senior', gender: 'Male', events: 3, wins: 2, points: 950, tournamentId: '3' },
  { id: 6, rank: 6, firstName: 'Kasun', lastName: 'Perera', association: 'Ontario Basketball', discipline: 'Singles', age: 'U19', gender: 'Male', events: 5, wins: 2, points: 900, tournamentId: '1' },
  { id: 7, rank: 7, firstName: 'Emily', lastName: 'Jones', association: 'BC Athletics', discipline: 'Doubles', age: 'Senior', gender: 'Female', events: 4, wins: 3, points: 850, tournamentId: '2' },
  { id: 8, rank: 8, firstName: 'Michael', lastName: 'Clark', association: 'Volleyball Québec', discipline: 'Mixed Doubles', age: 'Senior', gender: 'Male', events: 3, wins: 1, points: 750, tournamentId: '3' },
];

// --- Component ---

export default function PlayerRankingsPage() {
  const [filters, setFilters] = useState({
    tournamentId: 'all',
    discipline: 'all',
    age: 'all',
    gender: 'all',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof PlayerRanking; direction: 'ascending' | 'descending' }>({ key: 'points', direction: 'descending' });

  const handleFilterChange = (filterName: keyof typeof filters) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredAndSortedRankings = useMemo(() => {
    let filtered = initialRankings.filter(player => {
      return (
        (filters.tournamentId === 'all' || player.tournamentId === filters.tournamentId) &&
        (filters.discipline === 'all' || player.discipline === filters.discipline) &&
        (filters.age === 'all' || player.age === filters.age) &&
        (filters.gender === 'all' || player.gender === filters.gender)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    // Re-assign ranks after sorting
    return filtered.map((player, index) => ({ ...player, rank: index + 1 }));

  }, [filters, sortConfig]);

  const requestSort = (key: keyof PlayerRanking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof PlayerRanking) => {
    if (sortConfig.key !== key) {
        return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ? 
        <ArrowUpDown className="ml-2 h-4 w-4" /> : 
        <ArrowUpDown className="ml-2 h-4 w-4" />;
  }


  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Player Rankings
        </h1>
      </div>

      <Card className="mt-6">
        <CardHeader>
            <CardTitle className="font-headline">Filter Rankings</CardTitle>
            <CardDescription>Select filters to refine the player rankings below.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Tournament</label>
                    <Select value={filters.tournamentId} onValueChange={handleFilterChange('tournamentId')}>
                        <SelectTrigger><SelectValue placeholder="All Tournaments" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tournaments</SelectItem>
                            {tournaments.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium">Discipline</label>
                    <Select value={filters.discipline} onValueChange={handleFilterChange('discipline')}>
                        <SelectTrigger><SelectValue placeholder="All Disciplines" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Disciplines</SelectItem>
                            {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium">Age</label>
                    <Select value={filters.age} onValueChange={handleFilterChange('age')}>
                        <SelectTrigger><SelectValue placeholder="All Ages" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Ages</SelectItem>
                            {ageCategories.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-1">
                    <label className="text-sm font-medium">Gender</label>
                    <Select value={filters.gender} onValueChange={handleFilterChange('gender')}>
                        <SelectTrigger><SelectValue placeholder="All Genders" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Genders</SelectItem>
                            {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="mt-6 border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Association</TableHead>
              <TableHead>Discipline</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('points')} className="px-0 h-auto hover:bg-transparent">
                  Points
                  {getSortIcon('points')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRankings.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-bold">{player.rank}</TableCell>
                <TableCell>{player.firstName}</TableCell>
                <TableCell>{player.lastName}</TableCell>
                <TableCell>{player.association}</TableCell>
                <TableCell>{player.discipline}</TableCell>
                <TableCell>{player.age}</TableCell>
                <TableCell>{player.gender}</TableCell>
                <TableCell>{player.events}</TableCell>
                <TableCell>{player.wins}</TableCell>
                <TableCell className="font-semibold">{player.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
