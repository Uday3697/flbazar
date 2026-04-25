import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data-store";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.siteTitle,
    description: settings.heroDescription,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-white">{children}</body>
    </html>
  );
}
