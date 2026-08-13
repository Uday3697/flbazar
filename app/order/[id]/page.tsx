import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createSupportTicketAction, markDownloadSuccessfulAction } from "@/lib/actions";
import { getOrderById, getProductBySlug, getSiteSettings } from "@/lib/data-store";
import { encryptDownloadToken } from "@/lib/security";
import { siteAlertErrorClass, siteAlertSuccessClass, siteCardClass, siteInputClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";
import { formatPrice } from "@/lib/utils";

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

  const [product, settings] = await Promise.all([getProductBySlug(order.items[0]?.productSlug ?? ""), getSiteSettings()]);

  if (!product) {
    notFound();
  }

  const expiresAt = new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 24;
  const palette = getPalette(settings.paletteKey);
  const token = encryptDownloadToken({
    orderId: order.id,
    productSlug: product.slug,
    expiresAt,
  });

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
            The public file URL stays hidden. The button below uses an encrypted token that is validated server-side
            before redirecting to the protected download.
          </p>
        </div>

        <div className={`mt-8 grid gap-6 ${siteCardClass} p-8 lg:grid-cols-[1fr_auto] lg:items-center`}>
          <div className="space-y-3">
            <p className="text-sm text-slate-500">Order ID: {order.id}</p>
            <p className="text-2xl font-bold text-slate-900">{product.title}</p>
            <p className="text-sm text-slate-600">
              Paid by {order.customerName} for {formatPrice(order.amount)}
            </p>
            <p className="text-sm text-slate-600">Phone: {order.customerPhone}</p>
            <p className="text-sm text-slate-600">Payment ref: {order.paymentReference}</p>
          </div>
          <a
            href={`/api/download?token=${encodeURIComponent(token)}`}
            className={`inline-flex rounded-full px-6 py-3 text-sm font-semibold ${palette.primaryButton}`}
          >
            Download now
          </a>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className={`${siteCardClass} p-8`}>
            <h2 className="text-2xl font-black uppercase text-slate-900">Passwords and access</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className={`text-xs uppercase tracking-[0.3em] ${palette.accentText}`}>Download file password</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {product.downloadPassword || "No password required"}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <p className={`text-xs uppercase tracking-[0.3em] ${palette.accentText}`}>Demo video password</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {product.videoPassword || "No video password set"}
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
              <input type="hidden" name="productSlug" value={product.slug} />
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

        <div className="mt-6">
          <Link href="/" className="text-sm text-orange-600 underline underline-offset-4">
            Return to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
