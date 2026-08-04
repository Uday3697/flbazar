import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { initializeRazorpay } from "@/lib/payment/razorpay";
import { getOrderById, updateOrderStatus, getOrderItemDownloadToken } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      orderId,
    } = body as {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
      orderId: string;
    };

    // Verify Razorpay signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpaySignature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 },
      );
    }

    // Get order from database
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify Razorpay order ID matches
    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json(
        { error: "Order ID mismatch" },
        { status: 400 },
      );
    }

    // Update order status with payment details
    await updateOrderStatus(orderId, {
      status: "paid",
      downloadStatus: "success",
    });

    // Generate download tokens for each product in the order
    const downloadLinks = await Promise.all(
      order.items.map(async (item) => ({
        productSlug: item.productSlug,
        title: item.title,
        token: await getOrderItemDownloadToken(orderId, item.productSlug),
      })),
    );

    return NextResponse.json({
      success: true,
      orderId,
      downloadLinks,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
