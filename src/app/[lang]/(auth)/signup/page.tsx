import { Language } from "@/lib/generated";
import { RegisterForm } from "../../../../components/auth/Register";

interface SignupPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { lang } = await params;
  return <RegisterForm lang={lang} />;
}
