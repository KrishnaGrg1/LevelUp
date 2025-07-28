import { redirect } from "next/navigation";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function LangHomePage({ params }: HomePageProps) {
  const { lang } = await params;
  // Redirect to login page with the correct language
  redirect(`/${lang}/login`);
}
