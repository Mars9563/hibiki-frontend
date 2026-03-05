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
    const response = await axios.get(
      process.env.BACKEND_BASE_URL + '/api/rooms',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && !response.data.success) {
      return {
        success: false,
        error: 'Internal Server error.',
      };
    }
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
