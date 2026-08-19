import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { auth } from "@/lib/auth";
import {
  getOrderItemDownloadToken,
  getOrdersForUser,
  getProductBySlug,
  getSiteSettings,
  getUserById,
} from "@/lib/data-store";
import { getProductDownloadUrls } from "@/lib/product-downloads";
import { siteCardClass } from "@/lib/site-styles";
import { getPalette } from "@/lib/theme";
import { formatOrderDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  const settings = await getSiteSettings();
  const palette = getPalette(settings.paletteKey);
  const orders = await getOrdersForUser(user);

  const paidOrders = orders.filter((order) => order.status === "paid");
  const totalSpent = paidOrders.reduce((sum, order) => sum + order.amount, 0);

  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      const items = await Promise.all(
        order.items.map(async (item) => {
          const product = await getProductBySlug(item.productSlug);
          const urls = product ? getProductDownloadUrls(product) : [];
          const tokens = await Promise.all(
            urls.map((_, index) => getOrderItemDownloadToken(order.id, item.productSlug, index)),
          );
          return { item, product, urls, tokens };
        }),
      );
      return { order, items };
    }),
  );

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-orange-600">My profile</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-slate-900">{user.name}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className={`${siteCardClass} p-6`}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Account details</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Name</dt>
                <dd className="font-semibold text-slate-900">{user.name}</dd>
              </div>
              {user.age ? (
                <div>
                  <dt className="text-slate-500">Age</dt>
                  <dd className="font-semibold text-slate-900">{user.age}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="font-semibold text-slate-900">{user.email || "Not added"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Mobile</dt>
                <dd className="font-semibold text-slate-900">{user.phone || "Not added"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Member since</dt>
                <dd className="font-semibold text-slate-900">{formatOrderDate(user.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${siteCardClass} p-6`}>
              <p className="text-xs uppercase tracking-[0.25em] text-orange-600">Total spent</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{formatPrice(totalSpent)}</p>
            </div>
            <div className={`${siteCardClass} p-6`}>
              <p className="text-xs uppercase tracking-[0.25em] text-orange-600">Orders</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{orders.length}</p>
              <p className="mt-1 text-xs text-slate-500">{paidOrders.length} paid</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black uppercase text-slate-900">Your purchases</h2>
          <p className="mt-2 text-sm text-slate-600">Everything you bought — download links stay here.</p>
        </div>

        {ordersWithDetails.length === 0 ? (
          <div className={`mt-6 ${siteCardClass} p-8 text-sm text-slate-600`}>
            No purchases yet.{" "}
            <Link href="/#catalogue" className="font-semibold text-orange-600 underline">
              Browse catalogue
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {ordersWithDetails.map(({ order, items }) => (
              <div key={order.id} className={`${siteCardClass} p-8`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                      {formatOrderDate(order.createdAt)}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">Order {order.id}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Status: {order.status} · {order.items.map((i) => i.title).join(", ")}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{formatPrice(order.amount)}</p>
                </div>

                <div className="mt-6 space-y-4">
                  {items.map(({ item, product, urls, tokens }) => (
                    <div
                      key={item.productSlug}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{formatPrice(item.price)}</p>
                      {product && urls.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {urls.map((_, index) => (
                            <a
                              key={index}
                              href={`/api/download?token=${encodeURIComponent(tokens[index])}&part=${index}`}
                              className={`rounded-full px-4 py-2 text-xs font-semibold ${palette.primaryButton}`}
                            >
                              {urls.length > 1 ? `Download part ${index + 1}` : "Download"}
                            </a>
                          ))}
                        </div>
                      ) : null}
                      <Link
                        href={`/order/${order.id}`}
                        className="mt-3 inline-block text-sm text-orange-600 underline"
                      >
                        View order details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
