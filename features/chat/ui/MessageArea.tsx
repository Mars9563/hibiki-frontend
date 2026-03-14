import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { selectedRoomContextNullSafe } from '../context/chat-ui-context';
import { useMessageStore } from './useMessages';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef } from 'react';

export function MessageArea() {
  const { selectedRoom } = selectedRoomContextNullSafe();
  const roomId = selectedRoom?.roomId;
  const bottomRef = useRef<HTMLDivElement>(null);

  const messageEntries = useMessageStore(
    useShallow((state) => {
      if (!roomId) return [];
      const roomMap = state.Messages.get(roomId);
      if (!roomMap) return [];
      return Array.from(roomMap.values());
    })
  );

  // Scroll to bottom smoothly when a new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageEntries.length]);

  // Scroll to bottom instantly when switching rooms
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [roomId]);

  return (
    <div
      className="relative flex flex-col h-full min-h-0 min-w-0"
      style={{
        backgroundColor: '#070312',
      }}
    >
      {/* Optional background texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/message_background.jpg')",
        }}
      />
      {/* Purple void overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#140A2E',
          opacity: 0.85,
        }}
      />
      <ScrollArea className="h-full p-4 relative z-10">
        {messageEntries.map(({ message, status }) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            senderId={message.sender_id}
            currentUserId={selectedRoom?.currentUserId ?? ''}
            avatarUrl={selectedRoom?.otherUser.avatarUrl}
            fallback={selectedRoom?.otherUser.fullName?.slice(0, 2)}
            status={status}
            createdAt={message.created_at}
          />
        ))}
        {/* Anchor element — scrolled into view on new messages / room change */}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  );
}
