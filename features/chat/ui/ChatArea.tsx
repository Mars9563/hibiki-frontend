'use client';

import { selectedRoomContextNullSafe } from '../context/chat-ui-context';
import { ChatInput } from './ChatInput';
import { MessageArea } from './MessageArea';
import { TopBar } from './TopBar';

export function ChatArea() {
  const { selectedRoom } = selectedRoomContextNullSafe();

  if (!selectedRoom) {
    return (
      <div className="flex items-center justify-center w-full h-full border-t-4 border-b-4 border-r-4 bg-[#1a1a1e] border-[#26262B]">
        <p className="font-ui text-lg text-[#C4B5FD]">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-rows-[10%_1fr_auto] w-full h-full min-h-0 min-w-0 border-t-4 border-b-4 border-r-4"
      style={{
        backgroundColor: '#070312',
        borderColor: '#241259',
      }}
    >
      <TopBar />
      <MessageArea />
      <ChatInput />
    </div>
  );
}
