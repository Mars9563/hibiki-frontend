'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* =========================
   Types
========================= */

export type SearchUser = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
};

/* =========================
   Search Query
========================= */

async function searchUsers(username: string): Promise<SearchUser[]> {
  if (!username || username.length < 2) {
    return [];
  }

  const res = await fetch(
    `/api/friendships/search?q=${encodeURIComponent(username)}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to search users');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'Search failed');
  }

  return data.results;
}

export function useSearchUsers(username: string) {
  return useQuery({
    queryKey: ['searchUsers', username],
    queryFn: () => searchUsers(username),
    enabled: username.length >= 2,
    staleTime: 1000 * 30,
  });
}

/* =========================
   Send Friend Request
========================= */

async function sendFriendRequest(targetUserId: string): Promise<string> {
  const res = await fetch('/api/friendships/request', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetUserId }),
  });

  if (!res.ok) {
    throw new Error('Failed to send request');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'Request failed');
  }

  return targetUserId;
}

export function useSendFriendRequest(currentQuery: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFriendRequest,

    onSuccess: (targetUserId) => {
      // Remove user from current search results cache
      queryClient.setQueryData<SearchUser[]>(
        ['searchUsers', currentQuery],
        (old) => (old ? old.filter((u) => u.id !== targetUserId) : [])
      );
    },
  });
}

/* =========================
   Pending Requests Types
========================= */

export type PendingUser = {
  id: string;
  status: string;
  created_at: string;

  requester: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };

  addressee: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
};

export type PendingResponse = {
  sentPending: PendingUser[];
  recievedPending: PendingUser[];
};

/* =========================
   Fetch Pending Requests
========================= */

async function getPendingRequests(): Promise<PendingResponse> {
  const res = await fetch('/api/friendships/pending', {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch pending requests');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'Pending fetch failed');
  }

  return {
    sentPending: data.sentPending,
    recievedPending: data.recievedPending,
  };
}

export function usePendingRequests() {
  return useQuery({
    queryKey: ['pendingRequests'],
    queryFn: getPendingRequests,
    staleTime: 1000 * 10,
  });
}

/* =========================
   Accept Request
========================= */

async function acceptFriendRequest(targetId: string) {
  const res = await fetch('/api/friendships/accept', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetId }),
  });

  if (!res.ok) {
    throw new Error('Failed to accept request');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'Accept failed');
  }

  return targetId;
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFriendRequest,

    onSuccess: (targetId) => {
      // Remove accepted request from received list
      queryClient.setQueryData<PendingResponse>(
        ['pendingRequests'],
        (old) => {
          if (!old) return old;

          return {
            sentPending: old.sentPending,
            recievedPending: old.recievedPending.filter(
              (r) => r.requester.id !== targetId
            ),
          };
        }
      );

      // Invalidate rooms (since accept creates chat room)
      queryClient.invalidateQueries({ queryKey: ['directRooms'] });
    },
  });
}
