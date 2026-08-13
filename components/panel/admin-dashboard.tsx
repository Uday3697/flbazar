"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createCategoryAction,
  createProductAction,
  logoutAdmin,
  updateGalleryAction,
  updateOrderStatusAction,
  updateTicketStatusAction,
  updateWebsiteDetailsAction,
} from "@/lib/actions";
import { panelSections, type PanelSection } from "@/lib/panel-nav";
import { paletteOptions } from "@/lib/theme";
import type { Category, Order, Product, SiteSettings, SupportTicket } from "@/lib/types";
import {
  dashboardAlertErrorClass,
  dashboardAlertSuccessClass,
  dashboardBtnPrimaryClass,
  dashboardBtnSecondaryClass,
  dashboardCardClass,
  dashboardInputClass,
  dashboardItemClass,
  dashboardStatCardClass,
  panelSidebarBtnSecondaryClass,
} from "@/components/panel/panel-styles";

const accents = [
  "from-fuchsia-500 via-orange-400 to-amber-300",
  "from-cyan-400 via-sky-500 to-indigo-500",
  "from-lime-300 via-emerald-400 to-teal-500",
  "from-rose-400 via-red-500 to-yellow-400",
];

type AdminDashboardProps = {
  initialSection: PanelSection;
  success?: string;
  error?: string;
  brandName: string;
  categories: Category[];
  products: Product[];
  settings: SiteSettings;
  orders: Order[];
  tickets: SupportTicket[];
};

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black uppercase tracking-wide text-slate-900">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className={dashboardStatCardClass}>
      <p className="text-xs uppercase tracking-[0.25em] text-orange-600">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function AdminDashboard({
  initialSection,
  success,
  error,
  brandName,
  categories,
  products,
  settings,
  orders,
  tickets,
}: AdminDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const activeSection: PanelSection =
    panelSections.some((item) => item.id === sectionParam) ? (sectionParam as PanelSection) : initialSection;

  function navigate(section: PanelSection) {
    const query = new URLSearchParams(searchParams.toString());
    query.set("section", section);
    query.delete("success");
    query.delete("error");
    router.push(`/panel?${query.toString()}`, { scroll: false });
  }

  const openTickets = tickets.filter((ticket) => ticket.status === "open").length;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b border-slate-800 bg-slate-950 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="p-5 lg:p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-200">Admin panel</p>
          <p className="mt-2 text-lg font-black uppercase text-white">{brandName}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-0.5 lg:px-4 lg:pb-6">
          {panelSections.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-semibold transition lg:w-full ${
                  active
                    ? "bg-orange-500/15 text-orange-100 ring-1 ring-orange-400/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <Link href="/" className={`block text-center ${panelSidebarBtnSecondaryClass}`}>
            View website
          </Link>
        </div>
      </aside>

      <div className="flex-1 bg-slate-50 p-5 text-slate-900 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current section</p>
            <p className="mt-1 text-xl font-black uppercase text-slate-900">
              {panelSections.find((item) => item.id === activeSection)?.label}
            </p>
          </div>
          <form action={logoutAdmin}>
            <button type="submit" className={dashboardBtnSecondaryClass}>Log out</button>
          </form>
        </div>

        {success ? (
          <p className={`mb-6 ${dashboardAlertSuccessClass}`}>{success}</p>
        ) : null}
        {error ? (
          <p className={`mb-6 ${dashboardAlertErrorClass}`}>{error}</p>
        ) : null}

        {activeSection === "dashboard" ? (
          <div className="space-y-6">
            <SectionHeader
              title="Overview"
              description="Quick snapshot of your store — jump to any section from the sidebar."
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Products" value={products.length} hint="Published on homepage" />
              <StatCard label="Categories" value={categories.length} hint="Product groups" />
              <StatCard label="Orders" value={orders.length} hint="All buyer payments" />
              <StatCard label="Open tickets" value={openTickets} hint="Needs your attention" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className={dashboardCardClass}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Recent orders</h3>
                <div className="mt-4 space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-sm text-slate-500">No orders yet.</p>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <div key={order.id} className={dashboardItemClass}>
                        <p className="text-sm font-medium text-slate-900">
                          {order.items.map((item) => item.title).join(", ")}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {order.customerName} · ₹{order.amount}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className={dashboardCardClass}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Latest products</h3>
                <div className="mt-4 space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className={dashboardItemClass}>
                      <p className="text-sm font-medium text-slate-900">{product.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.format} · ₹{product.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeSection === "website" ? (
          <div className={dashboardCardClass}>
            <SectionHeader
              title="Website details"
              description="Branding, homepage copy, contact info, and color theme. Gallery images are managed separately."
            />
            <form action={updateWebsiteDetailsAction} className="grid gap-4 md:grid-cols-2">
              <input defaultValue={settings.brandName} name="brandName" placeholder="Brand name" className={dashboardInputClass} />
              <input defaultValue={settings.sellerName} name="sellerName" placeholder="Seller name" className={dashboardInputClass} />
              <input defaultValue={settings.logoText} name="logoText" placeholder="Logo text" className={dashboardInputClass} />
              <input defaultValue={settings.siteTitle} name="siteTitle" placeholder="Website title" className={dashboardInputClass} />
              <input defaultValue={settings.heroBadge} name="heroBadge" placeholder="Hero badge" className={`md:col-span-2 ${dashboardInputClass}`} />
              <textarea defaultValue={settings.heroHeading} name="heroHeading" rows={3} placeholder="Hero heading" className={`md:col-span-2 ${dashboardInputClass}`} />
              <textarea defaultValue={settings.heroDescription} name="heroDescription" rows={4} placeholder="Hero description" className={`md:col-span-2 ${dashboardInputClass}`} />
              <input defaultValue={settings.catalogueHeading} name="catalogueHeading" placeholder="Catalogue heading" className={`md:col-span-2 ${dashboardInputClass}`} />
              <textarea defaultValue={settings.catalogueDescription} name="catalogueDescription" rows={3} placeholder="Catalogue description" className={`md:col-span-2 ${dashboardInputClass}`} />
              <input defaultValue={settings.portfolioHeading} name="portfolioHeading" placeholder="Portfolio heading" className={`md:col-span-2 ${dashboardInputClass}`} />
              <textarea defaultValue={settings.portfolioDescription} name="portfolioDescription" rows={4} placeholder="Portfolio description" className={`md:col-span-2 ${dashboardInputClass}`} />
              <input defaultValue={settings.contactHeading} name="contactHeading" placeholder="Contact heading" className={`md:col-span-2 ${dashboardInputClass}`} />
              <textarea defaultValue={settings.contactDescription} name="contactDescription" rows={4} placeholder="Contact description" className={`md:col-span-2 ${dashboardInputClass}`} />
              <input defaultValue={settings.supportEmail} name="supportEmail" placeholder="Support email" className={dashboardInputClass} />
              <input defaultValue={settings.supportPhone} name="supportPhone" placeholder="Support phone" className={dashboardInputClass} />
              <input defaultValue={settings.supportWhatsapp} name="supportWhatsapp" placeholder="WhatsApp number" className={dashboardInputClass} />
              <input defaultValue={settings.supportInstagram} name="supportInstagram" placeholder="Instagram" className={dashboardInputClass} />
              <select name="paletteKey" defaultValue={settings.paletteKey} className={`md:col-span-2 ${dashboardInputClass}`}>
                {paletteOptions.map((palette) => (
                  <option key={palette.key} value={palette.key}>{palette.label}</option>
                ))}
              </select>
              <textarea defaultValue={settings.footerNote} name="footerNote" rows={3} placeholder="Footer note" className={`md:col-span-2 ${dashboardInputClass}`} />
              <div className="md:col-span-2">
                <button type="submit" className={dashboardBtnPrimaryClass}>Save website details</button>
              </div>
            </form>
          </div>
        ) : null}

        {activeSection === "gallery" ? (
          <div className="space-y-6">
            <div className={dashboardCardClass}>
              <SectionHeader
                title="Gallery images"
                description="Homepage gallery section — one image URL per line. Preview updates after you save."
              />
              <form action={updateGalleryAction} className="space-y-4">
                <textarea
                  defaultValue={settings.galleryImages.join("\n")}
                  name="galleryImages"
                  rows={8}
                  placeholder="One image URL per line"
                  className={dashboardInputClass}
                />
                <button type="submit" className={dashboardBtnPrimaryClass}>Save gallery images</button>
              </form>
            </div>
            {settings.galleryImages.length > 0 ? (
              <div className={dashboardCardClass}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Preview</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {settings.galleryImages.map((url) => (
                    <div key={url} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="relative aspect-[4/3]">
                        <Image src={url} alt="Gallery preview" fill className="object-cover" unoptimized />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeSection === "categories" ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
            <div className={dashboardCardClass}>
              <SectionHeader title="Create category" description="Add a new product group for the catalogue." />
              <form action={createCategoryAction} className="space-y-4">
                <input required name="name" placeholder="Category name" className={dashboardInputClass} />
                <input name="slug" placeholder="URL slug (optional)" className={dashboardInputClass} />
                <textarea required name="description" rows={4} placeholder="Category description" className={dashboardInputClass} />
                <button type="submit" className={dashboardBtnPrimaryClass}>Create category</button>
              </form>
            </div>
            <div className={dashboardCardClass}>
              <SectionHeader title="All categories" description={`${categories.length} categories in your store.`} />
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className={dashboardItemClass}>
                    <p className="font-semibold text-slate-900">{category.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-orange-600">{category.slug}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeSection === "products" ? (
          <div className="space-y-6">
            <div className={dashboardCardClass}>
              <SectionHeader title="Publish product" description="New products appear on the homepage catalogue automatically." />
              <form action={createProductAction} className="grid gap-4 md:grid-cols-2">
                <input required name="title" placeholder="Product title" className={dashboardInputClass} />
                <input name="slug" placeholder="URL slug (optional)" className={dashboardInputClass} />
                <select required name="categorySlug" className={dashboardInputClass} defaultValue="">
                  <option value="" disabled>Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>{category.name}</option>
                  ))}
                </select>
                <input required name="format" placeholder="Format: FLP / Sample Pack / Loops" className={dashboardInputClass} />
                <input required type="number" min="1" name="price" placeholder="Price in INR" className={dashboardInputClass} />
                <input name="accent" placeholder={accents[0]} className={dashboardInputClass} />
                <input required name="youtubeUrl" placeholder="YouTube demo URL" className={`md:col-span-2 ${dashboardInputClass}`} />
                <input required name="downloadUrl" placeholder="Protected file URL" className={`md:col-span-2 ${dashboardInputClass}`} />
                <input required name="downloadPassword" placeholder="Download password" className={dashboardInputClass} />
                <input name="videoPassword" placeholder="Video password or note" className={dashboardInputClass} />
                <textarea required rows={3} name="shortDescription" placeholder="Short description" className={`md:col-span-2 ${dashboardInputClass}`} />
                <textarea required rows={5} name="description" placeholder="Full description" className={`md:col-span-2 ${dashboardInputClass}`} />
                <div className="md:col-span-2">
                  <button type="submit" className={dashboardBtnPrimaryClass}>Publish product</button>
                </div>
              </form>
            </div>
            <div className={dashboardCardClass}>
              <SectionHeader title="All products" description={`${products.length} products published.`} />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className={dashboardItemClass}>
                    <p className="font-semibold text-slate-900">{product.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-orange-600">
                      {product.format} · {product.categorySlug}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{product.shortDescription}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">₹{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeSection === "orders" ? (
          <div className={dashboardCardClass}>
            <SectionHeader title="Orders" description="Track payments and download status for every buyer." />
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-sm text-slate-500">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className={dashboardItemClass}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{order.items.map((item) => item.title).join(", ")}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-orange-600">{order.paymentReference}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          {order.customerName} · {order.customerPhone} · {order.customerEmail}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">₹{order.amount}</p>
                      </div>
                    </div>
                    <form action={updateOrderStatusAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select name="status" defaultValue={order.status} className={dashboardInputClass}>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <select name="downloadStatus" defaultValue={order.downloadStatus} className={dashboardInputClass}>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                      </select>
                      <button type="submit" className={dashboardBtnSecondaryClass}>Update</button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}

        {activeSection === "support" ? (
          <div className={dashboardCardClass}>
            <SectionHeader title="Support tickets" description="Buyer issues — payment, download, refund, and access problems." />
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <p className="text-sm text-slate-500">No support tickets yet.</p>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className={dashboardItemClass}>
                    <p className="font-semibold text-slate-900">{ticket.issueType}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-orange-600">
                      {ticket.orderId || "No order ID"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {ticket.customerName} · {ticket.customerPhone}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{ticket.message}</p>
                    <form action={updateTicketStatusAction} className="mt-4 flex flex-wrap items-center gap-3">
                      <input type="hidden" name="ticketId" value={ticket.id} />
                      <select name="status" defaultValue={ticket.status} className={`min-w-[10rem] flex-1 ${dashboardInputClass}`}>
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button type="submit" className={dashboardBtnSecondaryClass}>Save</button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
