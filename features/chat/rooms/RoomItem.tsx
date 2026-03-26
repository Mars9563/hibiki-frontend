import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { selectedRoomContextNullSafe } from '../context/chat-ui-context';

interface DirectChatRoom {
  roomId: string;
  roomType: string;
  currentUserId: string;
  otherUserId: string;
  otherUser: {
    id: string;
    fullName: string | null;
    username: string;
    avatarUrl: string | null;
  };
}

export function RoomItem({ room }: { room: DirectChatRoom }) {
  const { setSelectedRoom } = selectedRoomContextNullSafe();

  return (
    <div
      className="min-w-0 py-3 px-4 grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-center cursor-pointer transition-colors duration-100 border-b-4 border-[#1E1E22]"
      onClick={() => setSelectedRoom(room)}
    >
      <Avatar
        size="large"
        variant="square"
        style={{
          backgroundColor: '#1C1333',
          color: '#F3E8FF',
        }}
      >
        <AvatarImage src={room.otherUser.avatarUrl ?? undefined} />
        <AvatarFallback
          style={{
            backgroundColor: '#241259',
            color: '#F3E8FF',
          }}
        >
          {room.otherUser.fullName?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="font-ui text-xl truncate text-[#F3E8FF]">
          {room.otherUser.fullName}
        </p>
      </div>
    </div>
  );
}
