import { ScrollArea } from '@/components/ui/scroll-area';
import { DirectRooms } from './useRooms';
import { RoomItem } from './RoomItem';
import { socket } from '@/lib/socket';
import { DirectChatRoom } from '@/lib/types';



export function RoomsList() {
  const { data: rooms, isLoading, error } = DirectRooms();
    

  if (isLoading)
    return <div className="p-4 text-[#C4B5FD] h-full flex justify-center items-center font-ui text-xl">Loading...chats</div>;
  if (error)
    return (
      <div className="p-4 text-[#C4B5FD] h-full flex justify-center items-center font-ui text-xl">
        Something went wrong
      </div>
    );
  if (!rooms || rooms.length === 0)
    return (
      <div className="p-4 text-[#C4B5FD] h-full flex justify-center items-center font-ui text-xl">
        No chats yet
      </div>
    );

  return (
    <div className="grid grid-rows-[7%_1fr] h-full min-h-0 w-full min-w-0">
      <div className="flex flex-col justify-center items-start p-4 border-b-4 border-[#1E1E22]">
        <p className="font-ui text-4xl text-[#8B7AB8]">Chats</p>
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
