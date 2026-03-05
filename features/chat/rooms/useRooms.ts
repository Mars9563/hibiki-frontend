import { useQuery } from '@tanstack/react-query';

async function getRooms() {
  const res = await fetch('/api/rooms', {
    method: 'GET',
    credentials: 'include', // important for Supabase cookies
  });

  if (!res.ok) {
    throw new Error('Failed to fetch rooms');
  }

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error || 'Backend error');
  }

  return data.directRooms;
}

export function DirectRooms() {
  return useQuery({
    queryKey: ['directRooms'],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 60,
  });
}
