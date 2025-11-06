import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function AssociationsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold font-headline tracking-tight">
        Associations
      </h1>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no associations yet
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start managing associations as soon as you add one.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
