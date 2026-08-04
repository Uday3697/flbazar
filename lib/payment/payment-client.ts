export type CartItem = {
  productSlug: string;
  title: string;
  price: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type PaymentOrderResponse = {
  razorpayOrderId: string;
  orderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  key: string;
};

export type DownloadLink = {
  productSlug: string;
  title: string;
  token: string;
};

export async function createPaymentOrder(
  items: CartItem[],
  customer: Customer,
): Promise<PaymentOrderResponse> {
  const response = await fetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create payment order");
  }

  return response.json();
}

export async function verifyPayment(
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,
  orderId: string,
): Promise<DownloadLink[]> {
  const response = await fetch("/api/payment/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      orderId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Payment verification failed");
  }

  const result = await response.json();
  return result.downloadLinks;
}

export async function fetchOrderHistory(
  email?: string,
  phone?: string,
): Promise<
  Array<{
    id: string;
    items: Array<{ productSlug: string; title: string; price: number; token: string }>;
    createdAt: string;
    amount: number;
  }>
> {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (phone) params.append("phone", phone);

  const response = await fetch(`/api/orders/history?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch order history");
  }

  const result = await response.json();
  return result.orders;
}
