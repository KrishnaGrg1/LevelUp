import { redirect } from "next/navigation";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function LangHomePage({ params }: HomePageProps) {
  const { lang } = await params;
  // If no language is found, redirect to the default language (English)
  redirect("/eng/home");

}
