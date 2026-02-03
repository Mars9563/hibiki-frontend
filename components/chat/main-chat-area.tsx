'use client';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/pixelact-ui/button';
import { z } from 'zod';
import { socket } from '@/socket';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '../ui/scroll-area';
import { Field, FieldGroup } from '../ui/field';
import { Input } from '../ui/pixelact-ui/input';
import { SendIcon } from 'lucide-react';
import { MessageBubble } from './messages/message_bubble';

const formSchema = z.object({
  message: z.string().trim().nonempty(),
});

const recievedMessage = z.object({
  id: z.string(),
  message: z.string(),
});

export function Chat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myId, setMyId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<z.infer<typeof recievedMessage>[]>(
    []
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    function onConnect() {
      setMyId(socket.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

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

  function connectAndDisconnect() {
    if (isConnected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  }

  function onMessageSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    socket.emit('chat message', data.message);
    form.reset();
    setIsLoading(false);
  }
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full min-h-0">
      <div className="flex flex-row items-center justify-between border-b-4 border-[#272a3b] bg-[#603336]">
        <p className="font-ui text-l p-4">
          {isConnected ? <>Connected</> : <>Disconnected</>}
        </p>
        <Button type="button" onClick={connectAndDisconnect}>
          {isConnected ? <>disconnect</> : <>connect</>}
        </Button>
      </div>
      <div className="overflow-hidden min-h-0">
        <ScrollArea className="h-full px-4">
          <div ref={scrollRef} className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                id={msg.id}
                text={msg.message}
                avatar=""
                mine={msg.id === myId}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 flex flex-row gap-8 w-full justify-center items-center">
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
                  <Input
                    {...field}
                    placeholder="Enter Your Message Here"
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <Button type="submit" form="message_submit_form" disabled={isLoading}>
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}
