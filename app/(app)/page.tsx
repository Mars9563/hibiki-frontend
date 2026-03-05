import { ChatLayout } from '@/features/chat/layout/ChatLayout';
import { QueryProvider } from '@/providers/query-provider';
import { SocketProvider } from '@/providers/socket-provider';

export default function Home() {
  return (
    <QueryProvider>
      <SocketProvider>
        <ChatLayout />
      </SocketProvider>
    </QueryProvider>
  );
}
