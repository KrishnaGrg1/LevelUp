import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function FormLoading({ message }: { message?: string }) {
  return (
    <Card className="relative z-10 mx-auto w-full max-w-2xl border-0 shadow-none">
      <CardHeader className="space-y-3 pt-8 pb-4">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-900 dark:border-white">
            <Sparkles className="h-6 w-6 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
          {message || 'Loading...'}
        </CardTitle>

        {/* Subtitle */}
        <CardDescription className="text-center text-gray-500 dark:text-gray-400">
          Please wait while we prepare the form
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        <div className="space-y-4">
          {/* Skeleton loaders matching form fields */}
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-11 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-900"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-11 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-900"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-11 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-900"></div>
          </div>

          {/* Button skeleton */}
          <div className="h-11 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </CardContent>
    </Card>
  );
}
