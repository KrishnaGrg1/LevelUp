import { Toaster } from "sonner";
import { ReactQueryProvider } from "../../components/providers/ReactQueryProvider";
import { redirect } from "next/navigation";
import type { Language } from "@/stores/useLanguage";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

// Valid language codes
const validLanguages: Language[] = ["eng", "fr", "nep", "arab", "chin", "span"];

// Language validation function
function isValidLanguage(lang: string): lang is Language {
  return validLanguages.includes(lang as Language);
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const { lang } = await params;

  // Validate language parameter
  if (!isValidLanguage(lang)) {
    // For invalid languages, redirect to default language with error message
    redirect(`/eng/error?invalid_lang=${encodeURIComponent(lang)}`);
  }

  return (
    <ReactQueryProvider>
      {children}
      <Toaster />
    </ReactQueryProvider>
  );
}
