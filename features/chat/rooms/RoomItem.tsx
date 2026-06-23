'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DirectChatRoom } from '@/lib/types';
import { useSelectRoom, useSelectedRoom } from '@/store/selectors';
import { cn } from '@/lib/utils';

interface RoomItemProps {
  room: DirectChatRoom;
  onClick?: () => void;
}

export function RoomItem({ room, onClick }: RoomItemProps) {
  const selectRoom = useSelectRoom();
  const selectedRoom = useSelectedRoom();
  const isActive = selectedRoom?.roomId === room.roomId;

  const initials = room.otherUser.fullName?.slice(0, 2) ?? '??';

  return (
    <button
      type="button"
      onClick={() => {
        selectRoom(room.roomId);
        onClick?.();
      }}
      className={cn(
        'flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        isActive ? 'bg-primary/10' : 'hover:bg-muted'
      )}
    >
      <Avatar className="size-11 shrink-0">
        <AvatarImage src={room.otherUser.avatarUrl ?? undefined} />
        <AvatarFallback className="bg-accent text-accent-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm font-medium',
            isActive ? 'text-primary' : 'text-foreground'
          )}
        >
          {room.otherUser.fullName ?? room.otherUser.username}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          @{room.otherUser.username}
        </p>
      </div>
    </button>
  );
}
