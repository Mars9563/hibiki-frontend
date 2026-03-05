'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useState } from 'react';
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
import { useSearchUsers, useSendFriendRequest } from './useRequests';

const formData = z.object({
  search: z.string().trim().min(1, 'Search cannot be empty'),
});

export function Search() {
  const [query, setQuery] = useState('');

  const form = useForm<z.infer<typeof formData>>({
    resolver: zodResolver(formData),
    defaultValues: { search: '' },
  });

  const { data: results, isLoading, isError, error } = useSearchUsers(query);
  const sendMutation = useSendFriendRequest(query);

  async function handleSearch(data: z.infer<typeof formData>) {
    setQuery(data.search);
  }

  if (isError && error instanceof Error) {
    toast.error('Search Failed', { description: error.message });
  }

  return (
    <div className="h-full min-h-0 w-full min-w-0 grid grid-rows-[auto_1fr] bg-[#070312]">
      {/* Search Input */}
      <div
        className="p-4 border-b-4 grid grid-cols-[1fr_auto] gap-4 items-center"
        style={{
          backgroundColor: '#1A0F3D',
          borderColor: '#241259',
          // 🌌 Pixel system overrides
          ['--color-secondary' as any]: '#241259',
          ['--color-secondary-foreground' as any]: '#F3E8FF',

          ['--destructive' as any]: '#8B2CF5',
          ['--destructive-foreground' as any]: '#FFFFFF',

          ['--ring' as any]: '#241259',
          ['--foreground' as any]: '#C4B5FD',

          ['--default-inner-border-color' as any]: '#241259',
        }}
      >
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
                    className="bg-[#140A2E] text-[#F3E8FF] border-[#241259]"
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
          className="text-[#F3E8FF]"
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

          {!isLoading &&
            results &&
            results.length === 0 &&
            query.length >= 2 && (
              <div className="p-4 text-sm text-[#C4B5FD]">No users found</div>
            )}

          {!isLoading &&
            results &&
            results.length > 0 &&
            results.map((user) => (
              <div
                key={user.id}
                className="p-4 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 items-center"
                style={{
                  backgroundColor: '#070312',
                  borderBottom: '4px solid #241259',
                }}
              >
                <Avatar
                  size="large"
                  variant="round"
                  style={{
                    backgroundColor: '#1C1333',
                    color: '#F3E8FF',
                  }}
                >
                  <AvatarImage src={user.avatar_url ?? undefined} />
                  <AvatarFallback
                    style={{
                      backgroundColor: '#241259',
                      color: '#F3E8FF',
                    }}
                  >
                    {user.full_name?.slice(0, 2) ?? 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="font-ui text-xl truncate text-[#F3E8FF]">
                    {user.full_name}
                  </p>
                  <p className="font-ui text-sm truncate text-[#C4B5FD]">
                    {'@' + user.username}
                  </p>
                </div>

                <Button
                  onClick={() =>
                    sendMutation.mutate(user.id, {
                      onError: (err: any) => {
                        toast.error('Request Failed', {
                          description: err?.message || 'Could not send request',
                        });
                      },
                    })
                  }
                  disabled={sendMutation.isPending}
                  variant="secondary"
                  size="sm"
                >
                  {sendMutation.isPending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            ))}
        </ScrollArea>
      </div>
    </div>
  );
}
