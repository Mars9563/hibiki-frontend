'use client';

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const [isLoading, setIsLoading] = useState(false);

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

      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      router.push('/');
    } catch (error) {
      console.error(error);

      toast.error('Login Failed', {
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      id="loginForm"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <Input
              {...field}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11"
            />

            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <Input
              {...field}
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-11"
            />

            {fieldState.error && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full bg-[#6367FF] text-white hover:bg-[#585df0]"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
}
