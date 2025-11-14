'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart2,
  User,
  Shield,
  Settings,
  Trophy,
  ClipboardEdit,
  GitBranch,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { ProfileDialog } from './profile-dialog';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { LogoutButton } from '@/components/auth/logout-button';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/associations', label: 'Associations', icon: Users },
  { href: '/registration', label: 'Registration', icon: ClipboardEdit },
  { href: '/draws', label: 'Draws', icon: GitBranch },
  { href: '/player-rankings', label: 'Player Rankings', icon: BarChart2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { data: currentUser, isPending: userLoading } = useCurrentUser();

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-headline text-xl font-semibold">SportVerse</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto w-full justify-start gap-3 p-2">
                <Avatar className="h-9 w-9">
                  {currentUser?.imageUrl && <AvatarImage src={currentUser.imageUrl} />}
                  <AvatarFallback>
                    {userLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : currentUser ? (
                      currentUser.name.split(' ').map(n => n[0]).join('')
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[collapsible=icon]:hidden">
                  <p className="font-medium text-sm">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-sidebar-foreground/70">{currentUser?.email || 'Loading...'}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton variant="ghost" size="sm" className="w-full justify-start" />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
    </>
  );
}
