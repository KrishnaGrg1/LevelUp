import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FormLoading({ message }: { message?: string }) {
  return (
    <div className="w-full max-w-md">
      <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
        <CardHeader className="relative space-y-2 text-center pb-4 pt-8">
          <CardTitle className="text-2xl font-black">{message}</CardTitle>
          <CardDescription className="text-slate-400">Loading form...</CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 px-8 pb-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-700/30 rounded-xl"></div>
            <div className="h-12 bg-slate-700/30 rounded-xl"></div>
            <div className="h-12 bg-slate-700/30 rounded-xl"></div>
            <div className="h-12 bg-slate-700/30 rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
