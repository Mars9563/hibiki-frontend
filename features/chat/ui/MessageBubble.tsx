import { Card, CardContent } from '@/components/ui/pixelact-ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  content: string;
  senderId: string;
  currentUserId: string;
  avatarUrl?: string | null;
  fallback?: string;
  status?: 'pending' | 'sent' | 'received';
  createdAt?: Date | string;
}

export function MessageBubble({
  content,
  senderId,
  currentUserId,
  avatarUrl,
  fallback,
  status,
  createdAt,
}: MessageBubbleProps) {
  const isMine = senderId === currentUserId;

  const formattedTime = createdAt
    ? format(new Date(createdAt), 'hh:mm a')
    : null;

  return (
    <div
      className={`w-full flex gap-3 p-2 ${
        isMine ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isMine && (
        <Avatar size="medium" variant="round">
          <AvatarImage src={avatarUrl ?? undefined} />
          <AvatarFallback
            style={{
              backgroundColor: '#241259',
              color: '#F3E8FF',
            }}
          >
            {fallback ?? '??'}
          </AvatarFallback>
        </Avatar>
      )}

      <Card className="max-w-xl w-full" font={'normal'}>
        <CardContent className='p-2'>
          {/* Preformatted content — preserves whitespace/newlines but wraps long lines */}
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              margin: 0,
            }}
          >
            {content}
          </pre>
        </CardContent>
        {/* Footer: time + status icon (only for own messages) */}
        {isMine && (formattedTime || status) && (
          <div
            className="flex items-center justify-end gap-1 mt-1"
            style={{ opacity: 0.6 }}
          >
            {formattedTime && (
              <span style={{ fontSize: '0.65rem' }}>{formattedTime}</span>
            )}
            {status === 'pending' && <Clock size={11} strokeWidth={2} />}
            {(status === 'sent' || status === 'received') && (
              <Check size={11} strokeWidth={2.5} />
            )}
          </div>
        )}

        {/* Footer: time only for other user's messages */}
        {!isMine && formattedTime && (
          <div
            className="flex items-center justify-end mt-1"
            style={{ opacity: 0.5 }}
          >
            <span style={{ fontSize: '0.65rem' }}>{formattedTime}</span>
          </div>
        )}
      </Card>
    </div>
  );
}
