'use client';

import { useRoom } from '../room-context';
import { UserDetailTopArea } from './direct-chat-topbar';
import { ChatInputArea } from './chat-input-area';
import { MessageArea } from './message-area';

export function Chat() {
  const { selectedRoom } = useRoom();

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full min-h-0">
      {selectedRoom && (
        <>
          <UserDetailTopArea />
          <MessageArea />
          <ChatInputArea />
        </>
      )}
    </div>
  );
}
