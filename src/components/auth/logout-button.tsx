/**
 * Logout button component
 * Handles user logout and session clearing
 */

'use client';

import { useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/api/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showIcon?: boolean;
    showText?: boolean;
    className?: string;
}

export function LogoutButton({
    variant = 'outline',
    size = 'default',
    showIcon = true,
    showText = true,
    className,
}: LogoutButtonProps) {
    const router = useRouter();
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = async () => {
        logout(undefined, {
            onSuccess: () => {
                // Redirect to login page after logout
                router.push('/login');
            },
        });
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            disabled={isPending}
            className={className}
        >
            {showIcon && <LogOut className={showText ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />}
            {showText && (isPending ? 'Logging out...' : 'Logout')}
        </Button>
    );
}
