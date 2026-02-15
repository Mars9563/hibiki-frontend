import { CardContent } from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui/pixelact-ui/card';

interface MessageBubbleProps {
  id: string;
  text: string;
  avatar: string;
  mine: boolean;
}

export function MessageBubble({ id, text, avatar, mine }: MessageBubbleProps) {
  return (
    <div
      className={`flex flex-row items-end font-chat w-full min-w-0 ${
        mine ? 'justify-end' : 'justify-start'
      }`}
    >
      {!mine && (
        <Avatar size="small" variant="round">
          <AvatarImage src={avatar} alt="round avatar" />
          <AvatarFallback>{id.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}

      <div className="max-w-[49%] min-w-0 flex">
        <Card
          className={`border-4 border-[#1a314d] ${mine ? 'bg-[#ffaa5e] text-[#0d2645]' : 'bg-[#ffecd6] text-[#0d2645]'} shadow-[2px_2px_0_#544e68]`}
        >
          <CardContent className="font-chat leading-relaxed text-sm break-all whitespace-pre-wrap px-3 py-2">
            {text}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
