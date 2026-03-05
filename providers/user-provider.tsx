'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { z } from 'zod';

const userSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  full_name: z.string(),
  avatar_url: z.string().nullable(),
  created_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
});

export type User = z.infer<typeof userSchema>;

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserDataContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  data: unknown; // important: we don't trust incoming data
  children: React.ReactNode;
}

export function UserProvider({ data, children }: UserProviderProps) {
  // ✅ Validate incoming server data
  const parsed = userSchema.safeParse(data);

  if (!parsed.success) {
    console.error('Invalid user data:', parsed.error);
  }

  const [user, setUser] = useState<User | null>(
    parsed.success ? parsed.data : null
  );

  // ✅ memoize value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

// ✅ Custom hook for safe usage
export function useUser() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
