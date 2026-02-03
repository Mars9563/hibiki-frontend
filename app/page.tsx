import { Chat } from '@/components/chat/main-chat-area';
import { Button } from '@/components/ui/pixelact-ui/button';
import { Settings2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="h-screen w-screen grid grid-cols-[3.5%_25%_auto] overflow-hidden">
      <aside className="flex flex-col items-center justify-center bg-[#603336] border-4 border-[#1d2437]">
        <Button>
          <Settings2 />
        </Button>
      </aside>
      <div className="bg-[#945945]"></div>
      <div className="bg-[#26475b] border-4 border-[#222538] h-full overflow-hidden">
        <Chat />
      </div>
    </div>
  );
}
