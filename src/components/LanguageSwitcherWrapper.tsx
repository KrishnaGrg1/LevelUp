import { LanguageSwitcher } from './LanguageSwitcher';
import LanguageSwitcherLoading from './LanguageSwitcherLoading';
import ClientOnly from './ClientOnly';

interface LanguageSwitcherWrapperProps {
  currentLang?: string;
}

export default function LanguageSwitcherWrapper({ currentLang }: LanguageSwitcherWrapperProps) {
  return (
    <ClientOnly fallback={<LanguageSwitcherLoading />}>
      <LanguageSwitcher currentLang={currentLang} />
    </ClientOnly>
  );
}
