import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  createCategoryAction,
  createProductAction,
  loginAdmin,
  logoutAdmin,
  updateOrderStatusAction,
  updateSiteSettingsAction,
  updateTicketStatusAction,
} from "@/lib/actions";
import { getCategories, getOrders, getProducts, getSiteSettings, getSupportTickets } from "@/lib/data-store";
import { isAdminAuthenticated } from "@/lib/security";
import { paletteOptions } from "@/lib/theme";

export const dynamic = "force-dynamic";

const accents = [
  "from-fuchsia-500 via-orange-400 to-amber-300",
  "from-cyan-400 via-sky-500 to-indigo-500",
  "from-lime-300 via-emerald-400 to-teal-500",
  "from-rose-400 via-red-500 to-yellow-400",
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const [query, authed, categories, products, settings, orders, tickets] = await Promise.all([
    searchParams,
    isAdminAuthenticated(),
    getCategories(),
    getProducts(),
    getSiteSettings(),
    getOrders(),
    getSupportTickets(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-orange-200">Hidden admin</p>
            <h1 className="mt-3 text-4xl font-black uppercase text-white">Manage website, branding, products, and support</h1>
          </div>
          {authed ? (
            <form action={logoutAdmin}>
              <button className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">
                Log out
              </button>
            </form>
          ) : null}
        </div>

        {query.success ? (
          <p className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {query.success}
          </p>
        ) : null}
        {query.error ? (
          <p className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {query.error}
          </p>
        ) : null}

        {!authed ? (
          <section className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm leading-7 text-slate-300">
              Admin access is intentionally hidden from the public homepage. Use the password below to open the full
              dashboard.
            </p>
            <form action={loginAdmin} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-200">Admin password</span>
                <input
                  required
                  type="password"
                  name="password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  placeholder="Enter admin password"
                />
              </label>
              <button className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
                Login
              </button>
            </form>
            <p className="mt-4 text-xs text-slate-500">
              Default local password: <code>Admin@12345</code>. Change it with <code>ADMIN_PASSWORD</code>.
            </p>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-black uppercase text-white">Create category</h2>
                <form action={createCategoryAction} className="mt-6 space-y-4">
                  <input
                    required
                    name="name"
                    placeholder="Category name"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    name="slug"
                    placeholder="URL name, e.g. my-flp-pack (optional, auto-set from title)"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <textarea
                    required
                    name="description"
                    rows={4}
                    placeholder="Describe this category"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
                    Create category
                  </button>
                </form>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-black uppercase text-white">Publish product</h2>
                <form action={createProductAction} className="mt-6 grid gap-4 md:grid-cols-2">
                  <input
                    required
                    name="title"
                    placeholder="Product title"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    name="slug"
                    placeholder="URL name, e.g. my-flp-pack (optional, auto-set from title)"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <select
                    required
                    name="categorySlug"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    name="format"
                    placeholder="Format: FLP / Sample Pack / Loops / Software"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    type="number"
                    min="1"
                    name="price"
                    placeholder="Price in INR"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    name="accent"
                    placeholder={accents[0]}
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    name="youtubeUrl"
                    placeholder="YouTube demo URL"
                    className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    name="downloadUrl"
                    placeholder="Protected file URL"
                    className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    required
                    name="downloadPassword"
                    placeholder="Zip / rar / download password"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <input
                    name="videoPassword"
                    placeholder="Video password or note"
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <textarea
                    required
                    rows={3}
                    name="shortDescription"
                    placeholder="Short description"
                    className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <textarea
                    required
                    rows={5}
                    name="description"
                    placeholder="Full product description"
                    className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                  />
                  <div className="md:col-span-2">
                    <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
                      Publish product
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black uppercase text-white">Edit website branding and homepage layout</h2>
              <form action={updateSiteSettingsAction} className="mt-6 grid gap-4 md:grid-cols-2">
                <input defaultValue={settings.brandName} name="brandName" placeholder="Brand name" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.sellerName} name="sellerName" placeholder="Seller name" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.logoText} name="logoText" placeholder="Logo text" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.siteTitle} name="siteTitle" placeholder="Website title" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.heroBadge} name="heroBadge" placeholder="Hero badge" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <textarea defaultValue={settings.heroHeading} name="heroHeading" rows={3} placeholder="Hero heading" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <textarea defaultValue={settings.heroDescription} name="heroDescription" rows={4} placeholder="Hero description" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.catalogueHeading} name="catalogueHeading" placeholder="Catalogue heading" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <textarea defaultValue={settings.catalogueDescription} name="catalogueDescription" rows={3} placeholder="Catalogue description" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.portfolioHeading} name="portfolioHeading" placeholder="Portfolio heading" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <textarea defaultValue={settings.portfolioDescription} name="portfolioDescription" rows={4} placeholder="Portfolio description" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.contactHeading} name="contactHeading" placeholder="Contact heading" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <textarea defaultValue={settings.contactDescription} name="contactDescription" rows={4} placeholder="Contact description" className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.supportEmail} name="supportEmail" placeholder="Support email" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.supportPhone} name="supportPhone" placeholder="Support phone" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.supportWhatsapp} name="supportWhatsapp" placeholder="WhatsApp number" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <input defaultValue={settings.supportInstagram} name="supportInstagram" placeholder="Instagram" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" />
                <select name="paletteKey" defaultValue={settings.paletteKey} className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
                  {paletteOptions.map((palette) => (
                    <option key={palette.key} value={palette.key}>
                      {palette.label}
                    </option>
                  ))}
                </select>
                <textarea
                  defaultValue={settings.galleryImages.join("\n")}
                  name="galleryImages"
                  rows={5}
                  placeholder="One image URL per line"
                  className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
                <textarea
                  defaultValue={settings.footerNote}
                  name="footerNote"
                  rows={3}
                  placeholder="Footer note"
                  className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
                <div className="md:col-span-2">
                  <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
                    Save website settings
                  </button>
                </div>
              </form>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 xl:col-span-1">
                <h2 className="text-2xl font-black uppercase text-white">Current categories</h2>
                <div className="mt-5 space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="rounded-[1.5rem] bg-slate-950 p-4">
                      <p className="text-sm font-semibold text-white">{category.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-orange-200">{category.slug}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 xl:col-span-1">
                <h2 className="text-2xl font-black uppercase text-white">Recent orders</h2>
                <div className="mt-5 space-y-4">
                  {orders.length === 0 ? <p className="text-sm text-slate-400">No orders yet.</p> : null}
                  {orders.slice(0, 8).map((order) => (
                    <div key={order.id} className="rounded-[1.5rem] bg-slate-950 p-4">
                      <p className="text-sm font-semibold text-white">{order.productSlug}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-orange-200">{order.paymentReference}</p>
                      <p className="mt-2 text-sm text-slate-400">{order.customerName} • {order.customerPhone}</p>
                      <form action={updateOrderStatusAction} className="mt-4 grid gap-3">
                        <input type="hidden" name="orderId" value={order.id} />
                        <select name="status" defaultValue={order.status} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        <select name="downloadStatus" defaultValue={order.downloadStatus} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="failed">Failed</option>
                        </select>
                        <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">
                          Update order
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 xl:col-span-1">
                <h2 className="text-2xl font-black uppercase text-white">Buyer issues</h2>
                <div className="mt-5 space-y-4">
                  {tickets.length === 0 ? <p className="text-sm text-slate-400">No support tickets yet.</p> : null}
                  {tickets.slice(0, 8).map((ticket) => (
                    <div key={ticket.id} className="rounded-[1.5rem] bg-slate-950 p-4">
                      <p className="text-sm font-semibold text-white">{ticket.issueType}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-orange-200">{ticket.orderId || "No order ID"}</p>
                      <p className="mt-2 text-sm text-slate-400">
                        {ticket.customerName} • {ticket.customerPhone}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{ticket.message}</p>
                      <form action={updateTicketStatusAction} className="mt-4 flex items-center gap-3">
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <select name="status" defaultValue={ticket.status} className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                          <option value="open">Open</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">
                          Save
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black uppercase text-white">Recently published products</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="rounded-[1.5rem] bg-slate-950 p-4">
                    <p className="text-sm font-semibold text-white">{product.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-orange-200">
                      {product.format} • {product.categorySlug}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{product.shortDescription}</p>
                    <p className="mt-2 text-xs text-slate-500">File password: {product.downloadPassword}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
