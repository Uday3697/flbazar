import { NextRequest, NextResponse } from "next/server";
import { getOrderByEmailOrPhone, getOrderItemDownloadToken } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const phone = request.nextUrl.searchParams.get("phone");

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone required" },
        { status: 400 },
      );
    }

    const orders = await getOrderByEmailOrPhone(
      email || "",
      phone || "",
    );

    if (orders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Generate download tokens for all items in all orders
    const ordersWithDownloads = await Promise.all(
      orders.map(async (order) => ({
        id: order.id,
        items: await Promise.all(
          order.items.map(async (item) => ({
            productSlug: item.productSlug,
            title: item.title,
            price: item.price,
            token: await getOrderItemDownloadToken(order.id, item.productSlug),
          })),
        ),
        createdAt: order.createdAt,
        amount: order.amount,
      })),
    );

    return NextResponse.json({ orders: ordersWithDownloads });
  } catch (error) {
    console.error("Order history fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 },
    );
  }
}
