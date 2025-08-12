"use client";

import React from "react";
import { useFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { t } from "@/translations/index";
import LanguageStore from "@/stores/useLanguage";

function TranslatedFormMessage({ className, ...props }: React.ComponentProps<"p">) {
    const { error, formMessageId } = useFormField();
    const { language } = LanguageStore(); // This will trigger re-render when language changes

    // Translate the error message if it exists
    const errorMessage = error?.message ? String(error.message) : "";
    const translatedMessage = errorMessage ? t(errorMessage, errorMessage) : "";

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development' && errorMessage) {
        console.log('TranslatedFormMessage Debug:', {
            originalMessage: errorMessage,
            translatedMessage: translatedMessage,
            currentLanguage: language
        });
    }

    const body = translatedMessage || props.children;

    if (!body) {
        return null;
    }

    return (
        <p
            data-slot="form-message"
            id={formMessageId}
            className={cn("text-destructive text-sm", className)}
            {...props}
        >
            {body}
        </p>
    );
}

export { TranslatedFormMessage };
