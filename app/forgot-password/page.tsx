import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getSiteSettings } from "@/lib/data-store";
import { siteAlertErrorClass, siteCardClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
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
          <h1 className="mt-3 text-3xl font-black uppercase text-slate-900">Forgot password</h1>
          <p className="mt-3 text-sm text-slate-600">
            Reset your password using your registered email or mobile number.
          </p>
          {query.error ? <p className={`mt-4 ${siteAlertErrorClass}`}>{query.error}</p> : null}
          <div className="mt-6">
            <ForgotPasswordForm primaryButtonClass={palette.primaryButton} />
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-orange-600 underline">
              Back to login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
