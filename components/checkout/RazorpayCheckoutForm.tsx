"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentOrder, verifyPayment } from "@/lib/payment/payment-client";
import { siteAlertErrorClass, siteInputClass } from "@/lib/site-styles";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  productSlug: string;
  productTitle: string;
  price: number;
  paletteButton: string;
};

export default function RazorpayCheckoutForm({ productSlug, productTitle, price, paletteButton }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadRazorpayScript = (): Promise<void> =>
    new Promise((resolve) => {
      if (document.getElementById("rzp-script")) return resolve();
      const script = document.createElement("script");
      script.id = "rzp-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderResponse = await createPaymentOrder(
        [{ productSlug, title: productTitle, price }],
        { name: customer.name, email: customer.email, phone: customer.phone },
      );

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: orderResponse.key,
        amount: orderResponse.amountInPaise,
        currency: "INR",
        name: "Flbaazar",
        description: productTitle,
        order_id: orderResponse.razorpayOrderId,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        theme: { color: "#f97316" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled. Try again whenever you're ready.");
          },
        },
        handler: async (response: any) => {
          try {
            await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              orderResponse.orderId,
            );
            router.push(`/order/${orderResponse.orderId}?success=Payment+successful`);
          } catch {
            setError("Payment verification failed. Contact support with your Order ID: " + orderResponse.orderId);
            setLoading(false);
          }
        },
      });

      rzp.on("payment.failed", (response: any) => {
        setError("Payment failed: " + (response.error?.description || "Unknown error. Please try again."));
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm text-slate-700">Full name</span>
        <input
          required
          name="name"
          value={customer.name}
          onChange={handleChange}
          className={siteInputClass}
          placeholder="Your name"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-700">Email address</span>
        <input
          required
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          className={siteInputClass}
          placeholder="you@example.com"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-700">Mobile number</span>
        <input
          required
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          className={siteInputClass}
          placeholder="+91 90000 00000"
        />
      </label>

      {error ? (
        <p className={siteAlertErrorClass}>{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60 ${paletteButton}`}
      >
        {loading ? "Opening payment..." : "Pay now and unlock download"}
      </button>
    </form>
  );
}
