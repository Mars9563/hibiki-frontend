import Link from 'next/link';

import { RegisterForm } from '@/components/auth/register_form';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#6367FF]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#FFDBFD]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 lg:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Hero */}
          <section className="flex flex-col justify-center text-left">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
                Hibiki
              </span>

              <h1 className="font-ui text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Join Hibiki
              </h1>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Let your words resonate across languages. Create your account
                and start connecting with people around the world.
              </p>

              <div className="mt-8 hidden lg:flex gap-8">
                <div>
                  <h3 className="text-lg font-semibold">Multilingual</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Communicate seamlessly across languages.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Realtime</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Instant conversations and updates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Register Card */}
          <section className="flex items-center justify-center lg:justify-end">
            <Card className="w-full max-w-lg border shadow-2xl">
              <CardHeader className="space-y-2 text-left">
                <CardTitle className="text-2xl font-semibold">
                  Create Account
                </CardTitle>

                <CardDescription>
                  Enter your details below to get started.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <RegisterForm />
              </CardContent>

              <CardFooter className="justify-start text-sm text-muted-foreground">
                Already have an account?
                <Link
                  href="/login"
                  className="ml-1 font-medium text-[#6367FF] hover:underline"
                >
                  Sign in
                </Link>
              </CardFooter>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
