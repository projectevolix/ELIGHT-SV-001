import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, UserCheck, ShieldCheck } from "lucide-react";

const activities = [
  {
    icon: Trophy,
    description: "Golden State Warriors won against the Lakers.",
    time: "15 minutes ago",
  },
  {
    icon: Award,
    description: "Lionel Messi scored a hat-trick.",
    time: "1 hour ago",
  },
  {
    icon: UserCheck,
    description: "New player 'Alex Morgan' joined your favorite team.",
    time: "3 hours ago",
  },
  {
    icon: ShieldCheck,
    description: "Team 'Cloud9' updated their roster for the upcoming tournament.",
    time: "5 hours ago",
  },
  {
    icon: Trophy,
    description: "Manchester City secures the Premier League title.",
    time: "1 day ago",
  },
];

export function RecentActivity() {
  return (
    <Card className="shadow">
      <CardHeader>
        <CardTitle className="font-headline">Recent Activity</CardTitle>
        <CardDescription>Stay updated with the latest happenings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                 <activity.icon className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium leading-none">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
