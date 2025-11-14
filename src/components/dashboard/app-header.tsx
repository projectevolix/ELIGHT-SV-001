'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfileDialog } from './profile-dialog';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { LogoutButton } from '@/components/auth/logout-button';

export function AppHeader() {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { data: currentUser } = useCurrentUser();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end md:px-6">
        <div className="sm:hidden">
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  {currentUser?.imageUrl && <AvatarImage src={currentUser.imageUrl} />}
                  <AvatarFallback>
                    {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : <User className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{currentUser?.name || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton variant="ghost" size="sm" showIcon={true} showText={true} className="w-full justify-start px-2" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
    </>
  );
}
