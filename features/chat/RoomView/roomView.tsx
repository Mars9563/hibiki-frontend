'use client';
import { useSelectedRoom, useSidePanelOpen } from '@/store/selectors';
import { GroupRoomView } from './groupRoomView';
import { ChatRoomView } from './chatRoomView';

export function RoomView() {
  const selectedRoom = useSelectedRoom();
  const sidePanelOpen = useSidePanelOpen();
  if (selectedRoom === null || !sidePanelOpen) {
    return null;
  }
  const isGroup = selectedRoom.roomType === 'group';

  return (
    <div className="w-125 bg-card h-full">
      {isGroup ? <GroupRoomView /> : <ChatRoomView />}
    </div>
  );
}
