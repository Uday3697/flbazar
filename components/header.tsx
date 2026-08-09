import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/data-store";
import { getPalette } from "@/lib/theme";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#catalogue", label: "Catalogue" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#support", label: "Support" },
];

export async function Header() {
  const settings = await getSiteSettings();
  const palette = getPalette(settings.paletteKey);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/favicon-logo.png"
            alt="Flbaazar logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className={`text-sm uppercase tracking-[0.35em] ${palette.accentText}`}>{settings.brandName}</p>
            <p className="text-xs text-slate-300">{settings.sellerName}</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-3 text-sm text-slate-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-orange-300/60 hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
