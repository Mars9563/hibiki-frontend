// ============================================================
// features/chat/AppBootstrap.tsx
// Mount this ONCE near the root of the authenticated app
// (e.g. inside app/(app)/page.tsx, above ChatLayout).
//
// Replaces, simultaneously:
//   - providers/user-provider.tsx        (UserProvider)
//   - providers/query-provider.tsx       (QueryProvider)
//   - providers/socket-provider.tsx       (SocketProvider)
//   - features/chat/socket/ChatSocketSync.tsx
//
// It does three things on mount:
//   1. Pushes the server-fetched profile into the store
//      (replaces UserProvider's context value).
//   2. Grabs a fresh Supabase access token and calls
//      connectSocket() (replaces SocketProvider + ChatSocketSync).
//   3. Kicks off the initial rooms + pending-requests fetch.
//
// NOTE: `initialUser` should still be fetched server-side exactly
// like app/(app)/layout.tsx already does — just pass the result
// in as a prop instead of wrapping children in a Context provider.
// ============================================================
'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/store/chatStore';
import type { Profile } from '@/lib/types';

export function AppBootstrap({ initialUser }: { initialUser: Profile | null }) {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const store = useChatStore.getState();
    store.setCurrentUser(initialUser);

    async function bootstrap() {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (token) {
        useChatStore.getState().connectSocket(token);
      }

      useChatStore.getState().fetchRooms();
      useChatStore.getState().fetchPendingRequests();
    }

    bootstrap();

    return () => {
      useChatStore.getState().disconnectSocket();
    };
  }, [initialUser]);

  return null;
}
