import { redirect } from "next/navigation";
import type { Language } from "@/stores/useLanguage";

interface HomePageProps {
    params: Promise<{ lang: string }>;
}

export default async function LangError({ params }: HomePageProps) {
    const { lang } = await params;

    // Valid language codes
    const validLanguages: Language[] = ["eng", "fr", "nep", "arab", "chin", "span"];

    if (!validLanguages.includes(lang as Language)) {
        // If invalid language, redirect to error page with invalid language info
        redirect(`/eng/error?invalid_lang=${encodeURIComponent(lang)}`);
    }

    // If valid language, redirect to home
    redirect(`/${lang}/home`);
}
