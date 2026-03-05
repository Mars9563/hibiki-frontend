import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserProvider } from '@/providers/user-provider';

interface ChatLayoutProps {
  children: ReactNode;
}

export default async function AppLayout({ children }: ChatLayoutProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/login');
  }
  let userData = null;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(
      process.env.BACKEND_BASE_URL + '/api/personal/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    userData = (await response.json())[0];
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <UserProvider data={userData}>{children}</UserProvider>
    </>
  );
}
