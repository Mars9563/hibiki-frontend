import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './dateSeperator';
import { selectedRoomContextNullSafe } from '../context/chat-ui-context';
import { useMessageStore } from './useMessages';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef } from 'react';
import { isToday, isYesterday, format } from 'date-fns';

function getDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'd/M/yyyy');
}

type SeparatorItem = { type: 'separator'; label: string; key: string };
type MessageItem = {
  type: 'message';
  entry: ReturnType<
    typeof useMessageStore extends (s: infer S) => infer R ? never : never
  >;
};

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageEntries.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [roomId]);

  const items: (
    | { type: 'separator'; label: string; key: string }
    | { type: 'message'; entry: (typeof messageEntries)[number] }
  )[] = [];

  let lastDateLabel: string | null = null;

  for (const entry of messageEntries) {
    const date = new Date(entry.message.created_at);
    const label = getDateLabel(date);

    if (label !== lastDateLabel) {
      items.push({ type: 'separator', label, key: `sep-${label}` });
      lastDateLabel = label;
    }

    items.push({ type: 'message', entry });
  }

  return (
    <div className="relative flex flex-col h-full min-h-0 min-w-0 bg-[#1a1a1e] border-[#26262B]">
      <ScrollArea className="h-full p-4 relative z-10">
        {items.map((item) =>
          item.type === 'separator' ? (
            <DateSeparator key={item.key} date={item.label} />
          ) : (
            <MessageBubble
              key={item.entry.message.id}
              content={item.entry.message.content}
              senderId={item.entry.message.sender_id}
              currentUserId={selectedRoom?.currentUserId ?? ''}
              avatarUrl={selectedRoom?.otherUser.avatarUrl}
              fallback={selectedRoom?.otherUser.fullName?.slice(0, 2)}
              status={item.entry.status}
              createdAt={item.entry.message.created_at}
            />
          )
        )}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  );
}
