'use client';

import { useViewMode } from '@/store/selectors';
import { RequestsList } from '../requests/RequestsList';
import { RoomsList } from '../rooms/RoomsList';
import { UserSettings } from '../userpanel/UserSettings';


export function ViewListContainer() {
  const viewMode = useViewMode();

  return (
    <div className="h-full min-h-0 w-25/100 min-w-0 overflow-hidden border-r bg-card">
      {viewMode === 'rooms' && <RoomsList />}
      {viewMode === 'requests' && <RequestsList />}
      {viewMode === 'userpanel' && <UserSettings />}
    </div>
  );
}
