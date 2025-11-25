export default function Success() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Order confirmation has been sent to your email.</p>
          <a
            href="/user/orders"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </a>
        </div>
      </div>
    </div>
  );
}