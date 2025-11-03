import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const events = [
  { event: "Lakers vs. Warriors", date: "Oct 25, 2024", status: "Scheduled" },
  { event: "Yankees vs. Red Sox", date: "Oct 28, 2024", status: "Scheduled" },
  { event: "UFC 300 Prelims", date: "Nov 5, 2024", status: "Scheduled" },
  { event: "Man. United vs. Liverpool", date: "Nov 12, 2024", status: "Postponed" },
];

export function UpcomingEvents() {
  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle className="font-headline">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((item) => (
              <TableRow key={item.event}>
                <TableCell className="font-medium">{item.event}</TableCell>
                <TableCell className="text-muted-foreground">{item.date}</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant={item.status === "Postponed" ? "destructive" : "outline"} 
                    className={item.status === "Scheduled" ? "border-green-500/50 text-green-600" : ""}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
