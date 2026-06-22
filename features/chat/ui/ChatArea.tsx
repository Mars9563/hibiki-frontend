'use client';
import { useSelectedRoom } from '@/store/selectors';
import { ChatInput } from './ChatInput';
import { MessageArea } from './MessageArea';
import { TopBar } from './TopBar';

export function ChatArea() {
  const selectedRoom = useSelectedRoom();

  if (!selectedRoom) {
    return (
      <div className="flex flex-1 items-center justify-center w-full h-full bg-background">
        <p className="font-ui text-lg text-foreground">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full min-h-0 min-w-0 bg-background">
      <TopBar />
      <MessageArea />
      <ChatInput />
    </div>
  );
}
