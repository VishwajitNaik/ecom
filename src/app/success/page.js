'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

export default function Success() {
  const router = useRouter();
  const [orderType, setOrderType] = useState('order');

  useEffect(() => {
    // Check if this is from a payment or COD order
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'order';
    setOrderType(type);

    // Success animation
    const tl = gsap.timeline();

    tl.fromTo('.success-icon',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
    );

    tl.fromTo('.success-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    tl.fromTo('.success-content',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.2"
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl text-center border border-green-100">
        {/* Success Icon */}
        <div className="success-icon text-green-500 text-7xl mb-6 mx-auto">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Success Title */}
        <h1 className="success-title text-3xl font-bold text-green-600 mb-4">
          {orderType === 'payment' ? 'Payment Successful!' : 'Order Placed Successfully!'}
        </h1>

        {/* Success Message */}
        <div className="success-content space-y-4">
          <p className="text-gray-600 text-lg">
            {orderType === 'payment'
              ? 'Your payment has been processed successfully.'
              : 'Your order has been placed successfully.'
            }
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-medium mb-2">What's Next?</p>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• Order confirmation sent to your email</li>
              <li>• You will receive updates on order status</li>
              <li>• Track your order in My Orders section</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => router.push('/user/orders')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              View My Orders
            </button>
            <button
              onClick={() => router.push('/Products')}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}