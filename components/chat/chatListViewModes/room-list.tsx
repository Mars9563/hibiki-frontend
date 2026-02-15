'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/pixelact-ui/avatar';
import {
  DirectChatRoom,
  getUserChats,
} from '@/server/actions/chat/get-user-chat-list';
import { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { useRoom } from '../room-context';

export function RoomsList() {
  const [rooms, setRooms] = useState<DirectChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedRoom } = useRoom();

  async function fetchChats() {
    try {
      const response = await getUserChats();

      if (response.success && response.data) {
        setRooms(response.data.directRooms);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchChats();
  }, []);

  async function joinRoom(roomId: string) {
    socket.emit('room:join', {
      roomId: roomId,
    });
  }

  return (
    <div className="grid grid-rows-[auto_1fr] h-full  min-h-0">
      <div className="bg-[#544e68] p-4 border-b-4 border-t-4 border-[#0d2645]">
        <p className="font-ui text-xl">Chats</p>
      </div>
      <div className="min-h-0 h-full">
        <ScrollArea className="h-full bg-[#8d697a]">
          <div className="grid">
            {loading && (
              <p className="p-4 text-sm opacity-70">Loading chats...</p>
            )}

            {!loading && rooms.length === 0 && (
              <p className="p-4 text-sm opacity-70">No chats yet.</p>
            )}

            {rooms.map((room) => (
              <div
                onClick={() => {
                  setSelectedRoom(room);
                  joinRoom(room.roomId);
                }}
                key={room.roomId}
                id={room.roomId}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-center px-4 py-3 border-b-4 border-[#0d2645] hover:bg-[#7b5d6b] transition cursor-pointer"
              >
                <Avatar variant="round" size="large">
                  <AvatarImage src={room.otherUser.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    {room.otherUser.fullName?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate font-ui">{room.otherUser.fullName}</p>
                  <p className="truncate text-sm opacity-70">
                    @{room.otherUser.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// import { ScrollArea } from "@/components/ui/scroll-area";

// export function RoomsList() {
//     return (
//       <div className="grid grid-rows-[auto_1fr] h-full">
//         <div className="bg-[#544e68] p-4 border-b-4 border-t-4 border-[#0d2645]">
//           <p className="font-ui text-xl ">Chats</p>
//         </div>
//         <ScrollArea className="h-full"></ScrollArea>
//       </div>
//     );
// }
