'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/pixelact-ui/input';
import { Button } from '@/components/ui/pixelact-ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Search as SearchIcon } from 'lucide-react';
import {
  useSearchUsersState,
  useSearchUsers,
  useSendFriendRequest,
  useIsSendingRequestTo,
} from '@/store/selectors';

const formData = z.object({
  search: z.string().trim().min(1, 'Search cannot be empty'),
});

export function Search() {
  const form = useForm<z.infer<typeof formData>>({
    resolver: zodResolver(formData),
    defaultValues: { search: '' },
  });

  const { query, results, status, error } = useSearchUsersState();
  const searchUsers = useSearchUsers();
  const sendFriendRequest = useSendFriendRequest();

  const isLoading = status === 'loading';

  async function handleSearch(data: z.infer<typeof formData>) {
    await searchUsers(data.search.trim());
  }

  // Fire the toast once when status flips to 'error', not on every
  // render — same guard the original component had via isError+useEffect.
  useEffect(() => {
    if (status === 'error' && error) {
      toast.error('Search Failed', { description: error });
    }
  }, [status, error]);

  async function handleSend(userId: string) {
    try {
      await sendFriendRequest(userId);
    } catch (err: any) {
      toast.error('Request Failed', {
        description: err?.message || 'Could not send request',
      });
    }
  }

  return (
    <div className="h-full min-h-0 w-full min-w-0 grid grid-rows-[auto_1fr]">
      {/* Search Input */}
      <div className="p-4 border-b-4 border-[#1E1E22] grid grid-cols-[1fr_auto] gap-4 items-center">
        <form
          onSubmit={form.handleSubmit(handleSearch)}
          id="searchForm"
          className="w-full"
        >
          <FieldGroup>
            <Controller
              name="search"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter username"
                    autoComplete="off"
                    className="bg-[#1c1c1e]"
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <Button
          disabled={isLoading}
          type="submit"
          form="searchForm"
          variant="secondary"
        >
          <SearchIcon size={18} />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Results */}
      <div className="h-full w-full min-h-0 min-w-0">
        <ScrollArea className="h-full w-full min-h-0 min-w-0">
          {isLoading && (
            <div className="p-4 text-sm text-[#C4B5FD]">Searching...</div>
          )}

          {!isLoading && results.length === 0 && query.length >= 2 && (
            <div className="p-4 text-sm text-[#C4B5FD]">No users found</div>
          )}

          {!isLoading &&
            results.length > 0 &&
            results.map((user) => (
              <SearchResultRow
                key={user.id}
                userId={user.id}
                fullName={user.full_name}
                username={user.username}
                avatarUrl={user.avatar_url}
                onSend={() => handleSend(user.id)}
              />
            ))}
        </ScrollArea>
      </div>
    </div>
  );
}

// Own component so each row's "sending..." state only re-renders that
// row, not the whole results list.
function SearchResultRow({
  userId,
  fullName,
  username,
  avatarUrl,
  onSend,
}: {
  userId: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  onSend: () => void;
}) {
  const isSending = useIsSendingRequestTo(userId);

  return (
    <div className="p-4 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 items-center">
      <Avatar size="large" variant="round">
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>{fullName?.slice(0, 2) ?? 'U'}</AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="font-ui text-xl truncate text-[#F3E8FF]">{fullName}</p>
        <p className="font-ui text-sm truncate text-[#C4B5FD]">
          {'@' + username}
        </p>
      </div>

      <Button
        onClick={onSend}
        disabled={isSending}
        variant="secondary"
        size="sm"
      >
        {isSending ? 'Sending...' : 'Send'}
      </Button>
    </div>
  );
}
