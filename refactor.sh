#!/usr/bin/env bash

set -e

echo "🔥 Removing old chat structure..."

rm -rf components/chat
rm -rf components/providers
rm -f socket.ts

echo "📦 Creating new architecture..."

# Providers
mkdir -p providers
touch providers/query-provider.tsx
touch providers/socket-provider.tsx
touch providers/toast-provider.tsx

# Features
mkdir -p features/chat/{layout,ui,sidebar,rooms,pending,messages,friendships,context,socket}

# Layout
touch features/chat/layout/ChatLayout.tsx

# UI
touch features/chat/ui/ChatArea.tsx
touch features/chat/ui/ChatInput.tsx
touch features/chat/ui/MessageArea.tsx
touch features/chat/ui/MessageBubble.tsx
touch features/chat/ui/TopBar.tsx

# Sidebar
touch features/chat/sidebar/Sidebar.tsx

# Rooms
touch features/chat/rooms/RoomsList.tsx
touch features/chat/rooms/RoomItem.tsx
touch features/chat/rooms/useRooms.ts

# Pending
touch features/chat/pending/PendingList.tsx
touch features/chat/pending/PendingRequests.tsx
touch features/chat/pending/SearchBar.tsx
touch features/chat/pending/SearchResults.tsx
touch features/chat/pending/usePending.ts

# Messages
touch features/chat/messages/useMessages.ts
touch features/chat/messages/useSendMessage.ts

# Friendships
touch features/chat/friendships/useAcceptRequest.ts
touch features/chat/friendships/useRejectRequest.ts
touch features/chat/friendships/useSendRequest.ts

# Context
touch features/chat/context/chat-ui-context.tsx

# Socket sync
touch features/chat/socket/useChatSocketSync.ts

# Lib updates
touch lib/query-client.ts

echo "✅ Hibiki refactor structure created successfully."
