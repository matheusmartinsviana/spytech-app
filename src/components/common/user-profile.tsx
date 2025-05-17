'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export const UserProfile = () => {
    const { data: session, status } = useSession();

    if (status !== 'authenticated') return null;

    const user = session.user;

    return (
        <div className="fixed top-4 right-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-10 w-10 cursor-pointer">
                        <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuItem
                        onClick={() => signOut()}
                        className="cursor-pointer"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
