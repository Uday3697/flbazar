import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import RazorpayCheckoutForm from "@/components/checkout/RazorpayCheckoutForm";
import { getCategories, getProductBySlug, getSiteSettings } from "@/lib/data-store";
import { getPalette } from "@/lib/theme";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, categories, settings] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const category = categories.find((item) => item.slug === product.categorySlug);
  const palette = getPalette(settings.paletteKey);

  return (
    <>
      <Header />
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className={`text-xs uppercase tracking-[0.35em] ${palette.accentText}`}>Checkout</p>
          <h1 className="mt-4 text-4xl font-black uppercase text-white">Complete payment for {product.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Fill in your details and click Pay. A secure Razorpay payment window will open.
          </p>

          <RazorpayCheckoutForm
            productSlug={product.slug}
            productTitle={product.title}
            price={product.price}
            paletteButton={palette.primaryButton}
          />
        </section>

        <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950 p-8">
          <p className={`text-xs uppercase tracking-[0.35em] ${palette.accentText}`}>{category?.name ?? "Product"}</p>
          <h2 className="text-3xl font-black text-white">{product.title}</h2>
          <p className="text-sm leading-7 text-slate-300">{product.shortDescription}</p>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Product price</span>
              <span>{formatPrice(product.price)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Delivery</span>
              <span>Encrypted download</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Download password</span>
              <span>Shown after payment</span>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-lg font-semibold text-white">
              Total: {formatPrice(product.price)}
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-300">
            If payment is deducted but download fails, the buyer can submit a support ticket using phone number and
            order ID. Admin can track the case and mark refunds manually.
          </p>
          <Link href={`/products/${product.slug}`} className="text-sm text-orange-200 underline underline-offset-4">
            Back to product page
          </Link>
        </aside>
      </main>
      <Footer />
    </>
  );
}
