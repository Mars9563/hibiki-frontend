import { RoomView } from '../RoomView/roomView';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatArea } from '../ui/ChatArea';
import { ViewListContainer } from './ViewListContainer';

export function ChatLayout() {
  return (
    <div className="flex flex-row justify-center items-center h-dvh overflow-hidden">
      <Sidebar />
      <ViewListContainer />
      <ChatArea />
      <RoomView/>
    </div>
  );
}
