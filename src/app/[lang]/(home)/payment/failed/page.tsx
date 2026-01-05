'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <XCircle className="h-16 w-16 text-red-500" />
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Payment could not be completed
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your payment was not successful. Please try again or contact support if the problem
              persists.
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
        </CardContent>
      </Card>
    </div>
  );
}
