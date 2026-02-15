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
    <div className="relative h-screen flex flex-col justify-center items-center bg-[url('/message_background.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-[#203c56]/80 pointer-events-none" />

      <div className="relative flex flex-col justify-center items-center p-4">
        <h1 className="font-ui text-4xl p-2 text-[#ffecd6] drop-shadow-[2px_2px_0_#0d2b45]">
          Welcome back!
        </h1>
        <p className="font-ui text-[#ffd4a3] text-sm">
          Let your words resonate again.
        </p>
      </div>
      <Card className="relative min-w-[500px] bg-[#ffecd6] border-4 border-[#0d2b45] shadow-[6px_6px_0_#0d2b45]">
        <CardHeader>
          <CardTitle className="font-ui text-[#0d2b45]">Sign In</CardTitle>
          <CardDescription className="text-[#203c56] font-ui text-xs">
            Enter your credential to start resonating again.
          </CardDescription>
        </CardHeader>

        <CardContent className="bg-[#ffecd6]">
          {' '}
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
