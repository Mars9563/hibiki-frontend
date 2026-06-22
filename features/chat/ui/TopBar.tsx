'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Button } from '@/components/ui/pixelact-ui/button';
import { useSelectedRoom } from '@/store/selectors';
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
    <div className="flex flex-row justify-between items-center p-2 border-b-4 border-[#26262B]">
      <div className="flex flex-row items-center gap-3 min-w-0">
        <Avatar
          variant="square"
          size="large"
          style={{
            backgroundColor: '#1C1333',
            color: '#F3E8FF',
          }}
        >
          <AvatarImage
            src={selectedRoom.otherUser.avatarUrl ?? undefined}
            alt="Profile Photo"
          />
          <AvatarFallback
            style={{
              backgroundColor: '#241259',
              color: '#F3E8FF',
            }}
          >
            {selectedRoom.otherUser.fullName?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <p className="font-ui truncate text-3xl text-[#F3E8FF] pr-0.5">
            {selectedRoom.otherUser.fullName}
          </p>
        </div>
      </div>

      <Button variant="secondary" size="sm" className="text-[#F3E8FF]">
        <PiDotsThreeOutlineVerticalDuotone />
      </Button>
    </div>
  );
}
