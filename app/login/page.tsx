import Link from "next/link";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LoginForm } from "@/components/auth/login-form";
import { getSiteSettings } from "@/lib/data-store";
import { siteCardClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; callbackUrl?: string }>;
}) {
  const query = await searchParams;
  const settings = await getSiteSettings();
  const palette = getPalette(settings.paletteKey);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-md px-6 py-16 lg:px-10">
        <div className={`${siteCardClass} p-8`}>
          <p className="text-xs uppercase tracking-[0.35em] text-orange-600">Account</p>
          <h1 className="mt-3 text-3xl font-black uppercase text-slate-900">Login</h1>
          <p className="mt-3 text-sm text-slate-600">
            Login with mobile number or email to see your purchases.
          </p>
          {query.success ? (
            <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {query.success}
            </p>
          ) : null}
          <div className="mt-6">
            <Suspense>
              <LoginForm primaryButtonClass={palette.primaryButton} />
            </Suspense>
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            <Link href="/forgot-password" className="font-semibold text-orange-600 underline">
              Forgot password?
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-slate-600">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-orange-600 underline">
              Create account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
