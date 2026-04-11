
'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { getUserFromToken, getGuestId } from '../lib/getUser';
import dynamic from 'next/dynamic';

const Product = ({ product, index, onBuyNow }) => {
  const router = useRouter();
  const isProductPack = product.itemType === 'productPack';
  const [isMobileView, setIsMobileView] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const productRef = useRef(null);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (productRef.current) {
      gsap.fromTo(productRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: index * 0.05,
          ease: "back.out(1.5)"
        }
      );
    }
  }, [index]);



  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const message = `Hi, I'm interested in ${isProductPack ? product.productName : product.name}. Can you provide more details?`;
    const phoneNumber = '918308383842'; // Same as in Footer
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    // Just call onBuyNow - authentication is handled by parent component
    onBuyNow(product, quantity);
  };

  const handlePhoneCall = (e) => {
    e.stopPropagation();
    window.open('tel:+91 8308383842');
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

  const stockStatus = getStockStatus(product.stock || 0);
  const daysRemaining = calculateDaysRemaining(product.expireDate);
  const expiryStatus = getExpiryStatus(daysRemaining);

  const handleCardClick = () => {
    if (isProductPack) {
      router.push(`/productPacks/${product._id}`);
    } else {
      router.push(`/products/${product._id}`);
    }
  };

  return (
    <>
      {/* Product Card */}
      <div
        ref={productRef}
        className="w-full hover:shadow-gray-600 rounded-xl shadow-md border border-gray-200
        hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer
        lg:flex-shrink-0 lg:w-80"
        style={{ opacity: 0 }}
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="h-32 lg:h-48 overflow-hidden">
          <Image
            src={
              isProductPack
                ? (product.productId?.images?.[0] || 'https://via.placeholder.com/300x150?text=Pack')
                : (product.images?.[0] || 'https://via.placeholder.com/300x150?text=Product')
            }
            alt={isProductPack ? product.productName : product.name}
            width={300}
            height={150}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Product Details */}
        <div className="p-3 lg:p-4">
          <h3 className="text-sm lg:text-lg font-bold text-gray-800 mb-1 lg:mb-2 line-clamp-1">
            {isProductPack ? product.productName : product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-2">
            {isProductPack ? (
              <>
                {(product.discount || 0) > 0 ? (
                  <>
                    <span className="text-base lg:text-xl font-bold text-green-600">
                      ₹{((product.priceInRupee * product.quantity) - (product.discount || 0) + product.shippingPrice).toFixed(2)}
                    </span>
                    <span className="text-xs text-red-500 line-through hidden lg:inline">
                      ₹{(product.priceInRupee * product.quantity + product.shippingPrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-base lg:text-xl font-bold text-green-600">
                    ₹{((product.priceInRupee * product.quantity) + product.shippingPrice).toFixed(2)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-base lg:text-xl font-bold text-green-600">₹{product.price}</span>
            )}
          </div>

          {/* Date Information - For individual products */}
          {!isProductPack && (
            <div className="space-y-1 mb-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Mfg:</span>
                <span className="text-gray-700 font-medium">
                  {formatDate(product.manufacturedDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exp:</span>
                <span className="text-gray-700 font-medium">
                  {formatDate(product.expireDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Days:</span>
                <span className={`font-bold ${expiryStatus}`}>
                  {daysRemaining}d
                </span>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isProductPack 
                ? 'bg-blue-100 text-blue-800'
                : stockStatus.color
            }`}>
              {isProductPack ? 'Pack Available' : stockStatus.text}
            </span>
            <span className="text-xs text-gray-500">
              {isProductPack ? `${product.quantity} units` : `${product.stock || 0}u`}
            </span>
          </div>

          {/* Quantity Selector - Only for individual products */}
          {!isProductPack && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                <label className="text-xs text-gray-600">Qty:</label>
                <div className="flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-l flex items-center justify-center text-xs font-bold"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 1}
                    value={quantity}
                    onChange={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1));
                    }}
                    className="w-8 px-1 py-1 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.min(product.stock || 1, quantity + 1));
                    }}
                    className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-r flex items-center justify-center text-xs font-bold"
                    disabled={quantity >= (product.stock || 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-2 px-2 rounded-lg
                transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
              title="Chat on WhatsApp"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.032 2c-5.509 0-9.974 4.486-9.974 10.019 0 2.037.6 3.991 1.741 5.657L2 22l4.204-1.101c1.665.913 3.581 1.444 5.609 1.444 5.509 0 9.974-4.486 9.974-10.019S17.541 2 12.032 2zm5.15 14.295c-.252.688-1.404 1.287-1.95 1.311-.426.018-.96.007-1.398-.222-.359-.185-.805-.435-1.398-.735-2.503-1.074-4.137-3.607-4.264-3.771-.127-.164-1.053-1.407-1.053-2.675 0-1.268.638-1.893.868-2.163.229-.27.495-.337.66-.337.164 0 .33 0 .475.008.143.006.33-.07.515.495.185.565.632 1.955.688 2.097.056.143.094.309.019.474-.075.164-.112.247-.224.38-.112.133-.235.297-.336.396-.112.112-.229.247-.098.478.132.23.594.997 1.274 1.613.873.787 1.614 1.048 1.855 1.157.24.11.384.094.525-.056.141-.15.604-.66.765-.887.161-.228.322-.19.537-.113.214.077 1.36.641 1.594.757.234.116.39.174.447.273.056.099.056.564-.197 1.252z"/>
              </svg>
            </button>
            {/* Phone Call Button */}
            <button
              onClick={handlePhoneCall}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-2 rounded-lg
                transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
              title="Call for Details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            {/* Buy Now Button - This will trigger login if needed */}
            <button
              onClick={handleBuyNow}
              disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
              className="flex-1 bg-green-600 text-white py-2 px-2 rounded-lg
                hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
              title="Buy Now"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden lg:inline">Buy</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
