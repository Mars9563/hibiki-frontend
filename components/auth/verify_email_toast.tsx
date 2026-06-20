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
      });
    }
  }, [searchParams]);

  return null;
}
