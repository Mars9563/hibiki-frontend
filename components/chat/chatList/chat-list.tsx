'use client';
import { RoomsList } from './viewModes/room-list';
import { PendingList } from './viewModes/pending-list';
import { useViewMode } from '../view-context';

export function ChatListPanel() {
  const { viewMode } = useViewMode();

  return (
    <div className="h-full min-h-0 border-r-4 border-[#0d2645] w-full">
      {viewMode === 'rooms' && <RoomsList />}
      {viewMode === 'pending' && <PendingList />}
    </div>
  );
}
