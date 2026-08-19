import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getUserById } from "@/lib/data-store";
import { auth } from "@/lib/auth";
import { logoutUserAction } from "@/lib/actions";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#catalogue", label: "Catalogue" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#support", label: "Support" },
];

export async function Header() {
  const [settings, session] = await Promise.all([getSiteSettings(), auth()]);
  const user = session?.user?.id ? await getUserById(session.user.id) : null;
  const displayName = user?.name || session?.user?.name || "Account";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 shadow-md">
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
            <p className="text-sm uppercase tracking-[0.35em] text-orange-300">{settings.brandName}</p>
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
          {session?.user ? (
            <>
              <span className="hidden rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-2 text-orange-200 sm:inline">
                Hi, {displayName.split(" ")[0]}
              </span>
              <Link
                href="/account"
                className="rounded-full border border-orange-400/40 px-4 py-2 transition hover:bg-orange-500/10"
              >
                My profile
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
