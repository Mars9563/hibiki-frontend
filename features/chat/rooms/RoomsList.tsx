import { ScrollArea } from '@/components/ui/scroll-area';
import { DirectRooms } from './useRooms';
import { RoomItem } from './RoomItem';

export type DirectChatRoom = {
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
};

export function RoomsList() {
  const { data: rooms, isLoading, error } = DirectRooms();

  if (isLoading)
    return <div className="p-4 text-[#C4B5FD]">Loading...chats</div>;
  if (error)
    return <div className="p-4 text-[#C4B5FD]">Something went wrong</div>;
  if (!rooms || rooms.length === 0)
    return <div className="p-4 text-[#C4B5FD]">No chats yet</div>;

  return (
    <div className="grid grid-rows-[7%_1fr] h-full min-h-0 w-full min-w-0">
      <div
        className="flex flex-col justify-center items-start p-4 border-b-4"
        style={{
          backgroundColor: '#241259',
          borderColor: '#241259',
        }}
      >
        <p className="font-ui text-4xl text-[#F3E8FF]">Chats</p>
      </div>

      <div className="h-full w-full min-h-0 min-w-0">
        <ScrollArea className="h-full w-full min-h-0 min-w-0">
          {rooms.map((room: DirectChatRoom) => (
            <RoomItem key={room.roomId} room={room} />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
