'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../../../lib/getUser';
import CheckoutModal from '../../../Components/CheckoutModal';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const productRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product && productRef.current) {
      gsap.fromTo(productRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        toast.error('Product not found');
        router.push('/Products');
      }
    } catch (error) {
      toast.error('Failed to load product');
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
          productId: product._id,
          quantity: parseInt(quantity),
          itemType: 'product',
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

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';

    let date;
    if (dateInput?.$date) {
      date = new Date(dateInput.$date);
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (expireDate) => {
    if (!expireDate) return 0;
    const today = new Date();
    let expiry;
    if (expireDate?.$date) {
      expiry = new Date(expireDate.$date);
    } else if (typeof expireDate === 'string') {
      expiry = new Date(expireDate);
    } else {
      expiry = new Date(expireDate);
    }
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStockStatus = (stock) => {
    if (stock > 10) return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
    if (stock > 0) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  };

  const getExpiryStatus = (days) => {
    if (days > 30) return 'text-green-600';
    if (days > 7) return 'text-orange-500';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
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

  const stockStatus = getStockStatus(product.stock || 0);
  const daysRemaining = calculateDaysRemaining(product.expireDate);
  const expiryStatus = getExpiryStatus(daysRemaining);

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
                  src={product.images?.[0] || 'https://via.placeholder.com/600x400?text=Product'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-green-600">${product.price}</span>
                  {product.discountPrice && (
                    <span className="text-xl text-red-500 line-through">${product.discountPrice}</span>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Manufactured Date</h3>
                  <p className="text-gray-600">{formatDate(product.manufacturedDate)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Expiry Date</h3>
                  <p className="text-gray-600">{formatDate(product.expireDate)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Days Remaining</h3>
                  <p className={`font-bold ${expiryStatus}`}>{daysRemaining} days</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Stock Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>
              </div>

              {/* Category */}
              {product.category && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
                    max={product.stock || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-xl font-bold"
                    disabled={quantity >= (product.stock || 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.stock || product.stock === 0}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
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
        items={[{ productId: product, quantity, itemType: 'product' }]}
        onOrderSuccess={handleOrderSuccess}
      />
    </>
  );
}