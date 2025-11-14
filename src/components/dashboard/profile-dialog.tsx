
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Loader2 } from 'lucide-react';
import { useCurrentUser } from '@/hooks/api/useUsers';

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { data: currentUser, isPending, error } = useCurrentUser();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogDescription>
            Your personal information.
          </DialogDescription>
        </DialogHeader>
        {isPending ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : currentUser ? (
          <div className="flex items-center gap-4 pt-4">
            <Avatar className="h-20 w-20">
              {currentUser.imageUrl && <AvatarImage src={currentUser.imageUrl} />}
              <AvatarFallback>
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <p className="text-sm text-muted-foreground">{currentUser.role}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {error ? (
              <div>
                <p className="font-semibold text-destructive">Failed to load profile</p>
                <p className="text-xs mt-2">{(error as any)?.message || 'Unknown error'}</p>
              </div>
            ) : (
              'Failed to load profile'
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
