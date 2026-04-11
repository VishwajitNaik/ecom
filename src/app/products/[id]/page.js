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

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ${product.name}. Can you provide more details?`;
    const phoneNumber = '918308383842';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneCall = () => {
    window.open('tel:+91 8308383842');
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
                    onClick={handleWhatsApp}
                    className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-6 rounded-lg transition-colors duration-300 font-medium flex items-center justify-center gap-2"
                    title="Chat on WhatsApp"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.032 2c-5.509 0-9.974 4.486-9.974 10.019 0 2.037.6 3.991 1.741 5.657L2 22l4.204-1.101c1.665.913 3.581 1.444 5.609 1.444 5.509 0 9.974-4.486 9.974-10.019S17.541 2 12.032 2zm5.15 14.295c-.252.688-1.404 1.287-1.95 1.311-.426.018-.96.007-1.398-.222-.359-.185-.805-.435-1.398-.735-2.503-1.074-4.137-3.607-4.264-3.771-.127-.164-1.053-1.407-1.053-2.675 0-1.268.638-1.893.868-2.163.229-.27.495-.337.66-.337.164 0 .33 0 .475.008.143.006.33-.07.515.495.185.565.632 1.955.688 2.097.056.143.094.309.019.474-.075.164-.112.247-.224.38-.112.133-.235.297-.336.396-.112.112-.229.247-.098.478.132.23.594.997 1.274 1.613.873.787 1.614 1.048 1.855 1.157.24.11.384.094.525-.056.141-.15.604-.66.765-.887.161-.228.322-.19.537-.113.214.077 1.36.641 1.594.757.234.116.39.174.447.273.056.099.056.564-.197 1.252z"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button
                    onClick={handlePhoneCall}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
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