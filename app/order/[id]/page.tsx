import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createSupportTicketAction, markDownloadSuccessfulAction } from "@/lib/actions";
import { getOrderById, getProductBySlug, getSiteSettings } from "@/lib/data-store";
import { encryptDownloadToken } from "@/lib/security";
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

  const [product, settings] = await Promise.all([getProductBySlug(order.productSlug), getSiteSettings()]);

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

        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-400/10 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Payment successful</p>
          <h1 className="mt-4 text-4xl font-black uppercase text-white">Your download is ready</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
            The public file URL stays hidden. The button below uses an encrypted token that is validated server-side
            before redirecting to the protected download.
          </p>
        </div>

        <div className="mt-8 grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm text-slate-300">Order ID: {order.id}</p>
            <p className="text-2xl font-bold text-white">{product.title}</p>
            <p className="text-sm text-slate-300">
              Paid by {order.customerName} for {formatPrice(order.amount)}
            </p>
            <p className="text-sm text-slate-300">Phone: {order.customerPhone}</p>
            <p className="text-sm text-slate-300">Payment ref: {order.paymentReference}</p>
          </div>
          <a
            href={`/api/download?token=${encodeURIComponent(token)}`}
            className={`inline-flex rounded-full px-6 py-3 text-sm font-semibold ${palette.primaryButton}`}
          >
            Download now
          </a>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black uppercase text-white">Passwords and access</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="rounded-[1.5rem] bg-slate-950 p-4">
                <p className={`text-xs uppercase tracking-[0.3em] ${palette.accentText}`}>Download file password</p>
                <p className="mt-2 text-lg font-semibold text-white">{product.downloadPassword || "No password required"}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950 p-4">
                <p className={`text-xs uppercase tracking-[0.3em] ${palette.accentText}`}>Demo video password</p>
                <p className="mt-2 text-lg font-semibold text-white">{product.videoPassword || "No video password set"}</p>
              </div>
            </div>
            <form action={markDownloadSuccessfulAction} className="mt-6">
              <input type="hidden" name="orderId" value={order.id} />
              <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white">
                I downloaded successfully
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-black uppercase text-white">Report a problem</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
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
              <select
                name="issueType"
                defaultValue="download"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              >
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
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              />
              <button className={`rounded-full px-6 py-3 text-sm font-semibold ${palette.primaryButton}`}>
                Submit issue
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-sm text-orange-200 underline underline-offset-4">
            Return to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
