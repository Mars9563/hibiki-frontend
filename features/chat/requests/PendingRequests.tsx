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
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useIsAcceptingFrom,
  useIsRejectingFrom,
} from '@/store/selectors';

export function PendingRequests() {
  const { sent, received, status, error } = usePendingRequests();
  const acceptFriendRequest = useAcceptFriendRequest();
  const rejectFriendRequest = useRejectFriendRequest();

  if (status === 'loading') {
    return <div className="p-4 text-[#C4B5FD]">Loading requests...</div>;
  }

  if (status === 'error') {
    return (
      <div className="p-4 text-[#C4B5FD]">
        {error ?? 'Failed to load requests'}
      </div>
    );
  }

  async function handleAccept(requesterId: string, fullName: string | null) {
    try {
      await acceptFriendRequest(requesterId);
      toast.success(`Accepted ${fullName ?? 'their'}'s request`);
    } catch {
      toast.error('Failed to accept request');
    }
  }

  async function handleReject(requesterId: string, fullName: string | null) {
    try {
      await rejectFriendRequest(requesterId);
      toast.success(`Rejected ${fullName ?? 'their'}'s request`);
    } catch {
      toast.error('Failed to reject request');
    }
  }

  return (
    <div className="h-full min-h-0 grid grid-rows-[auto_1fr_auto_1fr] overflow-hidden bg-[#121214] border-[#1E1E22]">
      {/* SENT HEADER */}
      <div className="px-4 py-3 border-b-4 border-[#1E1E22]">
        <p className="font-ui text-lg text-[#F3E8FF]">Sent by you</p>
      </div>

      <div className="min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          {sent.length === 0 && (
            <p className="px-4 py-3 text-sm text-[#C4B5FD]">
              No sent requests.
            </p>
          )}

          {sent.map((req) => (
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
          {received.length === 0 && (
            <p className="px-4 py-3 text-sm text-[#C4B5FD]">
              No received requests.
            </p>
          )}

          {received.map((req) => (
            <PendingReceivedRow
              key={req.id}
              requesterId={req.requester.id}
              fullName={req.requester.full_name}
              username={req.requester.username}
              avatarUrl={req.requester.avatar_url}
              onAccept={() =>
                handleAccept(req.requester.id, req.requester.full_name)
              }
              onReject={() =>
                handleReject(req.requester.id, req.requester.full_name)
              }
            />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

// Pulled into its own component so each row can read its own
// accepting/rejecting flag from the store without re-rendering
// every other row in the list.
function PendingReceivedRow({
  requesterId,
  fullName,
  username,
  avatarUrl,
  onAccept,
  onReject,
}: {
  requesterId: string;
  fullName: string | null;
  username: string;
  avatarUrl: string | null;
  onAccept: () => void;
  onReject: () => void;
}) {
  const isAccepting = useIsAcceptingFrom(requesterId);
  const isRejecting = useIsRejectingFrom(requesterId);

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 border-b-4">
      <Avatar variant="round" size="large">
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>{fullName?.slice(0, 1)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 overflow-hidden">
        <p className="truncate font-ui text-[#F3E8FF]">{fullName}</p>
        <p className="truncate text-sm text-[#C4B5FD]">@{username}</p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={isAccepting || isRejecting}
          onClick={onAccept}
        >
          {isAccepting ? 'Accepting...' : 'Accept'}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          disabled={isRejecting || isAccepting}
          onClick={onReject}
        >
          {isRejecting ? 'Rejecting...' : 'Reject'}
        </Button>
      </div>
    </div>
  );
}
