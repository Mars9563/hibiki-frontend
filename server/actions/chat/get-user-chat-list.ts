'use server';

import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/lib/types';
import axios from 'axios';

export type DirectChatRoom = {
  roomId: string;
  roomType: string;
  currentUserId: string;
  otherUserId: string;
  otherUser: {
    id: string;
    fullName: string | null;
    username: string;
    avatarUrl: string | null;
  };
};

export async function getUserChats(): Promise<
  ApiResponse<{
    directRooms: DirectChatRoom[];
  }>
> {
  try {
    console.log('hello i was hit.');
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }
    console.log(process.env.BACKEND_BASE_URL);
    const response = await axios.get(
      process.env.BACKEND_BASE_URL + '/api/rooms',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);

    if (response.data && !response.data.success) {
      return {
        success: false,
        error: 'Internal Server error.',
      };
    }
    console.log(response.data.directRooms);
    return {
      success: true,
      data: {
        directRooms: response.data.directRooms,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed in fetching chats',
    };
  }
}
