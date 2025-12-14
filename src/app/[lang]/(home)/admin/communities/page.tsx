import CommunityManagement from '@/components/admin/CommunityManagement';
import { Language } from '@/stores/useLanguage';

interface CommunitiesPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default async function CommunitiesPage({ params }: CommunitiesPageProps) {
  await params;
  return <CommunityManagement />;
}
