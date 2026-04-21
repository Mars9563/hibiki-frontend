import { LoginForm } from '@/components/auth/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/pixelact-ui/card';
import Link from 'next/link';


export default function RegisterPage() {
  return (
    <div className="relative h-screen flex flex-col justify-center items-center bg-[#19191b]">
      <div className="relative flex flex-col justify-center items-center p-4">
        <h1 className="font-ui text-8xl p-2 text-[#C4B5FD]">Welcome back!</h1>
        <p className="font-ui text-2xl text-[#F3E8FF]">
          Let your words resonate again.
        </p>
      </div>
      <Card className="relative min-w-125 bg-[#1f1f23]">
        <CardHeader>
          <CardTitle className="font-ui text-3xl">Sign In</CardTitle>
          <CardDescription className="font-ui text-xl">
            Enter your credential to start resonating again.
          </CardDescription>
        </CardHeader>

        <CardContent className="">
          {' '}
          <LoginForm />
        </CardContent>
        <CardFooter className="font-ui text-sm text-[#A1A1AA] justify-center">
          Don&apos;t have a account yet?&nbsp;
          <Link href="/register" className="text-[#C4B5FD] hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
