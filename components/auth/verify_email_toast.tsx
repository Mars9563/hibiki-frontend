'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function VerifyEmailToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('verify_email') === 'true') {
      toast.info('Verify your email', {
        description:
          'Check your inbox and click the verification link before signing in.',
        duration: 10 * 1000,
      });
    }
  }, [searchParams]);

  return null;
}
