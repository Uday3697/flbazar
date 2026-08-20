"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { logoutUserAction } from "@/lib/actions";

type NavItem = { href: string; label: string };
type SeoTag = { label: string; href: string };

type HeaderMobileProps = {
  brandName: string;
  sellerName: string;
  seoTags: SeoTag[];
  navItems: NavItem[];
  isLoggedIn: boolean;
  displayName: string;
  profileInitials: string;
};

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden="true">
      <span
        className={`absolute left-0 top-0 block h-0.5 w-6 rounded-full bg-slate-200 transition-all duration-200 ${
          open ? "top-2 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-2 block h-0.5 w-6 rounded-full bg-slate-200 transition-all duration-200 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-4 block h-0.5 w-6 rounded-full bg-slate-200 transition-all duration-200 ${
          open ? "top-2 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function HeaderMobile({
  brandName,
  sellerName,
  seoTags,
  navItems,
  isLoggedIn,
  displayName,
  profileInitials,
}: HeaderMobileProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-200 ${
          isScrolled ? "py-2.5 shadow-lg" : "py-3.5"
        }`}
      >
        <Link href="/" className="shrink-0" onClick={closeMenu}>
          <Image
            src="/favicon-logo.png"
            alt={brandName}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        </Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold uppercase tracking-[0.28em] text-orange-300"
          onClick={closeMenu}
        >
          {brandName}
        </Link>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 transition hover:border-orange-300/60 hover:bg-white/5"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen ?
        <div className="fixed inset-0 z-40 lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={closeMenu}
            aria-label="Close menu"
          />
          <nav
            id="mobile-nav-menu"
            className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 shadow-2xl"
            aria-label="Mobile navigation"
          >
            <div className="border-b border-slate-800 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Store</p>
              <p className="mt-1 text-lg font-semibold text-slate-100">{sellerName}</p>
            </div>

            <div className="flex flex-col gap-1 px-3 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-orange-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-800 px-5 py-4">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Browse</p>
              <div className="flex flex-wrap gap-2">
                {seoTags.map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    onClick={closeMenu}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-slate-400 transition hover:border-orange-300/40 hover:text-orange-200"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-slate-800 px-3 py-4">
              {isLoggedIn ?
                <div className="flex flex-col gap-2">
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-fuchsia-500 to-purple-600 text-xs font-black uppercase text-white">
                      {profileInitials}
                    </span>
                    <span className="truncate font-semibold text-orange-100">{displayName}</span>
                  </Link>
                  <form action={logoutUserAction}>
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-orange-300/60 hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              : <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-slate-200 transition hover:border-orange-300/60 hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="rounded-xl border border-orange-400/40 bg-orange-500/10 px-4 py-3 text-center text-sm font-semibold text-orange-100 transition hover:bg-orange-500/20"
                  >
                    Sign up
                  </Link>
                </div>
              }
            </div>
          </nav>
        </div>
      : null}
    </>
  );
}
