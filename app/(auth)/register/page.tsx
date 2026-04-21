import { RegisterForm } from '@/components/auth/register';
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
        <h1 className="font-ui text-8xl p-2 text-[#C4B5FD]">Join Hibiki!</h1>
        <p className="font-ui text-2xl text-[#F3E8FF]">
          Let your words resonate across languages.
        </p>
      </div>
      <Card className="relative min-w-125 bg-[#1f1f23]">
        <CardHeader>
          <CardTitle className="font-ui text-3xl">Sign Up</CardTitle>
          <CardDescription className="font-ui text-xl">
            Enter your details below to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <div className="w-[60%] h-px bg-[#2e2e33] self-center" />
        <CardFooter className="font-ui text-sm text-[#A1A1AA] justify-center">
          Already have an account?&nbsp;
          <Link href="/login" className="text-[#C4B5FD] hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
