import { Card, CardContent } from '@/components/ui/pixelact-ui/card';

interface MessageBubbleProps {
  content: string;
}
export function MessageBubble({ content }: MessageBubbleProps) {
  return (
    <div className='p-2'>
      <Card className="max-w-xl">
        <CardContent>{content} </CardContent>
      </Card>
    </div>
  );
}
