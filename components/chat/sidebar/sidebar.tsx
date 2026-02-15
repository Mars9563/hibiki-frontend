'use client';

import { LogOut, MessageSquare, Settings2, UserPlus2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useViewMode } from '@/components/chat/view-context';
import { MdOutlineGroups2 } from 'react-icons/md';
import { Avatar, AvatarImage } from '@/components/ui/pixelact-ui/avatar';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/pixelact-ui/dialog';
import { Button } from '@/components/ui/pixelact-ui/button';

export function Sidebar() {
  const router = useRouter();

  const { setViewMode } = useViewMode();

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
    <>
      <aside className="flex flex-col gap-2 items-center justify-between bg-[#d08159] border-r-4 border-[#0d2645] shadow-inner py-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <Button type="button" onClick={() => setViewMode('rooms')}>
            <MessageSquare />
          </Button>
          <Button type="button" onClick={() => setViewMode('pending')}>
            <UserPlus2 />
          </Button>
          <Button>
            <MdOutlineGroups2 />{' '}
          </Button>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'destructive'} type={'button'}>
                <LogOut />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Log out?</DialogTitle>
              <DialogDescription>
                Are you sure you want to logout?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={'secondary'}>Cancel</Button>
                </DialogClose>
                <Button variant={'destructive'} type="button" onClick={logOut}>
                  Log out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Avatar size="medium" variant="round">
            <AvatarImage src={'https://picsum.photos/200'} />
          </Avatar>
        </div>
      </aside>
    </>
  );
}
