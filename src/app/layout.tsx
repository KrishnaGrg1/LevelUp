import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
// import { Toaster } from "sonner";
import { ToastWrapper } from "@/components/ToasterWrapper";

export const metadata: Metadata = {
  title: "LevelUp - Gamify Your Learning",
  description: "Level up your skills through gamified learning experiences",
  icons: {
    icon: [
      {
        url: "/companylogo.jpeg",
        type: "image/png",
      },
      {
        url: "/companylogo.jpeg",
        type: "image/x-icon",
      }
    ],
    apple: "/apple-touch-icon.png",
  },
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
          {/* <Toaster position="bottom-right" /> */}
          <ToastWrapper />
          {children}
        </QueryProvider>
      </body>
    </html >
  );
}
