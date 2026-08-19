import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { siteCardClass } from "@/lib/site-styles";

const ADMIN_NAME = "Sudip Mandal";
const ADMIN_PHONE = "9064954551";
const ADMIN_PHONE_TEL = "+919064954551";
const WHATSAPP_URL = `https://wa.me/919064954551?text=${encodeURIComponent(
  "Hi, I need help with my account (password / login).",
)}`;

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-md px-6 py-16 lg:px-10">
        <div className={`${siteCardClass} p-8`}>
          <p className="text-xs uppercase tracking-[0.35em] text-orange-600">Account help</p>
          <h1 className="mt-3 text-3xl font-black uppercase text-slate-900">Forgot password?</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Password reset is handled by admin for account-related services. Please contact:
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Admin — {ADMIN_NAME}</p>
            <p className="mt-3">Account related services (login, password, access)</p>
            <p className="mt-4">
              <span className="text-slate-500">Mobile / WhatsApp:</span>
              <br />
              <a href={`tel:${ADMIN_PHONE_TEL}`} className="font-semibold text-orange-600 underline">
                {ADMIN_PHONE}
              </a>
            </p>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Message or call on WhatsApp for password reset and other account help.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              WhatsApp admin
            </a>
            <a
              href={`tel:${ADMIN_PHONE_TEL}`}
              className="inline-flex justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Call {ADMIN_PHONE}
            </a>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
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
