import { AppBootstrap } from '@/features/chat/AppBootStrap';
import { ChatLayout } from '@/features/chat/layout/ChatLayout';
import { createClient } from '@/lib/supabase/client';

export default async function Home() {
  const supabase = createClient();
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
      <AppBootstrap initialUser={userData}/>
      <ChatLayout />
    </>
  );
}
