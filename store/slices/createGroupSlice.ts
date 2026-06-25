// ============================================================
// store/slices/createGroupSlice.ts
// Group-specific actions: create, invite, fetch/accept/reject
// pending invites. Group *rooms* themselves still live in
// roomsById (RoomsSlice) — this slice only owns the invite
// lifecycle, same separation as friendships (FriendshipsSlice)
// vs rooms (RoomsSlice) for direct chats.
// ============================================================
import type { StateCreator } from 'zustand';
import type { ChatRoom, PendingGroupInvite } from '@/lib/types';
import type { ChatStore } from '../chatStore';

export type GroupSlice = {
  pendingGroupInvites: PendingGroupInvite[];
  groupInvitesStatus: 'idle' | 'loading' | 'error' | 'success';
  groupInvitesError: string | null;

  creatingGroup: boolean;
  invitingToGroup: Set<string>; // composite "roomId:inviteeId" keys in flight
  acceptingGroupInvite: Set<string>; // inviteIds in flight
  rejectingGroupInvite: Set<string>;

  createGroup: (name: string, inviteeIds: string[]) => Promise<void>;
  inviteToGroup: (roomId: string, inviteeId: string) => Promise<void>;
  fetchPendingGroupInvites: () => Promise<void>;
  acceptGroupInvite: (inviteId: string) => Promise<void>;
  rejectGroupInvite: (inviteId: string) => Promise<void>;
};

export const createGroupSlice: StateCreator<
  ChatStore,
  [['zustand/immer', never]],
  [],
  GroupSlice
> = (set, get) => ({
  pendingGroupInvites: [],
  groupInvitesStatus: 'idle',
  groupInvitesError: null,

  creatingGroup: false,
  invitingToGroup: new Set(),
  acceptingGroupInvite: new Set(),
  rejectingGroupInvite: new Set(),

  createGroup: async (name, inviteeIds) => {
    set((state) => {
      state.creatingGroup = true;
    });

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, inviteeIds }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create group');
      }

      // The backend now returns the fully-enriched room shape directly
      // (roomId/roomType/members[]/etc — same contract as GET /rooms),
      // so no shape translation is needed here.
      const room: ChatRoom = data.room;
      get().upsertRoom(room);
      get().joinRoom(room.roomId);

      set((state) => {
        state.creatingGroup = false;
      });
    } catch (err) {
      set((state) => {
        state.creatingGroup = false;
      });
      throw err; // let the caller toast it
    }
  },

  inviteToGroup: async (roomId, inviteeId) => {
    const key = `${roomId}:${inviteeId}`;
    set((state) => {
      state.invitingToGroup.add(key);
    });

    try {
      const res = await fetch(`/api/groups/${roomId}/invites`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteeId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send invite');
      }

      set((state) => {
        state.invitingToGroup.delete(key);
      });
    } catch (err) {
      set((state) => {
        state.invitingToGroup.delete(key);
      });
      throw err;
    }
  },

  fetchPendingGroupInvites: async () => {
    set((state) => {
      state.groupInvitesStatus = 'loading';
      state.groupInvitesError = null;
    });

    try {
      const res = await fetch('/api/group-invites/pending', {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch group invites');

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Fetch failed');

      set((state) => {
        state.pendingGroupInvites = data.pending;
        state.groupInvitesStatus = 'success';
      });
    } catch (err) {
      set((state) => {
        state.groupInvitesStatus = 'error';
        state.groupInvitesError =
          err instanceof Error ? err.message : 'Failed to load invites';
      });
    }
  },

  acceptGroupInvite: async (inviteId) => {
    set((state) => {
      state.acceptingGroupInvite.add(inviteId);
    });

    try {
      const res = await fetch('/api/group-invites/accept', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to accept invite');
      }

      set((state) => {
        state.pendingGroupInvites = state.pendingGroupInvites.filter(
          (inv) => inv.id !== inviteId
        );
        state.acceptingGroupInvite.delete(inviteId);
      });

      // The backend returns the fully-enriched room shape now (see
      // getEnrichedGroupRoom in room.service.ts) — same contract as
      // GET /api/rooms — so we can upsert directly with no refetch.
      const room: ChatRoom = data.room;
      get().upsertRoom(room);
      get().joinRoom(room.roomId);
    } catch (err) {
      set((state) => {
        state.acceptingGroupInvite.delete(inviteId);
      });
      throw err;
    }
  },

  rejectGroupInvite: async (inviteId) => {
    set((state) => {
      state.rejectingGroupInvite.add(inviteId);
    });

    try {
      const res = await fetch('/api/group-invites/reject', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reject invite');
      }

      set((state) => {
        state.pendingGroupInvites = state.pendingGroupInvites.filter(
          (inv) => inv.id !== inviteId
        );
        state.rejectingGroupInvite.delete(inviteId);
      });
    } catch (err) {
      set((state) => {
        state.rejectingGroupInvite.delete(inviteId);
      });
      throw err;
    }
  },
});