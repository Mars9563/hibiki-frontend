export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type messageStructure = {
  id: string;
  sender_id: string;
  room_id: string;
  created_at: Date;
  content: string;
};

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
