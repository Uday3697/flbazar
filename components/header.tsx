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
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-fuchsia-500 to-sky-400 text-sm font-black uppercase tracking-[0.3em] text-slate-950">
            {settings.logoText}
          </div>
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
