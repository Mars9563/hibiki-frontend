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
      className={`flex flex-row items-end font-chat ${
        mine ? 'justify-end' : 'justify-start'
      }`}
    >
      {!mine && (
        <Avatar size="small" variant="round">
          <AvatarImage src={avatar} alt="round avatar" />
          <AvatarFallback>{id.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}

      <Card className="max-w-[70%]">
        <CardContent className="font-chat leading-relaxed text-sm break-words">
          {text}
        </CardContent>
      </Card>
    </div>
  );
}
