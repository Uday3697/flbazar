import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCategories, getProductBySlug, getSiteSettings } from "@/lib/data-store";
import { siteCardClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";
import { extractYouTubeId, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, categories, settings] = await Promise.all([getProductBySlug(slug), getCategories(), getSiteSettings()]);

  if (!product) {
    notFound();
  }

  const category = categories.find((item) => item.slug === product.categorySlug);
  const youtubeId = extractYouTubeId(product.youtubeUrl);
  const palette = getPalette(settings.paletteKey);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className={`rounded-[2rem] bg-gradient-to-br ${product.accent} p-8`}>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-950/70">{product.format}</p>
              <h1 className="mt-4 text-5xl font-black uppercase leading-none text-slate-950">{product.title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-950/80">{product.description}</p>
            </div>

            {youtubeId ? (
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={`${product.title} demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
          </section>

          <aside className={`space-y-6 ${siteCardClass} p-8`}>
            <div>
              <p className={`text-xs uppercase tracking-[0.35em] ${palette.accentText}`}>{category?.name ?? "Product"}</p>
              <p className="mt-3 text-4xl font-black text-slate-900">{formatPrice(product.price)}</p>
            </div>
            <p className="text-sm leading-7 text-slate-600">{product.shortDescription}</p>
            <Link
              href={`/checkout/${product.slug}`}
              className={`inline-flex rounded-full px-6 py-3 text-sm font-semibold ${palette.primaryButton}`}
            >
              Buy and unlock download
            </Link>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              Download links are hidden until payment succeeds. The secure order page can also reveal zip, rar, or
              video passwords after purchase.
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
