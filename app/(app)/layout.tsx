import { SocketProvider } from '@/components/providers/socket-provider';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}
export default async function ChatLayout({ children }: ChatLayoutProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/login');
  }
  if (!data.user.email_confirmed_at) {
    return (
      <>
        {' '}
        <div className="h-full w-full flex flex-col justify-center items-center text-3xl">
          Please confirm your email first!
        </div>
      </>
    );
  }

  return (
    <>
      <SocketProvider>{children}</SocketProvider>
    </>
  );
}
