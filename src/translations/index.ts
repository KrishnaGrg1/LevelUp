import en from './eng/index';
import fr from './fr/index';
import arab from './arab/index';
import chin from './chin/index';
import nep from './nep/index';
import span from './span/index';
import lang from './lang';
import LanguageStore, { Language } from '@/stores/useLanguage';

const translations = {
	eng: {
		...en,
		lang
	},
	fr: {
		...fr,
		lang
	},
	arab: {
		...arab,
		lang
	},
	chin: {
		...chin,
		lang
	},
	nep: {
		...nep,
		lang
	},
	span: {
		...span,
		lang
	}
};

export const defaultLocale: Language = 'eng';

// Get current language from store
function getCurrentLanguage(): Language {
	if (typeof window !== 'undefined') {
		try {
			return LanguageStore.getState().language;
		} catch {
			return defaultLocale;
		}
	}
	return defaultLocale;
}

// Translation function
export function t(key: string, fallback?: string): string {
	const currentLang = getCurrentLanguage();
	const keys = key.split('.');
	
	let value: any = translations[currentLang];
	
	// Handle namespace:key format (e.g., "success:login")
	if (key.includes(':')) {
		const [namespace, ...restKeys] = key.split(':');
		const actualKey = restKeys.join(':');
		value = (translations[currentLang] as any)?.[namespace];
		
		if (value && actualKey) {
			const nestedKeys = actualKey.split('.');
			for (const nestedKey of nestedKeys) {
				value = value?.[nestedKey];
				if (value === undefined) break;
			}
		}
	} else {
		// Handle dot notation (e.g., "auth.login.title")
		for (const k of keys) {
			value = value?.[k];
			if (value === undefined) break;
		}
	}
	
	return typeof value === 'string' ? value : (fallback || key);
}

// Additional exports for compatibility
export const locale = getCurrentLanguage();
export const locales = Object.keys(translations) as Language[];
export const loading = false;

export function setLocale(newLocale: Language) {
	LanguageStore.getState().setLanguage(newLocale);
}

export { translations };
