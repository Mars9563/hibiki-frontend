import { DirectChatRoom, messageStructure } from '@/lib/types';
import { create } from 'zustand';
type response = {
  success: boolean;
  error?: string;
};

type MessageStore = {
  Messages: Map<
    string,
    Map<
      string,
      {
        message: messageStructure;
        clientTempId: string | null;
        status: 'pending' | 'sent' | 'received';
      }
    >
  >;
  getInitialMessages: (rooms: DirectChatRoom[]) => Promise<response>;
  addOptimisticMessage: (
    message: string,
    clientTempId: string,
    selectedRoom: DirectChatRoom
  ) => void;
  addMessageFromSocket: (
    message: messageStructure,
    clientTempId: string
  ) => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
  Messages: new Map(),

  getInitialMessages: async (rooms: DirectChatRoom[]): Promise<response> => {
    if (!rooms)
      return {
        success: false,
        error: 'Failed to load chats.(got no rooms).',
      };

    const roomIds = rooms.map((room: DirectChatRoom) => room.roomId);
    const query = new URLSearchParams({
      roomIds: JSON.stringify(roomIds),
    }).toString();
    console.log(roomIds);
    const response = await fetch(`/api/messages?${query}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (!data.success)
      return {
        success: false,
        error: 'Failed to load chat messages.',
      };
    const messages: messageStructure[] = data.messages;

    const tempMap = new Map<
      string,
      Map<
        string,
        {
          message: messageStructure;
          clientTempId: string | null;
          status: 'pending' | 'sent' | 'received';
        }
      >
    >();

    roomIds.forEach((roomId) => {
      tempMap.set(roomId, new Map());
    });

    messages.forEach((message) => {
      if (tempMap.has(message.room_id)) {
        tempMap.get(message.room_id)!.set(message.id, {
          message,
          clientTempId: null,
          status: 'sent',
        });
      }
    });

    set(() => ({ Messages: tempMap }));
    return {
      success: true,
    };
  },

  addOptimisticMessage: (
    message: string,
    clientTempId: string,
    selectedRoom: DirectChatRoom
  ) => {
    console.log('hello this was hit i made optimistic message');
    const outerMap = new Map(get().Messages);
    // Clone the inner room map so zustand sees a new reference
    const prevRoomMap = outerMap.get(selectedRoom.roomId) ?? new Map();
    const newRoomMap = new Map(prevRoomMap);

    newRoomMap.set(clientTempId, {
      message: {
        id: clientTempId,
        sender_id: selectedRoom.currentUserId,
        room_id: selectedRoom.roomId,
        created_at: new Date(),
        content: message,
      },
      clientTempId,
      status: 'pending',
    });

    outerMap.set(selectedRoom.roomId, newRoomMap);
    set(() => ({ Messages: outerMap }));
  },

  addMessageFromSocket: (message: messageStructure, clientTempId: string) => {
    const outerMap = new Map(get().Messages);
    // Clone the inner room map so zustand sees a new reference
    const prevRoomMap = outerMap.get(message.room_id) ?? new Map();
    const newRoomMap = new Map(prevRoomMap);

    if (newRoomMap.has(clientTempId)) {
      // Replace optimistic entry with real message — seamless swap
      newRoomMap.delete(clientTempId);
      newRoomMap.set(message.id, {
        message,
        clientTempId: null,
        status: 'sent',
      });
    } else {
      if (newRoomMap.has(message.id)) return;
      newRoomMap.set(message.id, {
        message,
        clientTempId: null,
        status: 'received',
      });
    }

    outerMap.set(message.room_id, newRoomMap);
    set(() => ({ Messages: outerMap }));
  },
}));
