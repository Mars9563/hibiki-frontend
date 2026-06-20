import Link from 'next/link';

import { LoginForm } from '@/components/auth/login_form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VerifyEmailToast } from '@/components/auth/verify_email_toast';

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <VerifyEmailToast />
      {/* Background Accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#6367FF]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#FFDBFD]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 lg:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Hero Section */}
          <section className="flex flex-col justify-center text-left">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
                Hibiki
              </span>

              <h1 className="font-ui text-4xl leading-none font-bold tracking-tight md:text-5xl lg:text-6xl">
                Welcome Back
              </h1>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Continue your conversations, reconnect with friends, and stay in
                sync with the people who matter most.
              </p>

              <div className="mt-8 hidden lg:flex gap-8">
                <div>
                  <h3 className="text-lg font-semibold">Secure</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Authentication powered by Supabase.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Realtime</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Instant messaging and updates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Login Card */}
          <section className="flex items-center justify-center lg:justify-end">
            <Card className="w-full max-w-md border shadow-2xl">
              <CardHeader className="space-y-2 text-left">
                <CardTitle className="text-2xl font-semibold">
                  Sign In
                </CardTitle>

                <CardDescription>
                  Enter your email and password to access your account.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <LoginForm />
              </CardContent>

              <CardFooter className="justify-start text-sm text-muted-foreground">
                Don&apos;t have an account?
                <Link
                  href="/register"
                  className="ml-1 font-medium text-[#6367FF] hover:underline"
                >
                  Create one
                </Link>
              </CardFooter>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
