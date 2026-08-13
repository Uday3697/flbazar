import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import HeroTextRotator from "@/components/hero-text-rotator";
import CategoryFilter from "@/components/category-filter";
import MarqueeTicker from "@/components/marquee-ticker";
import { createSupportTicketAction } from "@/lib/actions";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data-store";
import { siteAlertErrorClass, siteAlertSuccessClass, siteCardClass, siteInputClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; category?: string }>;
}) {
  const query = await searchParams;
  const [categories, products, settings] = await Promise.all([getCategories(), getProducts(), getSiteSettings()]);
  const categoryMap = new Map(categories.map((category) => [category.slug, category.name]));
  const filteredProducts = query.category
    ? products.filter((p) => p.categorySlug === query.category)
    : products;
  const featuredProduct = products[0];
  const palette = getPalette(settings.paletteKey);

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-slate-50">

        {/* Hero Banner */}
        <div className="w-full">
          <Image
            src="/hero-banner.png"
            alt="Flbaazar — Sounds | Loops | Beats | VSTs | Presets"
            width={1920}
            height={480}
            className="w-full object-cover max-h-[340px] md:max-h-[420px]"
            priority
          />
        </div>

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-24">
          <div className="space-y-8">
            <div className={`inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.35em] ${palette.badge}`}>
              {settings.heroBadge}
            </div>

            <HeroTextRotator />

            <div className="flex flex-wrap gap-4">
              <Link
                href="#catalogue"
                className={`rounded-full px-6 py-3 text-sm font-semibold transition hover:scale-[1.02] ${palette.primaryButton}`}
              >
                Explore Products
              </Link>
              <Link
                href="#support"
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${palette.secondaryButton}`}
              >
                Contact Support
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className={`rounded-[1.75rem] border p-5 ${palette.card}`}>
                <p className="text-3xl font-black text-slate-900">{products.length}</p>
                <p className="mt-2 text-sm text-slate-600">Live product listings across your store.</p>
              </div>
              <div className={`rounded-[1.75rem] border p-5 ${palette.card}`}>
                <p className="text-3xl font-black text-slate-900">{categories.length}</p>
                <p className="mt-2 text-sm text-slate-600">Category shelves for every release format.</p>
              </div>
              <div className={`rounded-[1.75rem] border p-5 ${palette.card}`}>
                <p className="text-3xl font-black text-slate-900">24/7</p>
                <p className="mt-2 text-sm text-slate-600">Support tickets for payment, refund, and download issues.</p>
              </div>
            </div>
          </div>

          {featuredProduct ? (
            <div className={`${siteCardClass} p-6 shadow-md`}>
              <div className={`rounded-[1.75rem] bg-gradient-to-br ${featuredProduct.accent} p-8`}>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-950/70">Featured release</p>
                <h2 className="mt-4 text-4xl font-black uppercase leading-none text-slate-950">
                  {featuredProduct.title}
                </h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-slate-950/80">{featuredProduct.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <p className={`text-sm uppercase tracking-[0.3em] ${palette.accentText}`}>
                    {categoryMap.get(featuredProduct.categorySlug)}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{formatPrice(featuredProduct.price)}</p>
                </div>
                <Link
                  href={`/products/${featuredProduct.slug}`}
                  className={`rounded-full px-5 py-3 text-sm font-semibold ${palette.primaryButton}`}
                >
                  Preview & Buy
                </Link>
              </div>
            </div>
          ) : null}
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-8 lg:px-10">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <div key={category.id} className={`${siteCardClass} p-6`}>
                <p className={`text-xs uppercase tracking-[0.35em] ${palette.accentText}`}>{category.name}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="catalogue" className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-xs uppercase tracking-[0.35em] ${palette.accentText}`}>Catalogue</p>
              <h2 className="mt-3 text-4xl font-black uppercase text-slate-900">{settings.catalogueHeading}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{settings.catalogueDescription}</p>
          </div>

          <Suspense>
            <CategoryFilter categories={categories} />
          </Suspense>

          {filteredProducts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No products in this category yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryMap.get(product.categorySlug) ?? "Uncategorized"}
                />
              ))}
            </div>
          )}
        </section>

        <MarqueeTicker />

        <section id="gallery" className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10">
          <div className="mb-8">
            <p className={`text-xs uppercase tracking-[0.35em] ${palette.accentText}`}>Studio Vibes</p>
            <h2 className="mt-3 text-4xl font-black uppercase text-slate-900">Music Production Gallery</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80", alt: "FL Studio DAW" },
              { src: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80", alt: "Piano keys" },
              { src: "https://images.unsplash.com/photo-1571327073757-71d13b9f8a60?auto=format&fit=crop&w=800&q=80", alt: "Drum kit" },
              { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", alt: "Music producer studio" },
              { src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80", alt: "DJ setup" },
              { src: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?auto=format&fit=crop&w=800&q=80", alt: "Audio mixer" },
            ].map((img, index) => (
              <div key={index} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={600}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        <section id="portfolio" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10">
          <div className={`grid gap-8 ${siteCardClass} p-8 lg:grid-cols-[0.9fr_1.1fr]`}>
            <div className="space-y-5">
              <p className={`text-xs uppercase tracking-[0.35em] ${palette.accentText}`}>Portfolio</p>
              <h2 className="text-4xl font-black uppercase text-slate-900">{settings.portfolioHeading}</h2>
              <p className="text-sm leading-7 text-slate-600">{settings.portfolioDescription}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-3xl font-black text-slate-900">120+</p>
                <p className="mt-2 text-sm text-slate-600">Ideas translated into ready-to-use production assets.</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-3xl font-black text-slate-900">{categories.length}</p>
                <p className="mt-2 text-sm text-slate-600">Managed categories and content sections.</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="mt-2 text-sm text-slate-600">Encrypted delivery route after successful checkout.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="support" className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10">
          {query.success ? (
            <p className={`mb-6 ${siteAlertSuccessClass}`}>{query.success}</p>
          ) : null}
          {query.error ? (
            <p className={`mb-6 ${siteAlertErrorClass}`}>{query.error}</p>
          ) : null}
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8 text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-orange-300">Support</p>
              <h2 className="mt-3 text-4xl font-black uppercase">{settings.contactHeading}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{settings.contactDescription}</p>
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                <p>Email: {settings.supportEmail}</p>
                <p>Phone: {settings.supportPhone}</p>
                <p>WhatsApp: {settings.supportWhatsapp}</p>
                <p>Instagram: {settings.supportInstagram}</p>
              </div>
            </div>

            <div className={`${siteCardClass} p-8`}>
              <h3 className="text-2xl font-black uppercase text-slate-900">Payment or download issue form</h3>
              <form action={createSupportTicketAction} className="mt-6 grid gap-4 md:grid-cols-2">
                <input type="hidden" name="orderId" value="" />
                <input type="hidden" name="productSlug" value="" />
                <input type="hidden" name="returnPath" value="/" />
                <input required name="customerName" placeholder="Your name" className={siteInputClass} />
                <input required type="email" name="customerEmail" placeholder="Your email" className={siteInputClass} />
                <input required name="customerPhone" placeholder="Mobile number" className={siteInputClass} />
                <select name="issueType" defaultValue="payment" className={siteInputClass}>
                  <option value="payment">Payment deducted</option>
                  <option value="download">Download failed</option>
                  <option value="refund">Refund request</option>
                  <option value="access">Password/access issue</option>
                  <option value="other">Other issue</option>
                </select>
                <textarea
                  required
                  rows={5}
                  name="message"
                  placeholder="Write what happened. Add order ID or payment reference if available."
                  className={`md:col-span-2 ${siteInputClass}`}
                />
                <div className="md:col-span-2">
                  <button className={`rounded-full px-6 py-3 text-sm font-semibold ${palette.primaryButton}`}>
                    Submit support ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
