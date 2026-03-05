import { ViewModeContextProvider } from '../context/chat-ui-context';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatArea } from '../ui/ChatArea';
import { ViewListContainer } from './ViewListContainer';
import { ChatSocketSync } from '../socket/ChatSocketSync';

export function ChatLayout() {
  return (
    <div className="grid grid-cols-[4%_minmax(0,26%)_1fr] h-screen overflow-hidden">
      <ViewModeContextProvider>
        {/* 🔥 Client socket sync lives here */}
        <ChatSocketSync />
        <Sidebar />
        <ViewListContainer />
        <ChatArea />
      </ViewModeContextProvider>
    </div>
  );
}
