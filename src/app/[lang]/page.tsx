import { redirect } from "next/navigation";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function LangHomePage({ params }: HomePageProps) {
  const { lang } = await params;
  // Redirect to home page with the specified language
  redirect(`/${lang}/home`);
}
