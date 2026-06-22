import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { DateSeparator } from './dateSeperator';
import { useEffect, useRef } from 'react';
import { isToday, isYesterday, format } from 'date-fns';
import {
  useSelectedRoom,
  useMessagesForRoom,
  useRoomMessageMeta,
  useLoadMoreMessages,
} from '@/store/selectors';

function getDateLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'd/M/yyyy');
}

export function MessageArea() {
  const selectedRoom = useSelectedRoom();
  const roomId = selectedRoom?.roomId ?? null;
  const bottomRef = useRef<HTMLDivElement>(null);

  const messageEntries = useMessagesForRoom(roomId);
  const { hasMore, isLoadingMore } = useRoomMessageMeta(roomId);
  const loadMoreMessages = useLoadMoreMessages();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageEntries.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [roomId]);

  function handleLoadMore() {
    if (!roomId || !hasMore || isLoadingMore) return;
    loadMoreMessages(roomId);
  }

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
        {hasMore && (
          <div className="flex justify-center pb-3">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="pixel-font text-xs px-3 py-1.5 border border-[#444] text-[#a3a3a3] hover:opacity-80 disabled:opacity-50"
            >
              {isLoadingMore ? 'Loading...' : 'Load older messages'}
            </button>
          </div>
        )}

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
