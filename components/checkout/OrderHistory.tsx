'use client';

import { useState } from 'react';
import { fetchOrderHistory } from '@/lib/payment/payment-client';

type Order = {
  id: string;
  items: Array<{ productSlug: string; title: string; price: number; token: string }>;
  createdAt: string;
  amount: number;
};

export default function OrderHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (searchType === 'email') {
        const result = await fetchOrderHistory(searchValue);
        setOrders(result);
      } else {
        const result = await fetchOrderHistory(undefined, searchValue);
        setOrders(result);
      }
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <form onSubmit={handleSearch} className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="email"
              checked={searchType === 'email'}
              onChange={(e) => setSearchType(e.target.value as 'email' | 'phone')}
              className="mr-2"
            />
            Search by Email
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="phone"
              checked={searchType === 'phone'}
              onChange={(e) => setSearchType(e.target.value as 'email' | 'phone')}
              className="mr-2"
            />
            Search by Phone
          </label>
        </div>

        <div className="flex gap-2">
          <input
            type={searchType === 'email' ? 'email' : 'tel'}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchType === 'email' ? 'Enter your email' : 'Enter your phone'}
            required
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {searched && orders.length === 0 && !error && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
          No orders found. Make sure you entered the correct email or phone number.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <p className="font-semibold">₹{(order.amount / 100).toFixed(2)}</p>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.token}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded"
                >
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-600">
                      ₹{(item.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <a
                    href={`/api/download?token=${item.token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
