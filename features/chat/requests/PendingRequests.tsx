'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Button } from '@/components/ui/pixelact-ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import {
  usePendingRequests,
  useAcceptRequest,
  useRejectRequest,
} from './useRequests';

export function PendingRequests() {
  const { data, isLoading, isError } = usePendingRequests();
  const acceptMutation = useAcceptRequest();
  const rejectMutation = useRejectRequest();

  if (isLoading) {
    return <div className="p-4 text-[#C4B5FD]">Loading requests...</div>;
  }

  if (isError || !data) {
    return <div className="p-4 text-[#C4B5FD]">Failed to load requests</div>;
  }

  return (
    <div className="h-full min-h-0 grid grid-rows-[auto_1fr_auto_1fr] overflow-hidden bg-[#121214] border-[#1E1E22]">
      {/* SENT HEADER */}
      <div className="px-4 py-3 border-b-4 border-[#1E1E22]">
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
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 border-b-4"
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
      <div className="px-4 py-3 border-y-4 border-[#1E1E22]">
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
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 border-b-4"
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
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={
                    acceptMutation.isPending || rejectMutation.isPending
                  }
                  onClick={() =>
                    acceptMutation.mutate(req.requester.id, {
                      onSuccess: () =>
                        toast.success(
                          `Accepted ${req.requester.full_name}'s request`
                        ),
                      onError: () => toast.error('Failed to accept request'),
                    })
                  }
                >
                  {acceptMutation.isPending ? 'Accepting...' : 'Accept'}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={
                    rejectMutation.isPending || acceptMutation.isPending
                  }
                  onClick={() =>
                    rejectMutation.mutate(req.requester.id, {
                      onSuccess: () =>
                        toast.success(
                          `Rejected ${req.requester.full_name}'s request`
                        ),
                      onError: () => toast.error('Failed to reject request'),
                    })
                  }
                >
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
