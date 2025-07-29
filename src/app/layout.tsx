import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "LevelUp - Gamify Your Learning",
  description: "Level up your skills through gamified learning experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <QueryProvider>
          <Toaster position="bottom-right" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
