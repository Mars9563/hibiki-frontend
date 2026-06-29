'use client';

import { format } from 'date-fns';
import { Clock, Check, CheckCheck, Copy, ChevronDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TRUNCATE_LIMIT = 300;

interface MessageBubbleProps {
  content: string;
  senderId: string;
  currentUserId: string;
  avatarUrl?: string | null;
  fallback?: ReactNode;
  status?: 'pending' | 'sent' | 'received' | 'failed';
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

  const [isExpanded, setIsExpanded] = useState(false);

  const formattedTime = createdAt
    ? format(new Date(createdAt), 'hh:mm a')
    : null;

  const isLong = content.length > TRUNCATE_LIMIT;

  const displayedContent =
    isLong && !isExpanded
      ? content.slice(0, TRUNCATE_LIMIT).trimEnd()
      : content;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied message');
    } catch {
      toast.error('Failed to copy');
    }
  }

  return (
    <div
      className={cn(
        'group flex w-full gap-3 py-1.5',
        isMine ? 'justify-end' : 'justify-start'
      )}
    >
      {!isMine && (
        <Avatar size="lg" className="mt-auto shrink-0">
          <AvatarImage src={avatarUrl ?? undefined} />

          <AvatarFallback className="bg-accent text-accent-foreground font-medium">
            {fallback ?? '??'}
          </AvatarFallback>
        </Avatar>
      )}

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'relative',

              // responsive width
              'w-auto',
              'min-w-30',

              'max-w-[85%]',
              'sm:max-w-[80%]',
              'md:max-w-[75%]',
              'lg:max-w-[65%]',
              'xl:max-w-175',

              // layout
              'flex flex-col',
              'gap-2',

              // shape
              'rounded-3xl',
              'px-4 py-3',

              // animation
              'transition-all duration-200',

              isMine
                ? [
                    'bg-mine',
                    'text-primary-foreground',
                    'rounded-br-lg',
                    'shadow-lg shadow-primary/15',
                  ]
                : [
                    'bg-card',
                    'text-card-foreground',
                    'border border-border',
                    'rounded-bl-lg',
                  ]
            )}
          >
            <button
              className={cn(
                'absolute right-2 top-2',

                'opacity-0',
                'group-hover:opacity-100',

                'transition-opacity duration-200',

                isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}
            >
              <ChevronDown className="size-4" />
            </button>

            <p className=" pr-5 whitespace-pre-wrap wrap-anywhere text-[15px] leading-6">
              {displayedContent}

              {isLong && !isExpanded && <span className="opacity-50">…</span>}
            </p>

            {isLong && (
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className={cn(
                  'w-fit',

                  'text-xs font-medium',

                  'transition-opacity',
                  'hover:opacity-80',

                  isMine
                    ? 'text-primary-foreground/80'
                    : 'text-muted-foreground'
                )}
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}

            <div
              className={cn(
                'flex items-center justify-end gap-1.5',

                'text-[11px]',

                isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}
            >
              {formattedTime && <span>{formattedTime}</span>}

              {isMine && status === 'pending' && <Clock className="size-3" />}

              {isMine && status === 'sent' && <Check className="size-3" />}

              {isMine && status === 'received' && (
                <CheckCheck className="size-3" />
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={handleCopy}>
            <Copy className="mr-2 size-4" />
            Copy Message
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
