'use client';
import { RequestsList } from '../requests/RequestsList';
import { RoomsList } from '../rooms/RoomsList';
import { viewModeContextNullSafe } from '../context/chat-ui-context';
import { UserSettings } from '../userpanel/UserSettings';

export function ViewListContainer() {
  const viewMode = viewModeContextNullSafe();

  return (
    <div className="h-full min-h-0 w-full min-w-0 border-t-4 border-r-4 border-b-4 overflow-hidden bg-[#121214] border-[#1E1E22]">
      {viewMode.mode === 'rooms' && <RoomsList />}
      {viewMode.mode === 'requests' && <RequestsList />}
      {viewMode.mode === 'userpanel' && <UserSettings />}
    </div>
  );
}
