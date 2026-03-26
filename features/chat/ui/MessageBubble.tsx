'use client';
import { format } from 'date-fns';
import { Clock, Check, CheckCheck } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/pixelact-ui/context-menu';
import '@/components/ui/pixelact-ui/styles/styles.css';
import { IoIosArrowDown } from 'react-icons/io';
import { useState } from 'react';
import { toast } from 'sonner';

// Number of characters before the message gets truncated
const TRUNCATE_LIMIT = 300;

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

  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isLong = content.length > TRUNCATE_LIMIT;
  const displayedContent =
    isLong && !isExpanded
      ? content.slice(0, TRUNCATE_LIMIT).trimEnd()
      : content;

  const copyToClipBord = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Message has been copied to clipboard.');
    } catch {
      toast.error('Message copying failed.');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div
      className={`w-full flex gap-2 px-3 py-1 ${
        isMine ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar for other user */}
      {!isMine && (
        <div className="flex-shrink-0 self-end mb-1">
          <Avatar size="small" variant="square">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback
              className="pixel-font rounded-none"
              style={{ backgroundColor: '#241259', color: '#F3E8FF' }}
            >
              {fallback ?? '??'}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Pixel Bubble */}
      <div
        className="pixel-font box-shadow-margin"
        style={{
          maxWidth: '60%',
          minWidth: '60px',
          boxShadow: isMine
            ? '4px 4px 0px #4a2a8a, -2px -2px 0px #4a2a8a, 2px -2px 0px #4a2a8a, -2px 2px 0px #4a2a8a'
            : '4px 4px 0px #333, -2px -2px 0px #333, 2px -2px 0px #333, -2px 2px 0px #333',
          backgroundColor: isMine ? '#241259' : '#1a1a1a',
          border: isMine ? '2px solid #6b3fa0' : '2px solid #444',
          borderRadius: 0,
          padding: '8px 10px 5px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          imageRendering: 'pixelated',
        }}
      >
        {/* Context menu trigger row */}
        <div className="w-full flex justify-end items-center">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <button>
                <IoIosArrowDown />
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={copyToClipBord}>Copy</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>

        {/* Message text */}
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontSize: '0.99rem',
            margin: 0,
            lineHeight: '1.5',
            color: '#f0f0f0',
            letterSpacing: '0.02em',
          }}
        >
          {displayedContent}
          {/* Inline ellipsis when truncated */}
          {isLong && !isExpanded && (
            <span style={{ color: '#888', userSelect: 'none' }}>…</span>
          )}
        </pre>

        {/* Read more / Read less button */}
        {isLong && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="pixel-font"
            style={{
              alignSelf: 'flex-start',
              marginTop: '2px',
              padding: '2px 6px',
              fontSize: '0.6rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isMine ? '#c084fc' : '#a3a3a3',
              background: 'transparent',
              border: isMine ? '1px solid #6b3fa0' : '1px solid #444',
              borderRadius: 0,
              cursor: 'pointer',
              // subtle pixel hover handled via inline — no Tailwind hover needed
              transition: 'opacity 0.1s',
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.opacity = '0.7')
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.opacity = '1')
            }
          >
            {isExpanded ? '▲ Read less' : '▼ Read more'}
          </button>
        )}

        {/* Footer: time + status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '4px',
            opacity: 0.6,
          }}
        >
          {formattedTime && (
            <span
              className="pixel-font"
              style={{
                fontSize: '0.55rem',
                lineHeight: 1,
                letterSpacing: '0.05em',
              }}
            >
              {formattedTime}
            </span>
          )}
          {isMine && status === 'pending' && (
            <Clock
              size={9}
              strokeWidth={2}
              style={{ imageRendering: 'pixelated' }}
            />
          )}
          {isMine && status === 'sent' && <Check size={9} strokeWidth={3} />}
          {isMine && status === 'received' && (
            <CheckCheck size={9} strokeWidth={3} />
          )}
        </div>
      </div>
    </div>
  );
}
