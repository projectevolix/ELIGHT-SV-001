
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogDescription>
            Your personal information.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 pt-4">
            <Avatar className="h-20 w-20">
                <AvatarFallback>
                    <User className="h-10 w-10" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="text-lg font-semibold">Andy Vogel</p>
                <p className="text-sm text-muted-foreground">andy.vogel@example.com</p>
                <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
