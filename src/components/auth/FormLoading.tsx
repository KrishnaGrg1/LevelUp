import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function FormLoading({ message }: { message?: string }) {
  return (
    <Card className="w-full max-w-2xl mx-auto relative z-10 border-0 shadow-none">
      <CardHeader className="space-y-3 pb-4 pt-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-2 border-gray-900 dark:border-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
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
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-11 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-11 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-11 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"></div>
          </div>

          {/* Button skeleton */}
          <div className="h-11 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
