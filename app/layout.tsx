import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data-store";
import MouseCursor from "@/components/mouse-cursor";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { buildRootMetadata } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    ...buildRootMetadata(settings),
    icons: {
      icon: "/favicon-logo.png",
      apple: "/favicon-logo.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <AuthSessionProvider>
          <MouseCursor />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
