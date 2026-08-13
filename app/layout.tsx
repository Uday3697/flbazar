import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data-store";
import MouseCursor from "@/components/mouse-cursor";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.siteTitle,
    description: settings.heroDescription,
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
        <MouseCursor />
        {children}
      </body>
    </html>
  );
}
