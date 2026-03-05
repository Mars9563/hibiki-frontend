'use client';

import { useChatSocketSync } from './useChatSocketSync';

export function ChatSocketSync() {
  useChatSocketSync();
  return null; // no UI
}
