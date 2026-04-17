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

export default function ProductPackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [productPack, setProductPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Fetch product pack data
  useEffect(() => {
    const fetchProductPackData = async () => {
      try {
        const res = await fetch(`/api/productPacks/${id}`);

        if (!res.ok) {
          throw new Error('Product pack not found');
        }

        const packData = await res.json();
        setProductPack(packData);
      } catch (err) {
        console.error('Error fetching product pack:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductPackData();
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

            tl.fromTo('.pack-title',
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.8)" }
            );

            tl.fromTo('.pack-content',
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
    const message = `Hi, I'm interested in ${productPack.productName}. Can you provide more details?`;
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
    if (productPack?.images) {
      setCurrentImageIndex((prev) =>
        prev === productPack.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (productPack?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? productPack.images.length - 1 : prev - 1
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
          <p className="text-gray-600">Loading product pack details...</p>
        </div>
      </div>
    );
  }

  if (error || !productPack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-300 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Pack Not Found</h1>
          <p className="text-gray-600 mb-4">The product pack you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/ProductPacks')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Product Packs
          </button>
        </div>
      </div>
    );
  }

  const allImages = productPack.images || [];
  const daysRemaining = calculateDaysRemaining(productPack.productId?.expireDate);
  const expiryStatus = getExpiryStatus(daysRemaining);
  const totalPrice = ((productPack.priceInRupee * productPack.quantity) - (productPack.discount || 0) + productPack.shippingPrice);

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
            <div className="pack-content">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96 lg:h-[500px]">
                  {allImages.length > 0 ? (
                    <>
                      <Image
                        src={allImages[currentImageIndex]}
                        alt={productPack.productName}
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
                            alt={`${productPack.productName} ${index + 1}`}
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

            {/* Product Pack Information */}
            <div className="pack-content space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="pack-title text-3xl font-bold text-gray-800">
                      {productPack.productName}
                    </h1>
                    <p className="text-sm text-gray-600">Product Pack Bundle</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {(productPack.discount || 0) > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">₹{totalPrice.toFixed(2)}</span>
                      <span className="text-sm text-red-500 line-through">₹{((productPack.priceInRupee * productPack.quantity) + productPack.shippingPrice).toFixed(2)}</span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Save ₹{(productPack.discount || 0).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-green-600">₹{totalPrice.toFixed(2)}</span>
                  )}
                </div>

                {/* Pack Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{productPack.quantity || 1}</div>
                    <div className="text-xs text-gray-600 font-medium">Packs</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{productPack.dayOfDose}</div>
                    <div className="text-xs text-gray-600 font-medium">Days</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">{productPack.usePerDay}</div>
                    <div className="text-xs text-gray-600 font-medium">Use/Day</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-orange-600 mb-1">{productPack.weightInLiter}</div>
                    <div className="text-xs text-gray-600 font-medium">Size</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{productPack.typeOfPack || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Based on:</span>
                    <span className="font-medium">{productPack.productId?.name || 'Unknown Product'}</span>
                  </div>
                  {productPack.productId?.manufacturedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manufactured:</span>
                      <span className="font-medium">{formatDate(productPack.productId.manufacturedDate)}</span>
                    </div>
                  )}
                  {productPack.productId?.expireDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className={`font-medium ${expiryStatus}`}>
                        {formatDate(productPack.productId.expireDate)}
                        {daysRemaining > 0 && ` (${daysRemaining} days left)`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium"
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

              {/* Product Pack Description */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pack Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">What's Included:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>{productPack.quantity || 1} × {productPack.productId?.name || 'Product'} packs</li>
                      <li>{productPack.dayOfDose} days of recommended dosage</li>
                      <li>{productPack.usePerDay} times per day usage</li>
                      <li>{productPack.weightInLiter} size per pack</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Usage Instructions:</h3>
                    <p className="text-gray-600">
                      Take {productPack.usePerDay} times per day for {productPack.dayOfDose} days.
                      Each pack contains {productPack.weightInLiter} of product.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={[{
          productId: productPack,
          quantity: quantity,
          itemType: 'productPack'
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