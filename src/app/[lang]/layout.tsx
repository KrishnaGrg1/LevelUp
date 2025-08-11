import { Toaster } from "sonner";
import { ReactQueryProvider } from "../../components/providers/ReactQueryProvider";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  // Extract lang from params for future use if needed
  await params;
  return (
    <ReactQueryProvider>
      {children}
      <Toaster />
    </ReactQueryProvider>
  );
}
