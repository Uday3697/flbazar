import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getUserById } from "@/lib/data-store";
import { auth } from "@/lib/auth";
import { logoutUserAction } from "@/lib/actions";

const seoTags = [
  { label: "Loops", href: "/?category=loops" },
  { label: "Sample Packs", href: "/?category=sample-packs" },
  { label: "FLP Projects", href: "/?category=flp-projects" },
  { label: "EDM Samples", href: "/?category=sample-packs" },
  { label: "VST & Presets", href: "/?category=software" },
];

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#catalogue", label: "Catalogue" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#support", label: "Support" },
];

function getProfileInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }
  return (parts[0]?.slice(0, 2) ?? "U").toUpperCase();
}

export async function Header() {
  const [settings, session] = await Promise.all([getSiteSettings(), auth()]);
  const user = session?.user?.id ? await getUserById(session.user.id) : null;
  const displayName = user?.name || session?.user?.name || "Account";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 shadow-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image
            src="/favicon-logo.png"
            alt={`${settings.brandName} — loops, sample packs, FLP projects, EDM samples`}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-300">{settings.brandName}</p>
            <p className="text-xs text-slate-300">{settings.sellerName}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              {seoTags.map((tag, index) => (
                <span key={tag.label} className="flex items-center gap-1.5">
                  {index > 0 ? <span className="text-slate-600" aria-hidden="true">·</span> : null}
                  <Link
                    href={tag.href}
                    className="text-[10px] uppercase tracking-[0.12em] text-slate-500 transition hover:text-orange-300"
                  >
                    {tag.label}
                  </Link>
                </span>
              ))}
            </p>
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
          {session?.user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 py-1 pl-1 pr-3 transition hover:border-orange-300/60 hover:bg-orange-500/20"
                title="My profile"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-fuchsia-500 to-purple-600 text-xs font-black uppercase text-white shadow-md ring-2 ring-orange-400/30"
                  aria-hidden="true"
                >
                  {getProfileInitials(displayName)}
                </span>
                <span className="max-w-[9rem] truncate font-semibold text-orange-100 sm:max-w-[11rem]">
                  {displayName}
                </span>
              </Link>
              <form action={logoutUserAction}>
                <button
                  type="submit"
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-orange-300/60 hover:bg-white/5"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-orange-300/60 hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-2 transition hover:bg-orange-500/20"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
