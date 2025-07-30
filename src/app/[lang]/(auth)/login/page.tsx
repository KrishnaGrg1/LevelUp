import { Language } from "@/lib/generated";
import { LoginForm } from "@/components/auth/Login";
interface LoginPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params;
  return <LoginForm lang={lang} />;
}
