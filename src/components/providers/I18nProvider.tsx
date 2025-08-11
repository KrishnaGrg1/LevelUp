"use client";

import { ReactNode, useEffect } from "react";
import i18n from "@/lib/i18next";
import LanguageStore from "@/stores/useLanguage";

export default function I18nProvider({ children }: { children: ReactNode }) {
    const { language } = LanguageStore();

    useEffect(() => {
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language]);

    return children as any;
}
