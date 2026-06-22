// ============================================================
// store/slices/createSocketSlice.ts
// Replaces features/chat/socket/useChatSocketSync.ts AND
// features/chat/socket/ChatSocketSync.tsx entirely.
//
// The store now owns the socket instance and every listener.
// Call connectSocket(token) once after auth resolves (e.g. in a
// small client component mounted at the app root) and
// disconnectSocket() on logout. Components never touch `socket`
// directly — they call store actions, which emit internally.
// ============================================================
import type { StateCreator } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import type { MessageStructure } from '@/lib/types';
import type { ChatStore } from '../chatStore';
import { toast } from 'sonner';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export type SocketSlice = {
  socket: Socket | null;
  isSocketConnected: boolean;

  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
  joinRoom: (roomId: string) => void;
  joinManyRooms: (roomIds: string[]) => void;
};

export const createSocketSlice: StateCreator<
  ChatStore,
  [['zustand/immer', never]],
  [],
  SocketSlice
> = (set, get) => ({
  socket: null,
  isSocketConnected: false,

  connectSocket: (token) => {
    // Avoid double-connecting on hot reload / repeated mount.
    if (get().socket) return;

    const socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      auth: { token },
    });

    socket.on('connect', () => {
      set((state) => {
        state.isSocketConnected = true;
      });
    });

    socket.on('disconnect', () => {
      set((state) => {
        state.isSocketConnected = false;
      });
    });

    // ---- messages ----
    socket.on(
      'message:new',
      (data: { message: MessageStructure; clientTempId: string }) => {
        get().mergeRealMessage(data.message, data.clientTempId);
      }
    );

    socket.on(
      'message:error',
      (data: { error: string; clientTempId?: string }) => {
        toast.error(data.error || 'Failed to send message');
        if (data.clientTempId) {
          const roomId = findRoomForClientTempId(get(), data.clientTempId);
          if (roomId) get().markMessageFailed(roomId, data.clientTempId);
        }
      }
    );

    // ---- room join feedback ----
    socket.on('room:joined', () => {
      // Intentionally quiet in production; flip on for debugging.
    });

    socket.on('room:unauthorized', (data: { error: string }) => {
      toast.error(data.error);
    });

    socket.on('room:error', (data: { error: string }) => {
      toast.error(data.error);
    });

    // ---- friendship events ----
    socket.on('friendship:got_a_request', () => {
      get().fetchPendingRequests();
      toast.info('New friend request received');
    });

    socket.on('friendship:accepted', () => {
      get().fetchRooms();
      get().fetchPendingRequests();
      toast.success('Friend request accepted');
    });

    socket.on('friendship:rejected', () => {
      toast.info('Your friend request was declined');
    });

    socket.connect();

    set((state) => {
      state.socket = socket;
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (!socket) return;
    socket.removeAllListeners();
    socket.disconnect();
    set((state) => {
      state.socket = null;
      state.isSocketConnected = false;
    });
  },

  joinRoom: (roomId) => {
    get().socket?.emit('room:join', { roomId });
  },

  joinManyRooms: (roomIds) => {
    get().socket?.emit('rooms:joinMany', { roomIds });
  },
});

// A pending message is keyed by clientTempId inside exactly one room's
// item map. We don't track a reverse index for this (failures are rare
// enough that an O(rooms) scan on failure is fine) — see optimization
// notes if this ever needs to be O(1).
function findRoomForClientTempId(
  state: ChatStore,
  clientTempId: string
): string | null {
  for (const [roomId, roomState] of state.messagesByRoom) {
    if (roomState.items.has(clientTempId)) return roomId;
  }
  return null;
}
