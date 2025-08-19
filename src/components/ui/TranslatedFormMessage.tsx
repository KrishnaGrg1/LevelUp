"use client";

import React from "react";
import { useFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { t } from "@/translations/index";

function TranslatedFormMessage({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();

  // Translate the error message if it exists
  const errorMessage = error?.message ? String(error.message) : "";
  const translatedMessage = errorMessage ? t(errorMessage, errorMessage) : "";

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
