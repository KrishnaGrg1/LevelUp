// app/auth/login/page.tsx
// Update the import path and extension if needed
import { LoginForm } from "@/components/auth/Login";
import { Language } from "@/lib/generated";

interface LoginPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params;
  return <LoginForm lang={lang} />;
}
