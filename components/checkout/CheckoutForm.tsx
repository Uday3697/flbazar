'use client';

import { useState } from 'react';
import {
  createPaymentOrder,
  verifyPayment,
  type CartItem,
  type Customer,
} from '@/lib/payment/payment-client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CheckoutFormProps = {
  items: CartItem[];
  onSuccess?: (downloadLinks: any) => void;
};

export default function CheckoutForm({ items, onSuccess }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
  });

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment order
      const orderResponse = await createPaymentOrder(items, customer);
      const { razorpayOrderId, orderId, amountInPaise, key } = orderResponse;

      // Step 2: Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        // Step 3: Open Razorpay payment modal
        const options = {
          key, // Razorpay Key ID
          amount: amountInPaise,
          currency: 'INR',
          name: 'Flbazar',
          description: `Purchase ${items.length} product(s)`,
          order_id: razorpayOrderId,
          handler: async (response: any) => {
            try {
              // Step 4: Verify payment on backend
              const downloadLinks = await verifyPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature,
                orderId,
              );

              // Success!
              console.log('Payment successful!', downloadLinks);
              onSuccess?.(downloadLinks);
            } catch (err: any) {
              setError(err.message || 'Payment verification failed');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (err: any) {
      setError(err.message || 'Failed to create payment order');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={customer.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={customer.email}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={customer.phone}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-sm">
          <strong>Total Amount:</strong> ₹{(totalAmount / 100).toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          {items.length} product(s)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ₹${(totalAmount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}
