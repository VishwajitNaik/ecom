// 'use client';

// import Image from 'next/image';
// import { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { gsap } from 'gsap';
// import toast from 'react-hot-toast';
// import { getUserFromToken } from '../lib/getUser';
// import CheckoutModal from './CheckoutModal';

// const Product = ({ product, index }) => {
//   const router = useRouter();
//   const isProductPack = product.itemType === 'productPack';

//   const [quantity, setQuantity] = useState(1);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const productRef = useRef(null);

//   useEffect(() => {
//     if (productRef.current) {
//       gsap.fromTo(productRef.current,
//         {
//           opacity: 0,
//           y: 30,
//           scale: 0.9
//         },
//         {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//           duration: 0.5,
//           delay: index * 0.05,
//           ease: "back.out(1.5)"
//         }
//       );
//     }
//   }, [index]);

//   const handleAddToCart = async (e) => {
//     e.stopPropagation();
//     const user = getUserFromToken();
//     if (!user) {
//       toast.error('Please login to add to cart');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/cart', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId: user.id,
//           productId: product._id,
//           quantity: parseInt(quantity),
//           itemType: isProductPack ? 'productPack' : 'product',
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(data.message);
//         gsap.fromTo(productRef.current,
//           { scale: 1 },
//           {
//             scale: 1.05,
//             duration: 0.2,
//             yoyo: true,
//             repeat: 1,
//             ease: "power2.inOut"
//           }
//         );
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       console.error('Cart fetch error:', error);
//       toast.error('Failed to add to cart');
//     }
//   };

//   const handleBuyNow = (e) => {
//     e.stopPropagation();
//     const user = getUserFromToken();
//     if (!user) {
//       toast.error('Please login to buy now');
//       return;
//     }
//     setShowCheckout(true);
//   };

//   const handlePhoneCall = (e) => {
//     e.stopPropagation();
//     // You can replace this with your actual phone number
//     window.open('tel:+91 7447340940');
//   };

//   const handleOrderSuccess = () => {
//     setShowCheckout(false);
//   };

//   const formatDate = (dateInput) => {
//     if (!dateInput) return 'N/A';
//     let date;
//     if (dateInput?.$date) {
//       date = new Date(dateInput.$date);
//     } else if (typeof dateInput === 'string') {
//       date = new Date(dateInput);
//     } else {
//       date = new Date(dateInput);
//     }
//     if (isNaN(date.getTime())) return 'N/A';
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const calculateDaysRemaining = (expireDate) => {
//     if (!expireDate) return 0;
//     const today = new Date();
//     let expiry;
//     if (expireDate?.$date) {
//       expiry = new Date(expireDate.$date);
//     } else if (typeof expireDate === 'string') {
//       expiry = new Date(expireDate);
//     } else {
//       expiry = new Date(expireDate);
//     }
//     const diffTime = expiry - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 0;
//   };

//   const getStockStatus = (stock) => {
//     if (stock > 10) return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
//     if (stock > 0) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
//     return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
//   };

//   const getExpiryStatus = (days) => {
//     if (days > 30) return 'text-green-600';
//     if (days > 7) return 'text-orange-500';
//     return 'text-red-600';
//   };

//   const stockStatus = getStockStatus(product.stock || 0);
//   const daysRemaining = calculateDaysRemaining(product.expireDate);
//   const expiryStatus = getExpiryStatus(daysRemaining);

//   return (
//     <>
//       {/* Mobile Card - 4 cards per row */}
//       <div
//         ref={productRef}
//         className="w-full bg-white rounded-xl shadow-md border border-gray-200
//         hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer
//         lg:flex-shrink-0 lg:w-80"
//         style={{ opacity: 0 }}
//         onClick={() => {
//           if (isProductPack) {
//             router.push(`/productPacks/${product._id}`);
//           } else {
//             router.push(`/products/${product._id}`);
//           }
//         }}
//       >
//         {/* Product Image - Smaller on mobile */}
//         <div className="h-32 lg:h-48 overflow-hidden">
//           <Image
//             src={
//               isProductPack
//                 ? (product.productId?.images?.[0] || 'https://via.placeholder.com/300x150?text=Pack')
//                 : (product.images?.[0] || 'https://via.placeholder.com/300x150?text=Product')
//             }
//             alt={isProductPack ? product.productName : product.name}
//             width={300}
//             height={150}
//             className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
//           />
//         </div>

//         {/* Product Details - Compact on mobile */}
//         <div className="p-3 lg:p-4">
//           {/* Product Name - Truncated on mobile */}
//           <h3 className="text-sm lg:text-lg font-bold text-gray-800 mb-1 lg:mb-2 line-clamp-1">
//             {isProductPack ? product.productName : product.name}
//           </h3>

//           {/* Price Section */}
//           <div className="flex items-center justify-between mb-2">
//             {isProductPack ? (
//               <>
//                 {(product.discount || 0) > 0 ? (
//                   <>
//                     <span className="text-base lg:text-xl font-bold text-green-600">
//                       ₹{((product.priceInRupee * product.quantity) - (product.discount || 0) + product.shippingPrice).toFixed(2)}
//                     </span>
//                     <span className="text-xs text-red-500 line-through hidden lg:inline">
//                       ₹{(product.priceInRupee * product.quantity + product.shippingPrice).toFixed(2)}
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-base lg:text-xl font-bold text-green-600">
//                     ₹{((product.priceInRupee * product.quantity) + product.shippingPrice).toFixed(2)}
//                   </span>
//                 )}
//               </>
//             ) : (
//               <span className="text-base lg:text-xl font-bold text-green-600">${product.price}</span>
//             )}
//           </div>

//           {/* Date Information - For individual products */}
//           {!isProductPack && (
//             <div className="space-y-1 mb-2 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Mfg:</span>
//                 <span className="text-gray-700 font-medium">
//                   {formatDate(product.manufacturedDate)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Exp:</span>
//                 <span className="text-gray-700 font-medium">
//                   {formatDate(product.expireDate)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Days:</span>
//                 <span className={`font-bold ${expiryStatus}`}>
//                   {daysRemaining}d
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Pack Info - For product packs */}
//           {isProductPack && (
//             <div className="space-y-1 mb-2 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Pack:</span>
//                 <span className="text-gray-700 font-medium">
//                   {product.quantity} × {product.weightInLiter}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Duration:</span>
//                 <span className="text-gray-700 font-medium">
//                   {product.dayOfDose} days
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-500">Use/Day:</span>
//                 <span className="text-gray-700 font-medium">
//                   {product.usePerDay}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Stock Status */}
//           <div className="flex items-center justify-between mb-3">
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//               isProductPack 
//                 ? 'bg-blue-100 text-blue-800'
//                 : stockStatus.color
//             }`}>
//               {isProductPack ? 'Pack Available' : stockStatus.text}
//             </span>
//             <span className="text-xs text-gray-500">
//               {isProductPack ? `${product.quantity} units` : `${product.stock || 0}u`}
//             </span>
//           </div>

//           {/* Quantity Selector - Only for individual products */}
//           {!isProductPack && (
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center space-x-1">
//                 <label className="text-xs text-gray-600">Qty:</label>
//                 <div className="flex">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setQuantity(Math.max(1, quantity - 1));
//                     }}
//                     className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-l flex items-center justify-center text-xs font-bold"
//                     disabled={quantity <= 1}
//                   >
//                     −
//                   </button>
//                   <input
//                     type="number"
//                     min="1"
//                     max={product.stock || 1}
//                     value={quantity}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       setQuantity(Math.max(1, parseInt(e.target.value) || 1));
//                     }}
//                     className="w-8 px-1 py-1 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
//                   />
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setQuantity(Math.min(product.stock || 1, quantity + 1));
//                     }}
//                     className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-r flex items-center justify-center text-xs font-bold"
//                     disabled={quantity >= (product.stock || 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons - Cart, Phone Call, and Buy Now */}
//           <div className="flex gap-2">
//             {/* Add to Cart Button */}
//             <button
//               onClick={handleAddToCart}
//               disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
//               className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-lg
//                 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
//                 transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
//               title="Add to Cart"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </button>

//             {/* Phone Call Button */}
//             <button
//               onClick={handlePhoneCall}
//               className="flex-1 bg-purple-600 text-white py-2 px-2 rounded-lg
//                 hover:bg-purple-700 transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
//               title="Call for Details"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//               </svg>
//             </button>

//             {/* Buy Now Button */}
//             <button
//               onClick={handleBuyNow}
//               disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
//               className="flex-1 bg-green-600 text-white py-2 px-2 rounded-lg
//                 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
//                 transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
//               title="Buy Now"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               <span className="hidden lg:inline">Buy</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       <CheckoutModal
//         isOpen={showCheckout}
//         onClose={() => setShowCheckout(false)}
//         items={[{ productId: product, quantity, itemType: isProductPack ? 'productPack' : 'product' }]}
//         onOrderSuccess={handleOrderSuccess}
//       />
//     </>
//   );
// };

// export default Product;

'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../lib/getUser';

const Product = ({ product, index, onBuyNow }) => {
  const router = useRouter();
  const isProductPack = product.itemType === 'productPack';

  const [quantity, setQuantity] = useState(1);
  const productRef = useRef(null);

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

  const handleAddToCart = async (e) => {
    e.stopPropagation();
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
          itemType: isProductPack ? 'productPack' : 'product',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        gsap.fromTo(productRef.current,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          }
        );
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Cart fetch error:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const user = getUserFromToken();
    if (!user) {
      toast.error('Please login to buy now');
      return;
    }
    // Call parent handler instead of managing modal state here
    onBuyNow(product, quantity);
  };

  const handlePhoneCall = (e) => {
    e.stopPropagation();
    window.open('tel:+91 7447340940');
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

  return (
    <div
      ref={productRef}
      className="w-full hover:shadow-gray-600 rounded-xl shadow-md border border-gray-200
      hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer
      lg:flex-shrink-0 lg:w-80"
      style={{ opacity: 0 }}
      onClick={() => {
        if (isProductPack) {
          router.push(`/productPacks/${product._id}`);
        } else {
          router.push(`/products/${product._id}`);
        }
      }}
    >
      {/* Product Image - Smaller on mobile */}
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

      {/* Product Details - Compact on mobile */}
      <div className="p-3 lg:p-4">
        {/* Product Name - Truncated on mobile */}
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
            <span className="text-base lg:text-xl font-bold text-green-600">${product.price}</span>
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

        {/* Pack Info - For product packs */}
        {isProductPack && (
          <div className="space-y-1 mb-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Pack:</span>
              <span className="text-gray-700 font-medium">
                {product.quantity} × {product.weightInLiter}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration:</span>
              <span className="text-gray-700 font-medium">
                {product.dayOfDose} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Use/Day:</span>
              <span className="text-gray-700 font-medium">
                {product.usePerDay}
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

        {/* Action Buttons - Cart, Phone Call, and Buy Now */}
        <div className="flex gap-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
            className="flex-1 bg-blue-600 text-white py-2 px-2 rounded-lg
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
            title="Add to Cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>

          {/* Phone Call Button */}
          <button
            onClick={handlePhoneCall}
            className="flex-1 bg-purple-600 text-white py-2 px-2 rounded-lg
              hover:bg-purple-700 transition-colors duration-300 font-medium text-sm flex items-center justify-center gap-1"
            title="Call for Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>

          {/* Buy Now Button */}
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
  );
};

export default Product;