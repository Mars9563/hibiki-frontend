import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef, useState } from 'react';
import z from 'zod';
import { MessageBubble } from '../messages/message_bubble';
import { socket } from '@/socket';

const recievedMessage = z.object({
  id: z.string(),
  message: z.string(),
});

export function MessageArea() {
  const [myId, setMyId] = useState<string | undefined>(undefined);

  const [messages, setMessages] = useState<z.infer<typeof recievedMessage>[]>(
    []
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onChatMessage(msg: z.infer<typeof recievedMessage>) {
      setMessages((prev) => [...prev, msg]);
    }

    socket.on('chat message', onChatMessage);

    return () => {
      socket.off('chat message', onChatMessage);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <div className="overflow-hidden min-h-0">
      <ScrollArea className="relative h-full px-4 bg-[url('/message_background.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#203c56]/80 pointer-events-none" />
        <div ref={scrollRef} className="relative flex flex-col gap-4">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              id={msg.id}
              text={msg.message}
              avatar="https://picsum.photos/200/200"
              mine={msg.id === myId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
