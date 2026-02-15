'use client';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { socket } from '@/socket';
import { Field, FieldGroup } from '@/components/ui/field';
import { Textarea } from '@/components/ui/pixelact-ui/textarea';
import { Button } from '@/components/ui/pixelact-ui/button';
import { SendIcon } from 'lucide-react';

const formSchema = z.object({
  message: z.string().trim().nonempty(),
});

export function ChatInputArea() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

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
  );
}
