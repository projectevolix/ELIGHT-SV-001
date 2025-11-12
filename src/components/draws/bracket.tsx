
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { MatchupCard } from './matchup-card';
import type { Tournament, Event, Round, Match } from './types';

// Mock data for the bracket
const bracketData: Round[] = [
    {
        name: 'Round 1',
        matches: [
            { id: 1, seeds: '1 vs 8', player1: 'Kasun Perera', player2: 'Nipun Silva' },
            { id: 2, seeds: '4 vs 5', player1: 'John Doe', player2: 'Jane Smith' },
            { id: 3, seeds: '3 vs 6', player1: 'Alice Williams', player2: 'Bob Brown' },
            { id: 4, seeds: '2 vs 7', player1: 'Nethmi Wijesinghe', player2: 'BYE' },
        ]
    },
    {
        name: 'Round 2',
        matches: [
            { id: 5, seeds: '1 vs 4', player1: 'Kasun Perera', player2: 'John Doe' },
            { id: 6, seeds: '3 vs 2', player1: 'Alice Williams', player2: 'Nethmi Wijesinghe' },
        ]
    },
    {
        name: 'Final',
        matches: [
            { id: 7, seeds: '1 vs 3', player1: 'TBD', player2: 'TBD' },
        ]
    }
];

type BracketProps = {
  tournament: Tournament;
  event: Event;
};

export function Bracket({ tournament, event }: BracketProps) {
  const [isPublished, setIsPublished] = useState(false);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">{tournament.name}</CardTitle>
          <CardDescription>{event.name}</CardDescription>
        </div>
        <div className="flex items-center gap-4">
          {isPublished ? (
             <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Published</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
                <ShieldAlert className="h-5 w-5" />
                <span className="font-medium">Not Published</span>
            </div>
          )}
          <Button onClick={() => setIsPublished(p => !p)}>
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4 overflow-x-auto pb-4">
          {bracketData.map((round, roundIndex) => (
            <div key={round.name} className="flex flex-col items-center flex-shrink-0">
              <h3 className="text-lg font-semibold mb-4">{round.name}</h3>
              <div className="space-y-16 relative">
                {round.matches.map((match, matchIndex) => (
                    <div key={match.id} className="relative">
                        <MatchupCard match={match} />
                        {roundIndex < bracketData.length - 1 && (
                            <>
                                <div className="absolute top-1/2 -right-8 h-px w-8 bg-border" />
                                {matchIndex % 2 === 0 && (
                                    <div 
                                        className="absolute top-1/2 -right-8 h-[calc(100%_+_4rem)] w-px bg-border" 
                                    />
                                )}
                            </>
                        )}
                         {roundIndex > 0 && (
                            <>
                                <div className="absolute top-1/2 -left-8 h-px w-8 bg-border" />
                            </>
                        )}
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
