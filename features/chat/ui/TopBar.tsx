'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSelectedRoom } from '@/store/selectors';
import { FaUserLarge } from 'react-icons/fa6';
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi';

export function TopBar() {
  const selectedRoom = useSelectedRoom();

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

  return (
    <div className="flex flex-row justify-between items-center px-2 py-3 w-full bg-card min-h-17 border-b">
      <div className="flex flex-row items-center gap-3 min-w-0">
        <Avatar
          size="lg"
        >
          <AvatarImage
            src={selectedRoom.otherUser.avatarUrl ?? undefined}
            alt="Profile Photo"
          />
          <AvatarFallback
          >
            <FaUserLarge/>
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <p className="font-chat truncate text-xl">
            {selectedRoom.otherUser.fullName}
          </p>
        </div>
      </div>

      <Button className='text-'>
        <PiDotsThreeOutlineVerticalDuotone />
      </Button>
    </div>
  );
}
