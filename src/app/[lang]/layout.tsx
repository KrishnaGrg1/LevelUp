import { Toaster } from "sonner";
import { ReactQueryProvider } from "../../components/providers/ReactQueryProvider";
import { redirect } from "next/navigation";
import { isValidLanguage } from "@/lib/language";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  // Await the params to get the lang parameter
  const { lang } = await params;

  // Validate language and redirect if invalid
  if (!isValidLanguage(lang)) {
    redirect(`/eng/error?invalid_lang=${lang}`);
  }

  return (
    <div className="min-h-screen">
      <ReactQueryProvider>
        {children}
        <Toaster />
      </ReactQueryProvider>
    </div>
  );
}
