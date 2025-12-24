'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Processing your payment...');
  const { language } = LanguageStore();

  useEffect(() => {
    const pidx = searchParams.get('pidx');
    const purchaseOrderId = searchParams.get('purchase_order_id');

    if (!pidx || !purchaseOrderId) {
      setStatus('failed');
      setMessage('Invalid payment parameters');
      return;
    }

    // The backend already handles verification at /complete-khalti-payment
    // This is just a success display page
    setStatus('success');
    setMessage('Your subscription has been activated successfully!');
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'failed' && 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
              <p className="text-center text-zinc-600 dark:text-zinc-400">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{message}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You can now enjoy all the premium features.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <Button asChild className="flex-1">
                  <Link href={`/${language}/user/profile`}>Go to Profile</Link>
                </Button>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{message}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Please try again or contact support.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <Button asChild className="flex-1">
                  <Link href="/en/user/profile">Try Again</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/en">Home</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
