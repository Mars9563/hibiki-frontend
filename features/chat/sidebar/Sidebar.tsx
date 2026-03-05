'use client';
import { DialogClose } from '@/components/ui/dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Button } from '@/components/ui/pixelact-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/pixelact-ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { LogOut, MessageSquare, UserPlus2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { viewModeContextNullSafe } from '../context/chat-ui-context';
import { useUser } from '@/providers/user-provider';

export function Sidebar() {
  const router = useRouter();
  const viewMode = viewModeContextNullSafe();
  const { user, setUser } = useUser();

  async function logOut() {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log(error);
        return;
      }
      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col justify-between items-center py-4 px-2 border-4 bg-[#121214] border-[#1E1E22]">
      {/* Top Controls */}
      <div className="flex flex-col justify-center items-center gap-3">
        <Button
          variant="secondary"
          type="button"
          onClick={() => viewMode.setViewMode('rooms')}
        >
          <MessageSquare />
        </Button>

        <Button
          variant="secondary"
          type="button"
          onClick={() => viewMode.setViewMode('requests')}
        >
          <UserPlus2 />
        </Button>

        <Button variant="secondary" />
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col justify-center items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" type="button">
              <LogOut />
            </Button>
          </DialogTrigger>

          <DialogContent
            className="border-4"
            style={{
              backgroundColor: '#1A0F3D',
              borderColor: '#241259',
              color: '#F3E8FF',
            }}
          >
            <DialogTitle style={{ color: '#F3E8FF' }}>Log out?</DialogTitle>

            <DialogDescription style={{ color: '#C4B5FD' }}>
              Are you sure you want to logout?
            </DialogDescription>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>

              <Button variant="destructive" type="button" onClick={logOut}>
                Log out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Avatar
          variant="round"
          size="medium"
          onClick={() => viewMode.setViewMode('userpanel')}
          style={{
            backgroundColor: '#1C1333',
            color: '#F3E8FF',
          }}
        >
          <AvatarImage src={user?.avatar_url || ''} alt="Profile Photo" />
          <AvatarFallback
            style={{
              backgroundColor: '#241259',
              color: '#F3E8FF',
            }}
          >
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
