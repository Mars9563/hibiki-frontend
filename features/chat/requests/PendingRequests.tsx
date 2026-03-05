'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Button } from '@/components/ui/pixelact-ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import { usePendingRequests, useAcceptRequest } from './useRequests';

export function PendingRequests() {
  const { data, isLoading, isError } = usePendingRequests();
  const acceptMutation = useAcceptRequest();

  if (isLoading) {
    return <div className="p-4 text-[#C4B5FD]">Loading requests...</div>;
  }

  if (isError || !data) {
    return <div className="p-4 text-[#C4B5FD]">Failed to load requests</div>;
  }

  return (
    <div className="h-full min-h-0 grid grid-rows-[auto_1fr_auto_1fr] overflow-hidden bg-[#070312]">
      {/* SENT HEADER */}
      <div
        className="px-4 py-3 border-b-4"
        style={{ backgroundColor: '#140A2E', borderColor: '#241259' }}
      >
        <p className="font-ui text-lg text-[#F3E8FF]">Sent by you</p>
      </div>

      <div className="min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          {data.sentPending.length === 0 && (
            <p className="px-4 py-3 text-sm text-[#C4B5FD]">
              No sent requests.
            </p>
          )}

          {data.sentPending.map((req) => (
            <div
              key={req.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
              style={{
                backgroundColor: '#070312',
                borderBottom: '4px solid #241259',
              }}
            >
              <Avatar variant="round" size="large">
                <AvatarImage src={req.addressee.avatar_url ?? undefined} />
                <AvatarFallback>
                  {req.addressee.full_name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 overflow-hidden">
                <p className="truncate font-ui text-[#F3E8FF]">
                  {req.addressee.full_name}
                </p>
                <p className="truncate text-sm text-[#C4B5FD]">
                  @{req.addressee.username}
                </p>
              </div>

              <span className="text-xs text-[#C4B5FD]">Pending</span>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* RECEIVED HEADER */}
      <div
        className="px-4 py-3 border-y-4"
        style={{ backgroundColor: '#140A2E', borderColor: '#241259' }}
      >
        <p className="font-ui text-lg text-[#F3E8FF]">Received by you</p>
      </div>

      <div className="min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          {data.recievedPending.length === 0 && (
            <p className="px-4 py-3 text-sm text-[#C4B5FD]">
              No received requests.
            </p>
          )}

          {data.recievedPending.map((req) => (
            <div
              key={req.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
              style={{
                backgroundColor: '#070312',
                borderBottom: '4px solid #241259',
              }}
            >
              <Avatar variant="round" size="large">
                <AvatarImage src={req.requester.avatar_url ?? undefined} />
                <AvatarFallback>
                  {req.requester.full_name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 overflow-hidden">
                <p className="truncate font-ui text-[#F3E8FF]">
                  {req.requester.full_name}
                </p>
                <p className="truncate text-sm text-[#C4B5FD]">
                  @{req.requester.username}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  Accept
                </Button>

                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
