
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Match } from './types';

type MatchupCardProps = {
  match: Match;
};

export function MatchupCard({ match }: MatchupCardProps) {
  const isBye = match.player2 === 'BYE';
  
  return (
    <Card className="w-64 shadow-md">
      <CardContent className="p-4">
        <CardDescription className="text-xs">{match.seeds}</CardDescription>
        <div className="mt-2 space-y-2">
          <div className="font-semibold text-sm">{match.player1}</div>
          <div className="font-semibold text-sm">{match.player2}</div>
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <Button variant="outline" size="sm" className="w-full" disabled={isBye}>
          View Scoreboard
        </Button>
      </CardFooter>
    </Card>
  );
}
