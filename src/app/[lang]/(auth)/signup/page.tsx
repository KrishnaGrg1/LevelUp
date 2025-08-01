import { Language } from "@/stores/useLanguage";
import { RegisterForm } from "../../../../components/auth/Register";

// Helper function to validate and normalize language code
const validateLanguage = (lang: string): Language => {
  const validLanguages: Language[] = [
    "eng",
    "nep",
    "fr",
    "arab",
    "chin",
    "span",
  ];
  return validLanguages.includes(lang as Language) ? (lang as Language) : "eng";
};

interface SignupPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { lang } = await params;
  const validatedLang = validateLanguage(lang);
  return <RegisterForm lang={validatedLang} />;
}
