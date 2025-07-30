"use client";

import { Toaster } from "sonner";
import TopBar from "@/components/auth/TopBar";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth pages (login, register, etc.) should be accessible to unauthenticated users
  // No authentication check needed here
  return (
    <>
      <TopBar />
      {children}
      <Toaster />
    </>
  );
}
