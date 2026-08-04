import { NextRequest, NextResponse } from "next/server";
import { initializeRazorpay, generateOrderDescription } from "@/lib/payment/razorpay";
import { createOrderWithItems } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
    } = body as {
      items: Array<{ productSlug: string; title: string; price: number }>;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
    };

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 },
      );
    }

    // Calculate total amount in paise (Razorpay uses paise, 1 rupee = 100 paise)
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    const razorpay = initializeRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order-${Date.now()}`,
      notes: {
        customerName,
        customerEmail,
        customerPhone,
      },
    } as any);

    // Create local order record
    const order = await createOrderWithItems({
      items,
      customerName,
      customerEmail,
      customerPhone,
      amount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      orderId: order.id,
      amount: totalAmount,
      amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
