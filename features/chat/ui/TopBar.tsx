'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSelectedRoom, useSetSidePanelOpen } from '@/store/selectors';
import { FaUserLarge } from 'react-icons/fa6';
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi';
import { UsersRound } from 'lucide-react';

export function TopBar() {
  const selectedRoom = useSelectedRoom();
  const setSidePanelOpen = useSetSidePanelOpen();

  if (!selectedRoom) {
    return (
      <div
        className="p-2 border-b-4"
        style={{
          backgroundColor: '#140A2E',
          borderColor: '#241259',
        }}
      />
    );
  }

  // Direct and group rooms surface name/avatar from different places
  // on the same ChatRoom union — direct rooms nest it under
  // otherUser, groups carry it directly on the room. Branch once here
  // rather than letting either field get read unconditionally.
  const isGroup = selectedRoom.roomType === 'group';
  const displayName = isGroup
    ? selectedRoom.name
    : selectedRoom.otherUser.fullName;
  const avatarUrl = isGroup
    ? selectedRoom.avatarUrl
    : selectedRoom.otherUser.avatarUrl;
  const subtitle = isGroup
    ? `${selectedRoom.members.length} members`
    : undefined;

  return (
    <div className="flex flex-row justify-between items-center px-2 py-3 w-full bg-card min-h-17 border-b">
      <div className="flex flex-row items-center gap-3 min-w-0">
        <Avatar size="lg">
          <AvatarImage src={avatarUrl ?? undefined} alt="Profile Photo" />
          <AvatarFallback>
            {isGroup ? <UsersRound /> : <FaUserLarge />}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="font-chat truncate text-xl">{displayName}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <Button className="" type='button' onClick={() => {
        setSidePanelOpen(true);
      }}>
        <PiDotsThreeOutlineVerticalDuotone />
      </Button>
    </div>
  );
}
