'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../../../lib/getUser';
import CheckoutModal from '../../../Components/CheckoutModal';

export default function ProductPackDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [productPack, setProductPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const productRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchProductPack();
    }
  }, [id]);

  useEffect(() => {
    if (productPack && productRef.current) {
      gsap.fromTo(productRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [productPack]);

  const fetchProductPack = async () => {
    try {
      const res = await fetch(`/api/productPacks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProductPack(data);
      } else {
        toast.error('Product pack not found');
        router.push('/Products');
      }
    } catch (error) {
      toast.error('Failed to load product pack');
      router.push('/Products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const user = getUserFromToken();
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: productPack._id,
          quantity: parseInt(quantity),
          itemType: 'productPack',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    const user = getUserFromToken();
    if (!user) {
      toast.error('Please login to buy now');
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product pack...</p>
        </div>
      </div>
    );
  }

  if (!productPack) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Pack Not Found</h1>
          <button
            onClick={() => router.push('/Products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={productRef} className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-96 lg:h-[500px] relative">
                <Image
                  src={productPack.productId?.images?.[0] || 'https://via.placeholder.com/600x400?text=Pack'}
                  alt={productPack.productName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Pack Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{productPack.productName}</h1>
                <p className="text-blue-600 font-medium mb-4">
                  {productPack.quantity} × {productPack.weightInLiter} | {productPack.dayOfDose} days supply
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {productPack.productId?.description || 'Product pack'} - {productPack.productName} contains {productPack.quantity} × {productPack.weightInLiter} for {productPack.dayOfDose} days supply.
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-green-600">
                    ₹{productPack.totalPrice?.toFixed(2) || ((productPack.priceInRupee * productPack.quantity) - (productPack.discount || 0) + productPack.shippingPrice).toFixed(2)}
                  </span>
                  {(productPack.discount || 0) > 0 && (
                    <span className="text-xl text-red-500 line-through">
                      ₹{(productPack.priceInRupee * productPack.quantity + productPack.shippingPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span>₹{productPack.priceInRupee.toFixed(2)} × {productPack.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{productPack.shippingPrice.toFixed(2)}</span>
                  </div>
                  {(productPack.discount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{(productPack.discount || 0).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pack Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Pack Size</h3>
                  <p className="text-gray-600">{productPack.quantity} × {productPack.weightInLiter}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Duration</h3>
                  <p className="text-gray-600">{productPack.dayOfDose} days</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Usage</h3>
                  <p className="text-gray-600">{productPack.usePerDay}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Pack Type</h3>
                  <p className="text-gray-600 capitalize">{productPack.typeOfPack}</p>
                </div>
              </div>

              {/* Savings */}
              {(productPack.discount || 0) > 0 && (
                <div className="mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-semibold">Savings</span>
                      <span className="text-green-600 font-bold text-lg">
                        ₹{(productPack.discount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category */}
              {productPack.productId?.category && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {productPack.productId.category}
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pack Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-xl font-bold"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={[{ productId: productPack, quantity, itemType: 'productPack' }]}
        onOrderSuccess={handleOrderSuccess}
      />
    </>
  );
}