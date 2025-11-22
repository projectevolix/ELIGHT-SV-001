'use client';

import { AppHeader } from '@/components/dashboard/app-header';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full overflow-hidden flex">
      <SidebarProvider className="w-full h-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col h-full overflow-hidden">
          <AppHeader />
          <main className="flex flex-col flex-1 space-y-8 p-4 md:p-6 lg:p-8 overflow-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
