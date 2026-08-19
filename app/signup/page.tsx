import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SignupForm } from "@/components/auth/signup-form";
import { getSiteSettings } from "@/lib/data-store";
import { siteCardClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const settings = await getSiteSettings();
  const palette = getPalette(settings.paletteKey);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-md px-6 py-16 lg:px-10">
        <div className={`${siteCardClass} p-8`}>
          <p className="text-xs uppercase tracking-[0.35em] text-orange-600">Account</p>
          <h1 className="mt-3 text-3xl font-black uppercase text-slate-900">Sign up</h1>
          <p className="mt-3 text-sm text-slate-600">
            Create an account with mobile or email, then login to track your purchases.
          </p>
          <div className="mt-6">
            <SignupForm primaryButtonClass={palette.primaryButton} />
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-orange-600 underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
