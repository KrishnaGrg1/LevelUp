"use client";

import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages (login, register, etc.) should be accessible to unauthenticated users
  // No authentication check needed here
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
