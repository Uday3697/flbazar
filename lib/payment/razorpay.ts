import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Missing Razorpay credentials in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export function initializeRazorpay() {
  return razorpay;
}

export function generateOrderDescription(items: Array<{ title: string; price: number }>) {
  if (items.length === 1) {
    return items[0].title;
  }
  return `${items.length} items: ${items.map((i) => i.title).join(", ")}`;
}
