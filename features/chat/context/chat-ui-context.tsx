'use client';
import { DirectChatRoom } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

type ViewMode = 'rooms' | 'requests' | 'userpanel';
type viewModeContextType = {
  mode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};
type SelectedRoomContextType = {
  selectedRoom: DirectChatRoom | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<DirectChatRoom | null>>;
};

const viewModeContext = createContext<viewModeContextType | null>(null);
export const selectedRoomContext =
  createContext<SelectedRoomContextType | null>(null);

export function viewModeContextNullSafe() {
  const value = useContext(viewModeContext);
  if (value === null) throw new Error('context null');
  return value;
}
export function selectedRoomContextNullSafe() {
  const value = useContext(selectedRoomContext);
  if (value === null) throw new Error('selectedRoomContext null');
  return value;
}


interface Children {
  children: React.ReactNode;
}

export function ViewModeContextProvider({ children }: Children) {
  const [mode, setViewMode] = useState<ViewMode>('rooms');
  const [selectedRoom, setSelectedRoom] = useState<DirectChatRoom | null>(null);

  return (
    <viewModeContext.Provider
      value={{
        mode: mode,
        setViewMode: setViewMode,
      }}
    >
      <selectedRoomContext.Provider value={{ selectedRoom, setSelectedRoom }}>
        {children}
      </selectedRoomContext.Provider>
    </viewModeContext.Provider>
  );
}
