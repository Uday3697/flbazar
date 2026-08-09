import Razorpay from "razorpay";

export function initializeRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Missing Razorpay credentials in environment variables");
  }

  return new Razorpay({ key_id, key_secret });
}

export function generateOrderDescription(items: Array<{ title: string; price: number }>) {
  if (items.length === 1) {
    return items[0].title;
  }
  return `${items.length} items: ${items.map((i) => i.title).join(", ")}`;
}
