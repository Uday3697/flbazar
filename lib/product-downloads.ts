import type { Product } from "@/lib/types";

export function getProductDownloadUrls(product: Product): string[] {
  const extra = product.downloadUrls?.map((url) => url.trim()).filter(Boolean) ?? [];
  if (extra.length > 0) return extra;
  const primary = product.downloadUrl?.trim();
  return primary ? [primary] : [];
}
