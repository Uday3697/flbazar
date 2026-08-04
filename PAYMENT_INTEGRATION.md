# Razorpay Payment Integration Guide

## Setup Instructions

### 1. Get Razorpay Credentials

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Go to **Settings → API Keys**
4. Copy your **Key ID** and **Key Secret**

### 2. Update Environment Variables

Update `.env.local` with your credentials:

```
RAZORPAY_KEY_ID=your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
ENCRYPTION_KEY=your-32-character-encryption-key
```

Generate an encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## Flow Diagram

```
User selects products
        ↓
Add to Cart
        ↓
Checkout Form (Customer Info)
        ↓
POST /api/payment/create-order
        ↓
Backend creates local order + Razorpay order
        ↓
Returns: razorpayOrderId, orderId, amount, key
        ↓
Frontend opens Razorpay Modal (Checkout.js)
        ↓
User enters card/UPI details
        ↓
Razorpay processes payment
        ↓
Razorpay returns: payment_id, signature
        ↓
Frontend calls POST /api/payment/verify-payment
        ↓
Backend verifies signature (security!)
        ↓
Backend generates download tokens
        ↓
Frontend shows download links
        ↓
User can download for 30 days
```

## Key Components

### Backend Files

#### `lib/payment/razorpay.ts`
Initializes Razorpay SDK:
```typescript
initializeRazorpay() → Returns configured Razorpay instance
generateOrderDescription(items) → Creates readable order description
```

#### `app/api/payment/create-order/route.ts`
**POST** endpoint - Creates a payment order
- Input: cart items + customer info
- Output: razorpayOrderId, orderId, amount, Razorpay key
- What happens: Creates local order record + Razorpay order

#### `app/api/payment/verify-payment/route.ts`
**POST** endpoint - Verifies payment after user pays
- Input: Razorpay payment details + signature
- Output: Download links for each product
- Security: Verifies Razorpay signature (prevents tampering!)
- Process: Creates encrypted download tokens valid for 30 days

#### `app/api/orders/history/route.ts`
**GET** endpoint - Retrieve past orders
- Query: email or phone
- Output: All orders with active download links
- Used by: "View My Orders" feature

#### `app/api/download/route.ts`
**GET** endpoint - Download file using token
- Query: token
- Output: Redirect to actual file
- Security: Validates token expiration (30 days)

### Frontend Components

#### `components/checkout/CheckoutForm.tsx`
Checkout form with 4 steps:
1. Collect customer name, email, phone
2. Create payment order (backend)
3. Open Razorpay modal
4. Handle payment response

Usage:
```tsx
<CheckoutForm 
  items={cartItems} 
  onSuccess={(downloadLinks) => {
    // Show success page with download links
  }} 
/>
```

#### `components/checkout/PaymentSuccess.tsx`
Shows success page with download links

Usage:
```tsx
<PaymentSuccess downloadLinks={downloadLinks} />
```

#### `components/checkout/OrderHistory.tsx`
Let users find past orders by email or phone

Usage:
```tsx
<OrderHistory />
```

### Frontend Client (`lib/payment/payment-client.ts`)

Three main functions:

```typescript
// 1. Create payment order
const response = await createPaymentOrder(
  cartItems,
  { name: 'John', email: 'john@x.com', phone: '9000012345' }
);
// Returns: { razorpayOrderId, orderId, amount, key, ... }

// 2. Verify payment (after user pays)
const downloadLinks = await verifyPayment(
  paymentId,
  orderId,
  signature,
  orderId
);
// Returns: [{ productSlug, title, token }, ...]

// 3. Fetch order history
const orders = await fetchOrderHistory(email, phone);
// Returns: [{ id, items, createdAt, amount }, ...]
```

## Security

### 1. Payment Verification
- Backend verifies Razorpay signature on every payment
- Prevents attackers from creating fake payments

### 2. Download Token Encryption
- Download links use encrypted tokens (AES-256)
- Token includes order ID + product slug + expiration (30 days)
- Cannot be guessed or forged

### 3. Order Validation
- Download endpoint checks:
  - Token is not expired
  - Product is in the order
  - Order is marked as paid
  - Product exists

## Testing

### Test Cards (Use with Razorpay Test Key)

**Credit Card (Success):**
- Card: 4111111111111111
- Expiry: Any future date (e.g., 12/25)
- CVV: 123
- OTP: 123456

**UPI (Success):**
- Any UPI ID works in test mode

### Test Flow

1. Add products to cart
2. Go to checkout
3. Use test card above
4. Check order created in data/orders.json
5. Verify download tokens are encrypted
6. Test download endpoint with token

## Troubleshooting

### "Missing Razorpay credentials"
- Check `.env.local` has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- Restart dev server: `npm run dev`

### Payment modal doesn't open
- Check browser console for errors
- Verify Razorpay script loaded: `window.Razorpay` exists
- Check RAZORPAY_KEY_ID is valid

### "Payment verification failed"
- Backend didn't receive correct signature
- Possible: Network issue or wrong keys
- Check server logs for detailed error

### Download token expired
- Token valid for 30 days from purchase
- User needs to re-download within 30 days
- Support team can issue new token

## Next Steps

1. **Connect your checkout page:**
   ```tsx
   import CheckoutForm from '@/components/checkout/CheckoutForm';
   
   export default function CheckoutPage({ searchParams }) {
     return <CheckoutForm items={cartItems} />;
   }
   ```

2. **Show order history page:**
   ```tsx
   import OrderHistory from '@/components/checkout/OrderHistory';
   
   export default function OrdersPage() {
     return <OrderHistory />;
   }
   ```

3. **Test in Razorpay sandbox first** (use test keys)

4. **Switch to live keys** when ready for production

## Files Reference

```
Backend:
- lib/payment/razorpay.ts
- lib/payment/payment-client.ts
- app/api/payment/create-order/route.ts
- app/api/payment/verify-payment/route.ts
- app/api/orders/history/route.ts
- app/api/download/route.ts

Frontend Components:
- components/checkout/CheckoutForm.tsx
- components/checkout/PaymentSuccess.tsx
- components/checkout/OrderHistory.tsx

Config:
- .env.local (your secrets)
- .env.example (template)
```
