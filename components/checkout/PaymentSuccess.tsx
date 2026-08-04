'use client';

import Link from 'next/link';
import { type DownloadLink } from '@/lib/payment/payment-client';

type PaymentSuccessProps = {
  downloadLinks: DownloadLink[];
};

export default function PaymentSuccess({ downloadLinks }: PaymentSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          ✓ Payment Successful!
        </h1>
        <p className="text-green-700">
          Your download links are ready. They will expire in 30 days.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Downloads</h2>

        {downloadLinks.map((link) => (
          <div key={link.token} className="bg-gray-50 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{link.title}</h3>
            <a
              href={`/api/download?token=${link.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Download Now
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Didn't receive your file?</h3>
        <p className="text-sm text-gray-700 mb-3">
          If you've paid but didn't receive your product, submit a support ticket.
        </p>
        <Link href="/support" className="text-blue-600 hover:underline">
          Create Support Ticket →
        </Link>
      </div>
    </div>
  );
}
