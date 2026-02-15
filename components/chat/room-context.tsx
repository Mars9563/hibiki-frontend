'use client';

import { createContext, useContext, useState } from 'react';
import { DirectChatRoom } from '@/server/actions/chat/get-user-chat-list';

type RoomContextType = {
  selectedRoom: DirectChatRoom | null;
  setSelectedRoom: (room: DirectChatRoom | null) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [selectedRoom, setSelectedRoom] = useState<DirectChatRoom | null>(null);

  return (
    <RoomContext.Provider value={{ selectedRoom, setSelectedRoom }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used inside RoomProvider');
  }
  return context;
}
