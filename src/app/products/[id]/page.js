'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../../../lib/getUser';
import CheckoutModal from '../../../Components/CheckoutModal';
import dynamic from 'next/dynamic';

const OtpLogin = dynamic(() => import('../../../Components/OtpLogin'), { ssr: false });

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, detailsRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/productDetails/by-product/${id}`)
        ]);

        if (!productRes.ok) {
          throw new Error('Product not found');
        }

        const productData = await productRes.json();
        setProduct(productData);

        // Product details might not exist, that's okay
        if (detailsRes.ok) {
          const detailsData = await detailsRes.json();
          if (detailsData.success && detailsData.productDetails) {
            setProductDetails(detailsData.productDetails);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Animation effect
  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            const tl = gsap.timeline();

            tl.fromTo('.product-title',
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.8)" }
            );

            tl.fromTo('.product-content',
              { y: 100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.5)" },
              "-=0.4"
            );

            hasAnimatedRef.current = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px 0px' }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  const handleBuyNow = () => {
    const user = getUserFromToken();
    if (user) {
      setShowCheckout(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleAddToCart = async () => {
    try {
      const user = getUserFromToken();
      const guestId = localStorage.getItem('guestId');

      const cartData = {
        productId: product._id,
        quantity: quantity,
        itemType: 'product',
        ...(user ? { userId: user.id } : { guestId })
      };

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Added to cart successfully!');
      } else {
        toast.error(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handlePhoneCall = () => {
    window.open('tel:+91 7447340940');
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    setQuantity(1);
  };

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-300 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-300 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/Products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const allImages = product.images || [];
  const stockStatus = getStockStatus(product.stock || 0);
  const daysRemaining = calculateDaysRemaining(product.expireDate);
  const expiryStatus = getExpiryStatus(daysRemaining);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-300 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images Carousel */}
            <div className="product-content">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96 lg:h-[500px]">
                  {allImages.length > 0 ? (
                    <>
                      <Image
                        src={allImages[currentImageIndex]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />

                      {/* Navigation Arrows */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Image Indicators */}
                      {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {allImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToImage(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {allImages.length > 1 && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="product-content space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="product-title text-3xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{product.stock || 0} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufactured:</span>
                    <span className="font-medium">{formatDate(product.manufacturedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span className={`font-medium ${expiryStatus}`}>
                      {formatDate(product.expireDate)}
                      {daysRemaining > 0 && ` (${daysRemaining} days left)`}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center text-gray-800 gap-4 mb-6">
                  <span className="text-gray-600">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBuyNow}
                    disabled={(!product.stock || product.stock === 0)}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 font-medium"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={(!product.stock || product.stock === 0)}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handlePhoneCall}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium"
                  >
                    Call
                  </button>
                </div>
              </div>

              {/* Product Description */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          {productDetails && (
            <div className="mt-8 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">About This Product</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{productDetails.about}</p>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Product Information</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{productDetails.info}</p>
                </div>
              </div>

              {/* Additional Images */}
              {productDetails.additionalImages && productDetails.additionalImages.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Images</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productDetails.additionalImages.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Additional ${index + 1}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Powered By */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Powered By</h2>
                <p className="text-gray-600">{productDetails.poweredBy}</p>
              </div>

              {/* Professional Opinion */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Opinion</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{productDetails.opinion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={[{
          productId: product,
          quantity: quantity,
          itemType: 'product'
        }]}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* OTP Login Modal */}
      {showLogin && (
        <OtpLogin
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}