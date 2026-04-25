import { NextRequest, NextResponse } from "next/server";
import { getOrderById, getProductBySlug } from "@/lib/data-store";
import { decryptDownloadToken } from "@/lib/security";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const payload = decryptDownloadToken(token);

    if (payload.expiresAt < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    const [order, product] = await Promise.all([
      getOrderById(payload.orderId),
      getProductBySlug(payload.productSlug),
    ]);

    if (!order || !product) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    if (order.status !== "paid" || order.productSlug !== product.slug) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.redirect(product.downloadUrl);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
