import { useQuery } from '@tanstack/react-query';
import { socket } from '@/lib/socket';
import { useEffect } from 'react';
import { DirectChatRoom } from '@/lib/types';
import { useMessageStore } from '../ui/useMessages';

async function getRooms() {
  const res = await fetch('/api/rooms', {
    method: 'GET',
    credentials: 'include', // important for Supabase cookies
  });

  if (!res.ok) {
    throw new Error('Failed to fetch rooms');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'Backend error');
  }

  return data.directRooms;
}

export function DirectRooms() {
  const query = useQuery({
    queryKey: ['directRooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!query.data || query.data.length === 0) return;

    async function run() {
      const response = await useMessageStore
        .getState()
        .getInitialMessages(query.data);

      if (!response.success) {
        
        throw new Error("Failed to load chats.");
      }
      console.log(response.success);

      const roomIds = query.data.map((room: DirectChatRoom) => room.roomId);

      socket.emit('rooms:joinMany', { roomIds });
    }

    run();
  }, [query.data]);

  return query;
}
