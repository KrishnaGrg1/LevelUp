import { redirect } from "next/navigation";
import type { Language } from "@/stores/useLanguage";
import { VALID_LANGUAGES } from "@/lib/language";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function LangError({ params }: HomePageProps) {
  const { lang } = await params;

  if (!VALID_LANGUAGES.includes(lang as Language)) {
    // If invalid language, redirect to error page with invalid language info
    redirect(`/eng/error?invalid_lang=${encodeURIComponent(lang)}`);
  }

  // If valid language, redirect to home
  redirect(`/${lang}/home`);
}
