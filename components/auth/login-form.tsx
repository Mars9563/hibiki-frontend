'use client';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { z } from 'zod';
import { Input } from '@/components/ui/pixelact-ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/pixelact-ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  password: z
    .string()
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
      'Password must be at least 8 characters and include at least one letter and one number.'
    ),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(formData: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      router.push('/');
    } catch (error) {
        
      console.log(error);

      toast.error('Login Failed!', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-6"
        id="loginForm"
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="example@example.com"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="********"
                  autoComplete=""
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <div className="flex justify-end items-center">
        <Button
          disabled={isLoading}
          type="submit"
          form="loginForm"
          className="bg-[#ffa55e] text-[#0d2b45] border-2 border-[#0d2b45] shadow-[3px_3px_0_#0d2b45] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#0d2b45]"
        >
          Sign In
        </Button>
      </div>
    </>
  );
}
