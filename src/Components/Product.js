// 'use client';

// import Image from 'next/image';
// import { useState, useRef, useEffect } from 'react';
// import { gsap } from 'gsap';
// import toast from 'react-hot-toast';
// import { getUserFromToken } from '../lib/getUser';
// import CheckoutModal from './CheckoutModal';

// const Product = ({ product, index }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [showMoreInfo, setShowMoreInfo] = useState(false);
//   const productRef = useRef(null);
//   const modalRef = useRef(null);

//   useEffect(() => {
//     if (productRef.current) {
//       // Initial animation when component mounts
//       gsap.fromTo(productRef.current,
//         {
//           opacity: 0,
//           x: 50,
//           scale: 0.9
//         },
//         {
//           opacity: 1,
//           x: 0,
//           scale: 1,
//           duration: 0.6,
//           delay: index * 0.1,
//           ease: "back.out(1.7)"
//         }
//       );
//     }
//   }, [index]);

//   useEffect(() => {
//     if (showMoreInfo && modalRef.current) {
//       // Modal entrance animation
//       gsap.fromTo(modalRef.current,
//         {
//           opacity: 0,
//           scale: 0.8,
//           y: 50
//         },
//         {
//           opacity: 1,
//           scale: 1,
//           y: 0,
//           duration: 0.4,
//           ease: "power2.out"
//         }
//       );
//     }
//   }, [showMoreInfo]);

//   const handleAddToCart = async () => {
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
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(data.message);
//         // Add success animation
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
//       toast.error('Failed to add to cart');
//     }
//   };

//   const handleBuyNow = () => {
//     const user = getUserFromToken();
//     if (!user) {
//       toast.error('Please login to buy now');
//       return;
//     }
//     setShowCheckout(true);
//   };

//   const handleOrderSuccess = () => {
//     setShowCheckout(false);
//   };

//   const openMoreInfo = () => {
//     setShowMoreInfo(true);
//   };

//   const closeMoreInfo = () => {
//     // Modal exit animation
//     if (modalRef.current) {
//       gsap.to(modalRef.current, {
//         opacity: 0,
//         scale: 0.8,
//         y: 50,
//         duration: 0.3,
//         ease: "power2.in",
//         onComplete: () => setShowMoreInfo(false)
//       });
//     } else {
//       setShowMoreInfo(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const calculateDaysRemaining = (expireDate) => {
//     if (!expireDate) return 0;
//     const today = new Date();
//     const expiry = new Date(expireDate);
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
//   const daysRemaining = calculateDaysRemaining(product.expireDate?.$date);
//   const expiryStatus = getExpiryStatus(daysRemaining);

//   return (
//     <>
//       <div 
//         ref={productRef}
//         className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 
//         hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
//         style={{ opacity: 0 }}
//       >
//         {/* Product Image */}
//         <div className="h-48 overflow-hidden">
//           <Image
//             src={product.images?.[0] || '/api/placeholder/320/192'}
//             alt={product.name}
//             width={320}
//             height={192}
//             className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
//           />
//         </div>
        
//         {/* Product Details */}
//         <div className="p-6">
//           <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
//           <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
//           {/* Price Section */}
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-2xl font-bold text-green-600">${product.price}</span>
//             {product.discountPrice && (
//               <span className="text-sm text-red-500 line-through">${product.discountPrice}</span>
//             )}
//           </div>

//           {/* Date Information */}
//           <div className="space-y-2 mb-4">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Manufactured:</span>
//               <span className="text-gray-700 font-medium">
//                 {formatDate(product.manufacturedDate?.$date)}
//               </span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Expires:</span>
//               <span className="text-gray-700 font-medium">
//                 {formatDate(product.expireDate?.$date)}
//               </span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Days Left:</span>
//               <span className={`font-bold ${expiryStatus}`}>
//                 {daysRemaining} days
//               </span>
//             </div>
//           </div>

//           {/* Stock Status */}
//           <div className="flex items-center justify-between mb-4">
//             <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
//               {stockStatus.text}
//             </span>
//             <span className="text-sm text-gray-500">{product.stock || 0} units</span>
//           </div>

//           {/* Quantity Selector */}
//           <div className="flex items-center space-x-2 mb-4">
//             <label className="text-sm text-gray-600">Qty:</label>
//             <input
//               type="number"
//               min="1"
//               max={product.stock || 1}
//               value={quantity}
//               onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
//               className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             <button 
//               onClick={handleAddToCart}
//               disabled={!product.stock || product.stock === 0}
//               className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg 
//                 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
//                 transition-colors duration-300 font-medium"
//             >
//               Add to Cart
//             </button>
//             <button 
//               onClick={openMoreInfo}
//               className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg 
//                 hover:bg-gray-300 transition-colors duration-300 font-medium"
//             >
//               More Info
//             </button>
//           </div>

//           {/* Buy Now Button */}
//           <button 
//             onClick={handleBuyNow}
//             disabled={!product.stock || product.stock === 0}
//             className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg 
//               hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
//               transition-colors duration-300 font-medium"
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>

//       {/* More Info Modal */}
//       {showMoreInfo && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div 
//             ref={modalRef}
//             className="product-modal bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//             style={{ opacity: 0 }}
//           >
//             <div className="p-6">
//               {/* Header */}
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
//                 <button 
//                   onClick={closeMoreInfo}
//                   className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-300"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Product Image */}
//               <div className="mb-6">
//                 <Image
//                   src={product.images?.[0] || '/api/placeholder/600/400'}
//                   alt={product.name}
//                   width={600}
//                   height={400}
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//               </div>

//               {/* Product Details */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* Left Column */}
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
//                     <p className="text-gray-600">{product.description}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Pricing</h3>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span>Current Price:</span>
//                         <span className="text-2xl font-bold text-green-600">${product.price}</span>
//                       </div>
//                       {product.discountPrice && (
//                         <div className="flex justify-between">
//                           <span>Original Price:</span>
//                           <span className="text-lg text-red-500 line-through">${product.discountPrice}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Information</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Manufactured Date:</span>
//                         <span className="font-medium">{formatDate(product.manufacturedDate?.$date)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Expiry Date:</span>
//                         <span className="font-medium">{formatDate(product.expireDate?.$date)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Days Remaining:</span>
//                         <span className={`font-bold ${expiryStatus}`}>
//                           {daysRemaining} days
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Stock Available:</span>
//                         <span className={`font-medium ${stockStatus.color.replace('bg-', 'text-').split(' ')[0]}`}>
//                           {product.stock || 0} units
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {product.category && (
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-2">Category</h3>
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                         {product.category}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Action Buttons in Modal */}
//               <div className="flex gap-4 pt-6 border-t border-gray-200">
//                 <button 
//                   onClick={handleAddToCart}
//                   disabled={!product.stock || product.stock === 0}
//                   className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg 
//                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
//                     transition-colors duration-300 font-semibold text-lg"
//                 >
//                   Add to Cart
//                 </button>
//                 <button 
//                   onClick={handleBuyNow}
//                   disabled={!product.stock || product.stock === 0}
//                   className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg 
//                     hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
//                     transition-colors duration-300 font-semibold text-lg"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Checkout Modal */}
//       <CheckoutModal
//         isOpen={showCheckout}
//         onClose={() => setShowCheckout(false)}
//         items={[{ productId: product, quantity }]}
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
import CheckoutModal from './CheckoutModal';

const Product = ({ product, index }) => {
  const router = useRouter();
  const isProductPack = product.itemType === 'productPack';

  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const productRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (productRef.current) {
      // Initial animation when component mounts
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

  useEffect(() => {
    if (showMoreInfo && modalRef.current) {
      // Modal entrance animation
      gsap.fromTo(modalRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }
      );
    }
  }, [showMoreInfo]);

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
          itemType: isProductPack ? 'productPack' : 'product',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        // Add success animation
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

  const openMoreInfo = () => {
    setShowMoreInfo(true);
  };

  const closeMoreInfo = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setShowMoreInfo(false)
      });
    } else {
      setShowMoreInfo(false);
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';

    // Handle different date formats: MongoDB $date, ISO string, or Date object
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
    // Handle different date formats: MongoDB $date, ISO string, or Date object
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
    <>
      {/* Mobile Card - 4 cards per row */}
      <div
        ref={productRef}
        className="w-full bg-white rounded-xl shadow-md border border-gray-200
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
        <div className="p-3 lg:p-6">
          {/* Product Name - Truncated on mobile */}
          <h3 className="text-sm lg:text-xl font-bold text-gray-800 mb-1 lg:mb-2 line-clamp-1 lg:line-clamp-none">
            {isProductPack ? product.productName : product.name}
            {isProductPack && (
              <span className="block text-xs text-blue-600 font-normal lg:hidden">
                Pack ({product.quantity} × {product.weightInLiter})
              </span>
            )}
          </h3>

          {/* Description - Hidden on mobile, shown on desktop */}
          <p className="hidden lg:block text-gray-600 text-sm mb-3 line-clamp-2">
            {isProductPack ? `${product.productId?.description || 'Product pack'}` : product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            {isProductPack ? (
              <>
                {(product.discount || 0) > 0 ? (
                  <>
                    <span className="text-lg lg:text-2xl font-bold text-green-600">
                      ₹{((product.priceInRupee * product.quantity) - (product.discount || 0) + product.shippingPrice).toFixed(2)}
                    </span>
                    <span className="text-xs lg:text-sm text-red-500 line-through">
                      ₹{(product.priceInRupee * product.quantity + product.shippingPrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg lg:text-2xl font-bold text-green-600">
                    ₹{((product.priceInRupee * product.quantity) + product.shippingPrice).toFixed(2)}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-lg lg:text-2xl font-bold text-green-600">${product.price}</span>
                {product.discountPrice && (
                  <span className="text-xs lg:text-sm text-red-500 line-through hidden lg:block">
                    ${product.discountPrice}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Date Information - Compact on mobile */}
          {isProductPack ? (
            <div className="space-y-1 lg:space-y-2 mb-2 lg:mb-4">
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-500">Pack:</span>
                <span className="text-gray-700 font-medium">
                  {product.quantity} × {product.weightInLiter}
                </span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-500">Duration:</span>
                <span className="text-gray-700 font-medium">
                  {product.dayOfDose} days
                </span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-500">Use:</span>
                <span className="text-gray-700 font-medium">
                  {product.usePerDay}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1 lg:space-y-2 mb-2 lg:mb-4">
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-500">Mfg:</span>
                <span className="text-gray-700 font-medium">
                  {formatDate(product.manufacturedDate)}
                </span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-500">Exp:</span>
                <span className="text-gray-700 font-medium">
                  {formatDate(product.expireDate)}
                </span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm">
                <span className="text-gray-500">Days:</span>
                <span className={`font-bold ${expiryStatus}`}>
                  {daysRemaining}d
                </span>
              </div>
            </div>
          )}

          {/* Stock Status - Compact on mobile */}
          {isProductPack ? (
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Pack Available
              </span>
              <span className="text-xs lg:text-sm text-gray-500">{product.quantity} units</span>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
              <span className="text-xs lg:text-sm text-gray-500">{product.stock || 0}u</span>
            </div>
          )}

          {/* Quantity Selector - Hidden for product packs */}
          {!isProductPack && (
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="flex items-center space-x-1 lg:space-x-2">
                <label className="text-xs lg:text-sm text-gray-600">Qty:</label>

                {/* Mobile increment/decrement buttons */}
                <div className="flex lg:hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 px-1 py-1 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-r flex items-center justify-center text-xs font-bold"
                    disabled={quantity >= (product.stock || 1)}
                  >
                    +
                  </button>
                </div>

                {/* Desktop input only */}
                <input
                  type="number"
                  min="1"
                  max={product.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="hidden lg:block w-20 px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <span className="text-xs text-gray-500 lg:hidden">
                {quantity}
              </span>
            </div>
          )}

          {/* Action Buttons - Stacked on mobile, horizontal on desktop */}
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
              className="bg-blue-600 text-white py-2 px-3 lg:py-2 lg:px-4 rounded-lg
                hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                transition-colors duration-300 font-medium text-sm lg:text-base"
            >
              Add to Cart
            </button>
            <button
              onClick={openMoreInfo}
              className="bg-gray-200 text-gray-700 py-2 px-3 lg:py-2 lg:px-4 rounded-lg
                hover:bg-gray-300 transition-colors duration-300 font-medium text-sm lg:text-base"
            >
              Info
            </button>
          </div>

          {/* Buy Now Button - Full width on mobile */}
          <button
            onClick={handleBuyNow}
            disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
            className="w-full mt-2 bg-green-600 text-white py-2 px-3 rounded-lg
              hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
              transition-colors duration-300 font-medium text-sm lg:text-base"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* More Info Modal */}
      {showMoreInfo && (
        <div className="fixed inset-0 bg-white/10 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="product-modal bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ opacity: 0 }}
          >
            <div className="p-4 lg:p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4 lg:mb-6">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                    {isProductPack ? product.productName : product.name}
                  </h2>
                  {isProductPack && (
                    <p className="text-sm text-blue-600 mt-1">
                      Pack: {product.quantity} × {product.weightInLiter} | {product.dayOfDose} days supply
                    </p>
                  )}
                </div>
                <button
                  onClick={closeMoreInfo}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-300"
                >
                  ×
                </button>
              </div>

              {/* Product Image */}
              <div className="mb-4 lg:mb-6">
                <Image
                  src={
                    isProductPack
                      ? (product.productId?.images?.[0] || '/api/placeholder/600/400')
                      : (product.images?.[0] || '/api/placeholder/600/400')
                  }
                  alt={isProductPack ? product.productName : product.name}
                  width={600}
                  height={400}
                  className="w-full h-48 lg:h-64 object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
                {/* Left Column */}
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm lg:text-base">
                      {isProductPack
                        ? `${product.productId?.description || 'Product pack'} - ${product.productName} contains ${product.quantity} × ${product.weightInLiter} for ${product.dayOfDose} days supply.`
                        : product.description
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Pricing</h3>
                    <div className="space-y-2">
                      {isProductPack ? (
                        <>
                          <div className="flex justify-between">
                            <span>Pack Price:</span>
                            <span className="text-xl lg:text-2xl font-bold text-green-600">
                              ₹{((product.priceInRupee * product.quantity) - (product.discount || 0) + product.shippingPrice).toFixed(2)}
                            </span>
                          </div>
                          {(product.discount || 0) > 0 && (
                            <div className="flex justify-between">
                              <span>Original Price:</span>
                              <span className="text-lg text-red-500 line-through">
                                ₹{(product.priceInRupee * product.quantity + product.shippingPrice).toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span>Unit Price:</span>
                            <span>₹{product.priceInRupee.toFixed(2)} × {product.quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Shipping:</span>
                            <span>₹{product.shippingPrice.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>Current Price:</span>
                            <span className="text-xl lg:text-2xl font-bold text-green-600">${product.price}</span>
                          </div>
                          {product.discountPrice && (
                            <div className="flex justify-between">
                              <span>Original Price:</span>
                              <span className="text-lg text-red-500 line-through">${product.discountPrice}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {isProductPack ? 'Pack Information' : 'Product Information'}
                    </h3>
                    <div className="space-y-2 lg:space-y-3">
                      {isProductPack ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pack Size:</span>
                            <span className="font-medium">{product.quantity} × {product.weightInLiter}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{product.dayOfDose} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Usage:</span>
                            <span className="font-medium">{product.usePerDay}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pack Type:</span>
                            <span className="font-medium capitalize">{product.typeOfPack}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Savings:</span>
                            <span className="font-medium text-green-600">
                              ₹{(product.discount || 0).toFixed(2)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Manufactured:</span>
                            <span className="font-medium">{formatDate(product.manufacturedDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expiry Date:</span>
                            <span className="font-medium">{formatDate(product.expireDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Days Remaining:</span>
                            <span className={`font-bold ${expiryStatus}`}>
                              {daysRemaining} days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Stock:</span>
                            <span className={`font-medium ${stockStatus.color.replace('bg-', 'text-').split(' ')[0]}`}>
                              {product.stock || 0} units
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {(!isProductPack && product.category) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Category</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {isProductPack && product.productId?.category && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Category</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {product.productId.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector in Modal */}
              <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                <label className="text-sm lg:text-base text-gray-600">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex flex-col lg:flex-row gap-3 pt-4 lg:pt-6 border-t border-gray-200">
                <button
                  onClick={handleAddToCart}
                  disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg
                    hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors duration-300 font-semibold text-lg"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isProductPack ? false : (!product.stock || product.stock === 0)}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg
                    hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors duration-300 font-semibold text-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={[{ productId: product, quantity, itemType: isProductPack ? 'productPack' : 'product' }]}
        onOrderSuccess={handleOrderSuccess}
      />
    </>
  );
};

export default Product;