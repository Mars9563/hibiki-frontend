'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { socket } from '@/lib/socket';


export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();

    // 🔹 Connect on initial session
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    };

    init();

    // 🔹 Listen to auth lifecycle
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const token = session?.access_token;

        switch (event) {
          case 'SIGNED_IN':
            if (token) {
              socket.auth = { token };
              socket.connect();
            }
            break;

          case 'SIGNED_OUT':
            socket.disconnect();
            break;

          case 'TOKEN_REFRESHED':
            if (token) {
              socket.auth = { token };
              socket.disconnect();
              socket.connect();
            }
            break;

          default:
            break;
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
}
