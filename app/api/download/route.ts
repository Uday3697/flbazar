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

    // Check token expiration (30 days)
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

    // Verify the product is in the order
    const orderItem = order.items.find((item) => item.productSlug === product.slug);
    if (!orderItem) {
      return NextResponse.json(
        { error: "Product not in this order" },
        { status: 403 },
      );
    }

    // Verify order is paid
    if (order.status !== "paid") {
      return NextResponse.json({ error: "Order not paid" }, { status: 403 });
    }

    return NextResponse.redirect(product.downloadUrl);
  } catch (error) {
    console.error("Download token validation failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
