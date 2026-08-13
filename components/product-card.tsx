import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product, categoryName }: { product: Product; categoryName: string }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className={`h-48 bg-gradient-to-br ${product.accent} p-6`}>
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-orange-200">
              {product.format}
            </span>
            <span className="rounded-full border border-slate-950/20 bg-white/80 px-3 py-1 text-xs text-slate-900">
              {categoryName}
            </span>
          </div>
          <p className="max-w-xs text-3xl font-black uppercase leading-none tracking-[0.08em] text-slate-950">
            {product.title}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <p className="text-sm leading-7 text-slate-600">{product.shortDescription}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {product.downloadPassword ? (
            <span className="rounded-full border border-slate-200 px-3 py-1">Password-protected download</span>
          ) : null}
          {product.videoPassword ? (
            <span className="rounded-full border border-slate-200 px-3 py-1">Video access note included</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</p>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}
