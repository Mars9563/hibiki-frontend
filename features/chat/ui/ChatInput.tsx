'use client';
import { Field, FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/pixelact-ui/button';
import { Textarea } from '@/components/ui/pixelact-ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { useSelectedRoom, useSendMessage } from '@/store/selectors';

const formSchema = z.object({
  message: z.string().trim().nonempty(),
});

export function ChatInput() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const selectedRoom = useSelectedRoom();
  const sendMessage = useSendMessage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  function onMessageSubmit(data: z.infer<typeof formSchema>) {
    if (!selectedRoom) return;

    setIsLoading(true);

    // sendMessage handles both the optimistic local entry AND the
    // socket emit internally now — no manual clientTempId/nanoid,
    // no direct socket import needed in this component.
    sendMessage(data.message, selectedRoom);

    form.reset();

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsLoading(false);
  }

  return (
    <div className="grid grid-cols-[1fr_5%] gap-4 items-center p-3 border-t-4 ">
      <form
        onSubmit={form.handleSubmit(onMessageSubmit)}
        id="message_submit_form"
        className="w-full"
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
                  placeholder="Enter your message..."
                  autoComplete="off"
                  className="max-h-150"
                />
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Button
        type="submit"
        form="message_submit_form"
        disabled={isLoading || !selectedRoom}
        variant="secondary"
      >
        <SendIcon />
      </Button>
    </div>
  );
}
