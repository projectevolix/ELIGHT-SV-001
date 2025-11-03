import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tournaments = [
  {
    name: 'Summer Championship 2024',
    game: 'League of Legends',
    region: 'North America',
    prizePool: '$100,000',
    status: 'Ongoing',
  },
  {
    name: 'The International 2024',
    game: 'Dota 2',
    region: 'Global',
    prizePool: '$40,000,000',
    status: 'Upcoming',
  },
  {
    name: 'Masters Tokyo',
    game: 'Valorant',
    region: 'APAC',
    prizePool: '$1,000,000',
    status: 'Finished',
  },
  {
    name: 'BLAST Premier: Fall Finals',
    game: 'CS:GO',
    region: 'Europe',
    prizePool: '$425,000',
    status: 'Upcoming',
  },
    {
    name: 'World Cyber Games',
    game: 'Multiple',
    region: 'Global',
    prizePool: '$5,000,000',
    status: 'Finished',
  },
  {
    name: 'Rocket League Championship',
    game: 'Rocket League',
    region: 'Global',
    prizePool: '$2,000,000',
    status: 'Ongoing',
  },
];

export default function TournamentsPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'default';
      case 'Upcoming':
        return 'secondary';
      case 'Finished':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Tournaments
        </h1>
        <Button>Create Tournament</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <Card key={tournament.name} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">{tournament.name}</CardTitle>
              <CardDescription>{tournament.game} - {tournament.region}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Prize Pool</span>
                <span className="font-semibold">{tournament.prizePool}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusVariant(tournament.status)}>{tournament.status}</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
