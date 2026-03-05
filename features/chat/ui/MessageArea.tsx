import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';

export function MessageArea() {
  const messages: any[] = [];

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

      {/* Purple void overlay (replaces blue) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#140A2E',
          opacity: 0.85,
        }}
      />

      <ScrollArea className="h-full p-4 relative z-10">
        {messages.map((message, index) => (
          <MessageBubble key={index} content={message.content} />
        ))}
      </ScrollArea>
    </div>
  );
}
