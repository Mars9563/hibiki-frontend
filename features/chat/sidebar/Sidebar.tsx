'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MessageSquare, UserPlus2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useViewMode, useSetViewMode, useCurrentUser } from '@/store/selectors';

export function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const viewMode = useViewMode();
  const setViewMode = useSetViewMode();
  const user = useCurrentUser();

  async function logOut() {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error);
        return;
      }
      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside className="flex h-full w-20 flex-col items-center justify-between border-r bg-sidebar px-3 py-4">
      {/* Top Controls */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setViewMode('rooms')}
        >
          <MessageSquare className="size-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setViewMode('requests')}
        >
          <UserPlus2 className="size-5" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="destructive" disabled={isLoading}>
              <LogOut className="size-5" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log out?</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out of your account?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>

              <Button
                variant="destructive"
                onClick={logOut}
                disabled={isLoading}
              >
                Log out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Avatar
          className="cursor-pointer border"
          onClick={() => setViewMode('userpanel')}
          size='lg'
        >
          <AvatarImage src={user?.avatar_url ?? ''} alt="Profile Photo" />
          <AvatarFallback>
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </aside>
  );
}
