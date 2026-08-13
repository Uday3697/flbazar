import Link from "next/link";
import { Suspense } from "react";
import { AdminDashboard } from "@/components/panel/admin-dashboard";
import { loginAdmin } from "@/lib/actions";
import { getCategories, getOrders, getProducts, getSiteSettings, getSupportTickets } from "@/lib/data-store";
import { isPanelSection, type PanelSection } from "@/lib/panel-nav";
import { isAdminAuthenticated } from "@/lib/security";
import { dashboardBtnPrimaryClass, panelLoginInputClass } from "@/components/panel/panel-styles";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; section?: string }>;
}) {
  const query = await searchParams;
  const initialSection: PanelSection = isPanelSection(query.section ?? "")
    ? (query.section as PanelSection)
    : "dashboard";

  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="panel-dark min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16">
          <Link href="/" className="mb-8 text-sm text-slate-400 transition hover:text-white">← Back to website</Link>
          <p className="text-xs uppercase tracking-[0.35em] text-orange-200">Admin panel</p>
          <h1 className="mt-3 text-3xl font-black uppercase text-white">Sign in to manage your store</h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Hidden dashboard for products, website content, orders, and buyer support.
          </p>

          {query.success ? (
            <p className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {query.success}
            </p>
          ) : null}
          {query.error ? (
            <p className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {query.error}
            </p>
          ) : null}

          <form action={loginAdmin} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-200">Admin password</span>
              <input
                required
                type="password"
                name="password"
                className={panelLoginInputClass}
                placeholder="Enter admin password"
              />
            </label>
            <button type="submit" className={`w-full ${dashboardBtnPrimaryClass}`}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  const [categories, products, settings, orders, tickets] = await Promise.all([
    getCategories(),
    getProducts(),
    getSiteSettings(),
    getOrders(),
    getSupportTickets(),
  ]);

  return (
    <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">
            Loading panel…
          </div>
        }
      >
        <AdminDashboard
          initialSection={initialSection}
          success={query.success}
          error={query.error}
          brandName={settings.brandName}
          categories={categories}
          products={products}
          settings={settings}
          orders={orders}
          tickets={tickets}
        />
      </Suspense>
  );
}
