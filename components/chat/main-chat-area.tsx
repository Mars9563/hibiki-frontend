'use client';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/pixelact-ui/button';
import { z } from 'zod';
import { socket } from '@/socket';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '../ui/scroll-area';
import { Field, FieldGroup } from '../ui/field';
import { SendIcon} from 'lucide-react';
import { MessageBubble } from './messages/message_bubble';
import { Textarea } from '../ui/pixelact-ui/textarea';
import { useRoom } from './room-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/pixelact-ui/avatar';
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi';

const formSchema = z.object({
  message: z.string().trim().nonempty(),
});

const recievedMessage = z.object({
  id: z.string(),
  message: z.string(),
});

export function Chat() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myId, setMyId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<z.infer<typeof recievedMessage>[]>(
    []
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { selectedRoom } = useRoom();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    function onConnect() {
      setMyId(socket.id);
    }

    function onDisconnect() {}

    function onChatMessage(msg: z.infer<typeof recievedMessage>) {
      setMessages((prev) => [...prev, msg]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat message', onChatMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message', onChatMessage);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  function onMessageSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    socket.emit('chat message', data.message);
    form.reset();

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsLoading(false);
  }
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full min-h-0">
      {selectedRoom && (
        <div className="flex flex-row items-center justify-between bg-[#d08159] border-b-4 border-[#0d2645] shadow-[inset_0_-2px_0_#8d697a] p-2">
          <div className="flex flex-row items-center gap-8">
            <Avatar variant="round" size="large">
              <AvatarImage
                src={selectedRoom.otherUser.avatarUrl ?? undefined}
              />
              <AvatarFallback>
                {selectedRoom.otherUser.fullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-ui">
                {selectedRoom.otherUser.fullName}
              </p>
              <p className="truncate text-sm opacity-70 font-ui">
                @{selectedRoom.otherUser.username}
              </p>
            </div>
          </div>
          <Button type="button">
            <PiDotsThreeOutlineVerticalDuotone />
          </Button>
        </div>
      )}
      <div className="overflow-hidden min-h-0">
        <ScrollArea className="relative h-full px-4 bg-[url('/message_background.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-[#203c56]/80 pointer-events-none" />
          <div ref={scrollRef} className="relative flex flex-col gap-4">
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                id={msg.id}
                text={msg.message}
                avatar="https://picsum.photos/200/200"
                mine={msg.id === myId}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      {selectedRoom && (
        <div className="p-4 flex flex-row gap-8 w-full justify-center items-center bg-[#544e68] border-t-4 border-[#0d2645]">
          <form
            onSubmit={form.handleSubmit(onMessageSubmit)}
            id="message_submit_form"
            className="flex-1"
          >
            <FieldGroup>
              <Controller
                name="message"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Textarea
                      {...field}
                      ref={textareaRef}
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onMessageSubmit)();
                        }
                      }}
                      placeholder="Enter Your Message Here"
                      autoComplete="off"
                      className="bg-[#ffecd6] border-2 border-[#0d2645] text-[#0d2645] placeholder:text-[#544e68]"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <Button
            type="submit"
            form="message_submit_form"
            disabled={isLoading}
            className="bg-[#ffaa5e] border-2 border-[#0d2645] hover:bg-[#ffd4a3]"
          >
            <SendIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
