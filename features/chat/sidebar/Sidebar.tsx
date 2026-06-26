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
import { RequestsDialog } from '../requests/RequestsDialog';
import {
  useViewMode,
  useSetViewMode,
  useCurrentUser,
  usePendingRequests,
} from '@/store/selectors';
import { MdGroups2 } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Inbox } from 'lucide-react';
import { CreateGroupDialog } from '../groups/createGroupDialog';
import { GroupInvitesDialog } from '../groups/groupInviteDialog';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupInvitesOpen, setGroupInvitesOpen] = useState(false);
  const router = useRouter();

  const viewMode = useViewMode();
  const setViewMode = useSetViewMode();
  const user = useCurrentUser();
  const { received } = usePendingRequests();

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
    <aside className="flex h-full w-20 flex-col items-center justify-between border-r bg-sidebar px-3 py-4 font-chat">
      {/* Top Controls */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="icon"
          variant={viewMode === 'rooms' ? 'secondary' : 'ghost'}
          onClick={() => setViewMode('rooms')}
        >
          <MessageSquare className="size-5" />
        </Button>

        <Button
          size="icon"
          variant={requestsOpen ? 'secondary' : 'ghost'}
          onClick={() => setRequestsOpen(true)}
          className="relative"
        >
          <UserPlus2 className="size-5" />
          {received.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {received.length > 9 ? '9+' : received.length}
            </span>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MdGroups2 size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-fit p-2">
            <DropdownMenuItem
              onClick={() => setCreateGroupOpen(true)}
              className="flex flex-row justify-between items-center gap-2"
            >
              <span>Create group</span>
              <Plus className="size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setGroupInvitesOpen(true)}
              className="flex flex-row justify-center items-center gap-2"
            >
              <span>Group invites</span>
              <Inbox className="size-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RequestsDialog open={requestsOpen} onOpenChange={setRequestsOpen} />
      <CreateGroupDialog
        open={createGroupOpen}
        onOpenChange={setCreateGroupOpen}
      />
      <GroupInvitesDialog
        open={groupInvitesOpen}
        onOpenChange={setGroupInvitesOpen}
      />

      {/* Bottom Controls */}
      <div className="flex flex-col items-center gap-3">
        <ThemeToggle />
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
          size="lg"
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
