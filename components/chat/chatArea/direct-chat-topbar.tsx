import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Button } from '@/components/ui/pixelact-ui/button';
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi';
import { useRoom } from '../room-context';

export function UserDetailTopArea() {
  const { selectedRoom } = useRoom();
  return (
    <div className="flex flex-row items-center justify-between bg-[#d08159] border-b-4 border-[#0d2645] shadow-[inset_0_-2px_0_#8d697a] p-2">
      {selectedRoom && (
        <div className="flex flex-row items-center gap-8">
          <Avatar variant="round" size="large">
            <AvatarImage src={selectedRoom.otherUser.avatarUrl ?? undefined} />
            <AvatarFallback>
              {selectedRoom.otherUser.fullName?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-ui">
              {selectedRoom.otherUser.fullName}
            </p>
            <p className="truncate text-sm opacity-70 font-ui">
              @{selectedRoom.otherUser.username}
            </p>
          </div>
        </div>
      )}
      <Button type="button">
        <PiDotsThreeOutlineVerticalDuotone />
      </Button>
    </div>
  );
}
