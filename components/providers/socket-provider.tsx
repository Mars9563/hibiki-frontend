'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { socket } from '@/socket';
import { toast } from 'sonner';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();

    // 1️⃣ Handle initial session on mount
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (token && !socket.connected) {
        socket.auth = { token };
        socket.connect();
      }
    };

    init();

    // 2️⃣ Listen to auth lifecycle changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case 'SIGNED_IN': {
            const token = session?.access_token;
            if (token && !socket.connected) {
              socket.auth = { token };
              socket.connect();
            }
            break;
          }

          case 'SIGNED_OUT': {
            if (socket.connected) {
              socket.disconnect();
            }
            break;
          }

          case 'TOKEN_REFRESHED': {
            // Optional:
            // If you ever want to update auth payload for future reconnects
            const token = session?.access_token;
            if (token) {
              socket.auth = { token };
              if (socket.connected) {
                socket.disconnect();
              }
              socket.connect();
            }
            break;
          }

          case 'USER_UPDATED':
          case 'INITIAL_SESSION':
          default:
            // No socket action required
            break;
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    function onRequestRecieve(data: { from: string }) {
      toast.info(`New friend request from : ${data.from}`);
    }
    function onRequestSent(data: { to: string }) {
      toast.success(`Friend request snet to: ${data.to}`);
    }
    function onRequestAccept() {
      toast.success('Request Accepted Successfully!');
    }
    socket.on('friendship:requested', onRequestSent);
    socket.on('friendship:got_a_request', onRequestRecieve);
    socket.on('friendship:accepted', onRequestAccept);

    return () => {
      socket.off('friendship:requested', onRequestSent);
      socket.off('friendship:got_a_request', onRequestRecieve);
      socket.off('friendship:accepted', onRequestAccept);
    };
  }, []);

  return <>{children}</>;
}
