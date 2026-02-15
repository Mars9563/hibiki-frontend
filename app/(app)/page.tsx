import { ChatListPanel } from '@/components/chat/chatList/chat-list';
import { Chat } from '@/components/chat/chatArea/main-chat-area';
import { RoomProvider } from '@/components/chat/room-context';
import { ViewProvider } from '@/components/chat/view-context';
import { Sidebar } from '@/components/chat/sidebar/sidebar';

export default function Home() {
  return (
    <RoomProvider>
      <ViewProvider>
        <div className="h-screen w-screen grid grid-cols-[3.5%_25%_auto] overflow-hidden bg-[#0d2645]">
          <Sidebar />
          <div className="bg-[#8d697a] border-r-4 border-[#0d2645] shadow-inner h-full min-h-0">
            <ChatListPanel />
          </div>
          <div className="bg-[#203c56] border-4 border-[#0d2645] h-full overflow-hidden shadow-[inset_0_0_0_2px_#544e68]">
            <Chat />
          </div>
        </div>
      </ViewProvider>
    </RoomProvider>
  );
}
