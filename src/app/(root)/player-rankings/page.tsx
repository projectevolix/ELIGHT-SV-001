
'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFiltersStore } from '@/stores/filters.store';

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
  { id: 9, rank: 9, firstName: 'Sarah', lastName: 'Davis', association: 'Alberta Soccer', discipline: 'Singles', age: 'U15', gender: 'Female', events: 6, wins: 4, points: 720, tournamentId: '1' },
  { id: 10, rank: 10, firstName: 'David', lastName: 'Miller', association: 'Saskatchewan Hockey', discipline: 'Singles', age: 'U19', gender: 'Male', events: 4, wins: 2, points: 700, tournamentId: '1' },
  { id: 11, rank: 11, firstName: 'Laura', lastName: 'Wilson', association: 'Ontario Basketball', discipline: 'Doubles', age: 'Senior', gender: 'Female', events: 5, wins: 3, points: 680, tournamentId: '2' },
  { id: 12, rank: 12, firstName: 'James', lastName: 'Taylor', association: 'BC Athletics', discipline: 'Mixed Doubles', age: 'Senior', gender: 'Male', events: 3, wins: 1, points: 650, tournamentId: '3' },
  { id: 13, rank: 13, firstName: 'Olivia', lastName: 'Martinez', association: 'Volleyball Québec', discipline: 'Singles', age: 'U15', gender: 'Female', events: 6, wins: 3, points: 630, tournamentId: '1' },
  { id: 14, rank: 14, firstName: 'Daniel', lastName: 'Anderson', association: 'Alberta Soccer', discipline: 'Doubles', age: 'U19', gender: 'Male', events: 5, wins: 2, points: 610, tournamentId: '1' },
  { id: 15, rank: 15, firstName: 'Sophia', lastName: 'Thomas', association: 'Saskatchewan Hockey', discipline: 'Singles', age: 'Senior', gender: 'Female', events: 4, wins: 2, points: 590, tournamentId: '2' },
  { id: 16, rank: 16, firstName: 'Matthew', lastName: 'Jackson', association: 'Ontario Basketball', discipline: 'Mixed Doubles', age: 'Senior', gender: 'Male', events: 3, wins: 0, points: 570, tournamentId: '3' },
  { id: 17, rank: 17, firstName: 'Isabella', lastName: 'White', association: 'BC Athletics', discipline: 'Singles', age: 'U15', gender: 'Female', events: 6, wins: 2, points: 550, tournamentId: '1' },
  { id: 18, rank: 18, firstName: 'Joseph', lastName: 'Harris', association: 'Volleyball Québec', discipline: 'Singles', age: 'U19', gender: 'Male', events: 5, wins: 1, points: 530, tournamentId: '1' },
  { id: 19, rank: 19, firstName: 'Mia', lastName: 'Martin', association: 'Alberta Soccer', discipline: 'Doubles', age: 'Senior', gender: 'Female', events: 4, wins: 1, points: 510, tournamentId: '2' },
  { id: 20, rank: 20, firstName: 'Andrew', lastName: 'Thompson', association: 'Saskatchewan Hockey', discipline: 'Mixed Doubles', age: 'Senior', gender: 'Male', events: 3, wins: 0, points: 490, tournamentId: '3' },
];

const ITEMS_PER_PAGE = 15;

export default function PlayerRankingsPage() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof PlayerRanking; direction: 'ascending' | 'descending' }>({ key: 'points', direction: 'descending' });

  // Zustand store for filter and pagination state
  const {
    rankingsSearch,
    rankingsPage,
    rankingsDiscipline,
    rankingsGender,
    rankingsAgeCategory,
    setRankingsSearch,
    setRankingsPage,
    setRankingsDiscipline,
    setRankingsGender,
    setRankingsAgeCategory,
  } = useFiltersStore();

  const handleFilterChange = (filterName: string) => (value: string) => {
    switch (filterName) {
      case 'discipline':
        setRankingsDiscipline(value);
        break;
      case 'age':
        setRankingsAgeCategory(value);
        break;
      case 'gender':
        setRankingsGender(value);
        break;
      default:
        break;
    }
  };

  const filteredAndSortedRankings = useMemo(() => {
    let filtered = initialRankings.filter(player => {
      const searchLower = rankingsSearch.toLowerCase();
      const nameMatch = player.firstName.toLowerCase().includes(searchLower) || player.lastName.toLowerCase().includes(searchLower) || player.association.toLowerCase().includes(searchLower);

      return (
        nameMatch &&
        (rankingsDiscipline === 'all' || player.discipline === rankingsDiscipline) &&
        (rankingsAgeCategory === 'all' || player.age === rankingsAgeCategory) &&
        (rankingsGender === 'all' || player.gender === rankingsGender)
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

    return filtered.map((player, index) => ({ ...player, rank: index + 1 }));

  }, [rankingsDiscipline, rankingsGender, rankingsAgeCategory, rankingsSearch, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedRankings.length / ITEMS_PER_PAGE);

  const paginatedRankings = useMemo(() => {
    const startIndex = (rankingsPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRankings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedRankings, rankingsPage]);


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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1 lg:col-span-1">
              <label className="text-sm font-medium">Discipline</label>
              <Select value={rankingsDiscipline} onValueChange={handleFilterChange('discipline')}>
                <SelectTrigger><SelectValue placeholder="All Disciplines" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  {disciplines.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 lg:col-span-1">
              <label className="text-sm font-medium">Age</label>
              <Select value={rankingsAgeCategory} onValueChange={handleFilterChange('age')}>
                <SelectTrigger><SelectValue placeholder="All Ages" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  {ageCategories.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 lg:col-span-1">
              <label className="text-sm font-medium">Gender</label>
              <Select value={rankingsGender} onValueChange={handleFilterChange('gender')}>
                <SelectTrigger><SelectValue placeholder="All Genders" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 lg:col-span-1 relative">
              <label htmlFor="search" className="text-sm font-medium">Search</label>
              <Search className="absolute left-3 top-[2.1rem] h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Player or association..."
                className="pl-10"
                value={rankingsSearch}
                onChange={(e) => {
                  setRankingsSearch(e.target.value);
                }}
              />
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
            {paginatedRankings.map((player) => (
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRankingsPage(Math.max(1, rankingsPage - 1))}
            disabled={rankingsPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {rankingsPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRankingsPage(Math.min(totalPages, rankingsPage + 1))}
            disabled={rankingsPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
