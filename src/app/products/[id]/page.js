'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../../../lib/getUser';
import CheckoutModal from '../../../Components/CheckoutModal';
import ReviewsSection from '../../../Components/ReviewsSection';

// Helper functions
const getStockStatus = (stock) => {
  if (stock > 10) return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  if (stock > 0) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
  return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
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

const getExpiryStatus = (days) => {
  if (days > 30) return 'text-green-600';
  if (days > 7) return 'text-orange-500';
  return 'text-red-600';
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

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productRef = useRef(null);
  const imageGalleryRef = useRef(null);

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

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
    if (imageGalleryRef.current) {
      gsap.fromTo(imageGalleryRef.current,
        { scale: 0.95, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
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
        <div className="max-w-7xl mx-auto">

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

          {/* Main Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Product Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              {/* Main Image */}
              <div
                ref={imageGalleryRef}
                className="mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ height: '400px' }}
              >
                <Image
                  src={product.images?.[selectedImageIndex] || 'https://via.placeholder.com/600x400?text=Product'}
                  alt={product.name}
                  width={500}
                  height={400}
                  className="object-contain max-h-full max-w-full"
                />
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
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

                {/* Stock Status Badge */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                  <span className="text-sm text-gray-500">{product.stock || 0} units available</span>
                </div>
              </div>

              {/* Product Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1 text-sm">Manufactured Date</h3>
                    <p className="text-gray-600 text-sm">{formatDate(product.manufacturedDate)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1 text-sm">Expiry Date</h3>
                    <p className="text-gray-600 text-sm">{formatDate(product.expireDate)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1 text-sm">Days Remaining</h3>
                    <p className={`font-bold text-sm ${expiryStatus}`}>{daysRemaining} days</p>
                  </div>
                  {product.category && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1 text-sm">Category</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center space-x-3 max-w-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold transition-colors border border-gray-300"
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
                    className="w-20 px-3 py-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-bold transition-colors border border-gray-300"
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
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.stock || product.stock === 0}
                  className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Additional Features */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewsSection productId={id} />
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