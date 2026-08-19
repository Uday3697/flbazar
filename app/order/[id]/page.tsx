import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createSupportTicketAction, markDownloadSuccessfulAction } from "@/lib/actions";
import {
  getOrderById,
  getOrderItemDownloadToken,
  getProductBySlug,
  getSiteSettings,
} from "@/lib/data-store";
import { getProductDownloadUrls } from "@/lib/product-downloads";
import { siteAlertErrorClass, siteAlertSuccessClass, siteCardClass, siteInputClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";
import { formatOrderDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const settings = await getSiteSettings();
  const palette = getPalette(settings.paletteKey);

  const itemsWithProducts = await Promise.all(
    order.items.map(async (item) => {
      const product = await getProductBySlug(item.productSlug);
      const urls = product ? getProductDownloadUrls(product) : [];
      const tokens = await Promise.all(
        urls.map((_, index) => getOrderItemDownloadToken(order.id, item.productSlug, index)),
      );
      return { item, product, urls, tokens };
    }),
  );

  const primaryProduct = itemsWithProducts[0]?.product;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-10">
        {query.success ? <p className={`mb-6 ${siteAlertSuccessClass}`}>{query.success}</p> : null}
        {query.error ? <p className={`mb-6 ${siteAlertErrorClass}`}>{query.error}</p> : null}

        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Payment successful</p>
          <h1 className="mt-4 text-4xl font-black uppercase text-slate-900">Your download is ready</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Downloads use encrypted tokens validated server-side. Large packs may have multiple parts.
          </p>
        </div>

        <div className={`mt-8 ${siteCardClass} p-8`}>
          <p className="text-sm text-slate-500">Order ID: {order.id}</p>
          <p className="mt-1 text-xs text-slate-500">{formatOrderDate(order.createdAt)}</p>
          <p className="mt-4 text-sm text-slate-600">
            Paid by {order.customerName} for {formatPrice(order.amount)}
          </p>
          <p className="text-sm text-slate-600">Phone: {order.customerPhone}</p>
          <p className="text-sm text-slate-600">Payment ref: {order.paymentReference}</p>

          <div className="mt-8 space-y-6">
            {itemsWithProducts.map(({ item, product, urls, tokens }) => (
              <div key={item.productSlug} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xl font-bold text-slate-900">{item.title}</p>
                {urls.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {urls.map((_, index) => (
                      <a
                        key={index}
                        href={`/api/download?token=${encodeURIComponent(tokens[index])}&part=${index}`}
                        className={`inline-flex rounded-full px-5 py-2.5 text-sm font-semibold ${palette.primaryButton}`}
                      >
                        {urls.length > 1 ? `Download part ${index + 1}` : "Download now"}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No download links configured.</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {primaryProduct ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className={`${siteCardClass} p-8`}>
              <h2 className="text-2xl font-black uppercase text-slate-900">Passwords and access</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <p className={`text-xs uppercase tracking-[0.3em] ${palette.accentText}`}>Download file password</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {primaryProduct.downloadPassword || "No password required"}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <p className={`text-xs uppercase tracking-[0.3em] ${palette.accentText}`}>Demo video password</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {primaryProduct.videoPassword || "No video password set"}
                  </p>
                </div>
              </div>
              <form action={markDownloadSuccessfulAction} className="mt-6">
                <input type="hidden" name="orderId" value={order.id} />
                <button className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  I downloaded successfully
                </button>
              </form>
            </div>

            <div className={`${siteCardClass} p-8`}>
              <h2 className="text-2xl font-black uppercase text-slate-900">Report a problem</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                If payment was successful but the file did not open, access failed, or you need refund help, submit a
                support ticket here.
              </p>
              <form action={createSupportTicketAction} className="mt-6 space-y-4">
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="productSlug" value={primaryProduct.slug} />
                <input type="hidden" name="customerName" value={order.customerName} />
                <input type="hidden" name="customerEmail" value={order.customerEmail} />
                <input type="hidden" name="customerPhone" value={order.customerPhone} />
                <input type="hidden" name="returnPath" value={`/order/${order.id}`} />
                <select name="issueType" defaultValue="download" className={siteInputClass}>
                  <option value="download">Download failed</option>
                  <option value="payment">Payment issue</option>
                  <option value="refund">Refund request</option>
                  <option value="access">Password/access issue</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Explain what happened."
                  className={siteInputClass}
                />
                <button className={`rounded-full px-6 py-3 text-sm font-semibold ${palette.primaryButton}`}>
                  Submit issue
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/account" className="text-sm text-orange-600 underline underline-offset-4">
            View all purchases
          </Link>
          <Link href="/" className="text-sm text-orange-600 underline underline-offset-4">
            Return to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
