'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/pixelact-ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusSquare, Search } from 'lucide-react';
import {
  searchResult,
  UserData,
} from '@/server/actions/friendships/get-all-search-results';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/pixelact-ui/avatar';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Field, FieldGroup } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/pixelact-ui/input';
import { toast } from 'sonner';
import { Card } from '@/components/ui/pixelact-ui/card';
import { sendRequest } from '@/server/actions/friendships/send-friend-request';
import { socket } from '@/socket';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/pixelact-ui/accordion';
import {
  pendingUserRequests,
  recievedPending,
  sentPending,
} from '@/server/actions/friendships/get-all-pending-requests';
import { acceptRequest } from '@/server/actions/friendships/accept-friend-request';

const formData = z.object({
  search: z.string().trim().min(1, 'Search cannot be empty'),
});

export function PendingList() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [sentPending, setSentPending] = useState<sentPending[]>([]);
  const [receivedPending, setReceivedPending] = useState<recievedPending[]>([]);

  const form = useForm<z.infer<typeof formData>>({
    resolver: zodResolver(formData),
    defaultValues: { search: '' },
  });

  async function fetchPending() {
    const response = await pendingUserRequests();

    if (!response.success) {
      toast.error('Failed to load pending requests');
      return;
    }
    if (response.data) {
      setSentPending(response.data.sentPending);
      setReceivedPending(response.data.recievedPending);
    }
  }

  async function handleSearch(data: z.infer<typeof formData>) {
    setIsLoading(true);
    try {
      const response = await searchResult(data.search);

      if (!response.success) {
        toast.error('Search Failed!', {
          description: response.error,
        });
        return;
      }

      setSearchResults(response.data?.SearchUsers ?? []);
    } catch (error) {
      toast.error('Search Failed', {
        description: 'Search result failed please try again',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendRequest(userId: string, username: string) {
    setIsLoading(true);
    try {
      const response = await sendRequest(userId);

      if (!response.success) {
        toast.error('Friend Request Failed', {
          description:
            response.error || 'Please try again friend request failed.',
        });
        return;
      }

      setSearchResults((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      toast.error('Requset sending failed!', {
        description:
          'There has been an error while sending the friend request.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleAccept(requester_id: string, request_id: string) {
    setIsLoading(true);
    try {
      if (!requester_id && !request_id) {
        toast.error('Accept failed', {
          description: 'paramaters were missing in the accept handler.',
        });
        return;
      }

      const response = await acceptRequest(requester_id);

      if (!response.success) {
        toast.error('Accept Failed!', {
          description:
            response.error ||
            'There was an error while accepting the request. Please try again later.',
        });
        return;
      }
      setReceivedPending((prev) =>
        prev.filter((prev) => prev.id !== request_id)
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  useEffect(() => {
    function onRequestSent() {
      fetchPending();
    }
    function onRequestRecieved() {
      fetchPending();
    }
    

    socket.on('friendship:requested', onRequestSent);
    socket.on('friendship:got_a_request', onRequestRecieved);

    return () => {
      socket.off('friendship:requested', onRequestSent);
      socket.off('friendship:got_a_request', onRequestRecieved);
    };
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto_1fr] h-full min-h-0">
      {/* 🔵 SEARCH HEADER */}
      <div className="px-4 py-3 border-b-4 border-[#0d2645] bg-[#d08159]">
        <h2 className="font-ui text-xl text-[#0d2645] tracking-widest">
          SEARCH
        </h2>
      </div>

      {/* 🔵 SEARCH CONTENT */}
      <div className="grid grid-rows-[auto_1fr] gap-4 p-4 bg-[#8d697a] border-b-4 border-[#0d2645] min-h-0">
        {/* Search Bar */}
        <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
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
            className="bg-[#ffa55e] text-[#0d2645] border-2 border-[#0d2645]"
          >
            <Search />
          </Button>
        </div>

        {/* Results */}
        <div className="border-2 border-[#0d2645] bg-[#ffecd6] min-h-0 overflow-hidden">
          <ScrollArea className="h-full p-4 w-full overflow-x-hidden">
            <div className="grid gap-3 mx-2">
              {searchResults.length === 0 && (
                <p className="font-ui text-sm text-[#544e68] opacity-70">
                  No users found.
                </p>
              )}

              {searchResults.map((user) => (
                <Card
                  key={user.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 w-full min-w-0"
                >
                  {/* Avatar */}
                  <Avatar variant="round" size="large">
                    <AvatarImage
                      src={user.avatar_url || 'https://picsum.photos/200'}
                      alt="user profile image"
                    />
                    <AvatarFallback>
                      {user.full_name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Text */}
                  <div className="min-w-0 overflow-hidden">
                    <p className="truncate font-ui">{user.full_name}</p>
                    <p className="truncate text-sm opacity-70">
                      @{user.username}
                    </p>
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => handleSendRequest(user.id, user.username)}
                    disabled={isLoading}
                  >
                    <PlusSquare size={16} />
                    Send
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* 🔴 REQUESTS HEADER */}
      <div className="px-4 py-3 border-b-4 border-[#0d2645] bg-[#d08159]">
        <h2 className="font-ui text-xl text-[#0d2645] tracking-widest">
          REQUESTS
        </h2>
      </div>

      {/* 🔴 REQUESTS CONTENT */}
      <div className="bg-[#8d697a] min-h-0 overflow-hidden">
        <div className="text-sm text-[#0d2645] pl-2">
          <Accordion type="single" collapsible>
            <AccordionItem value="sent">
              <AccordionTrigger>Sent by you</AccordionTrigger>
              <AccordionContent className="p-0">
                <ScrollArea className="h-64">
                  {sentPending.length === 0 && (
                    <p className="px-4 py-3 text-sm opacity-70">
                      No sent requests.
                    </p>
                  )}

                  {sentPending.map((req) => (
                    <div
                      key={req.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 border-b-4 border-[#0d2645] w-full"
                    >
                      {/* Avatar */}
                      <Avatar variant="round" size="large">
                        <AvatarImage src={req.addressee.avatar_url} />
                        <AvatarFallback>
                          {req.addressee.full_name?.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Text */}
                      <div className="min-w-0 overflow-hidden">
                        <p className="truncate font-ui">
                          {req.addressee.full_name}
                        </p>
                        <p className="truncate text-sm opacity-70">
                          @{req.addressee.username}
                        </p>
                      </div>

                      {/* Status */}
                      <span className="text-xs opacity-70 whitespace-nowrap">
                        Pending
                      </span>
                    </div>
                  ))}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recieved">
              <AccordionTrigger>Recieved by you</AccordionTrigger>
              <AccordionContent className="p-0">
                <ScrollArea className="h-64 pl-2">
                  {receivedPending.length === 0 && (
                    <p className="px-4 py-3 text-sm opacity-70">
                      No received requests.
                    </p>
                  )}

                  {receivedPending.map((req) => (
                    <div
                      key={req.id}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b-4 border-[#0d2645] px-4 py-3 w-full"
                    >
                      {/* Avatar */}
                      <Avatar variant="round" size="large">
                        <AvatarImage src={req.requester.avatar_url} />
                        <AvatarFallback>
                          {req.requester.full_name?.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Text */}
                      <div className="min-w-0 overflow-hidden">
                        <p className="truncate font-ui">
                          {req.requester.full_name}
                        </p>
                        <p className="truncate text-sm opacity-70">
                          @{req.requester.username}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => handleAccept(req.requester.id, req.id)}
                        >
                          Accept
                        </Button>
                        <Button size="sm">Reject</Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
