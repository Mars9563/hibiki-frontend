'use client';

import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { selectedRoomContextNullSafe } from '../context/chat-ui-context';

export function useChatSocketSync() {
  const queryClient = useQueryClient();
  const { selectedRoom } = selectedRoomContextNullSafe();

  /* =====================================================
     1️⃣ JOIN ROOM WHEN SELECTED ROOM CHANGES
  ===================================================== */

  useEffect(() => {
    if (!selectedRoom?.roomId) return;

    socket.emit('room:join', {
      roomId: selectedRoom.roomId,
    });
  }, [selectedRoom?.roomId]);

  /* =====================================================
     2️⃣ ROOM JOIN FEEDBACK
  ===================================================== */

  useEffect(() => {
    function onRoomJoined(data: { roomId: string }) {
      console.log('Joined room:', data.roomId);
    }

    function onRoomUnauthorized(data: { error: string }) {
      toast.error(data.error);
    }

    function onRoomError(data: { error: string }) {
      toast.error(data.error);
    }

    socket.on('room:joined', onRoomJoined);
    socket.on('room:unauthorized', onRoomUnauthorized);
    socket.on('room:error', onRoomError);

    return () => {
      socket.off('room:joined', onRoomJoined);
      socket.off('room:unauthorized', onRoomUnauthorized);
      socket.off('room:error', onRoomError);
    };
  }, []);

  /* =====================================================
     3️⃣ MESSAGE RECEIVE
  ===================================================== */

  useEffect(() => {
    function onMessageReceived(data: any) {
      // Invalidate messages for that room
      queryClient.invalidateQueries({
        queryKey: ['messages', data.roomId],
      });
    }

    socket.on('message:new', onMessageReceived);

    return () => {
      socket.off('message:new', onMessageReceived);
    };
  }, [queryClient]);

  /* =====================================================
     4️⃣ FRIENDSHIP EVENTS
  ===================================================== */

  useEffect(() => {
    function onFriendRequest() {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      toast.info('New friend request received');
    }

    function onFriendAccepted() {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      toast.success('Friend request accepted');
    }

    socket.on('friendship:got_a_request', onFriendRequest);
    socket.on('friendship:accepted', onFriendAccepted);

    return () => {
      socket.off('friendship:got_a_request', onFriendRequest);
      socket.off('friendship:accepted', onFriendAccepted);
    };
  }, [queryClient]);
}
