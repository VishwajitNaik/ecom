'use client';

import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../lib/getUser';
import toast from 'react-hot-toast';
import CheckoutModal from './CheckoutModal';
import Image from 'next/image';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = async () => {
    const user = getUserFromToken();
    if (!user) {
      toast.error('Please login to view cart');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 0) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchCart(); // Refresh cart
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (cartId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId, quantity: 0 }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Item removed from cart');
        fetchCart(); // Refresh cart
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    fetchCart(); // Refresh cart after order
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.itemType === 'productPack') {
        const packPrice = (((item.productId?.priceInRupee || 0) * (item.productId?.quantity || 1)) - (item.productId?.discount || 0) + (item.productId?.shippingPrice || 0));
        return total + (packPrice * item.quantity);
      } else {
        return total + ((item.productId?.price || 0) * item.quantity);
      }
    }, 0).toFixed(2);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button 
              onClick={() => window.location.href = '/Products'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={
                              item.itemType === 'productPack'
                                ? (item.productId?.productId?.images?.[0] || 'https://via.placeholder.com/150x150?text=Pack')
                                : (item.productId?.images?.[0] || 'https://via.placeholder.com/150x150?text=Product')
                            }
                            alt={
                              item.itemType === 'productPack'
                                ? (item.productId?.productName || 'Product Pack')
                                : (item.productId?.name || 'Product')
                            }
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                              {item.itemType === 'productPack' ? (item.productId?.productName || 'Product Pack') : (item.productId?.name || 'Product')}
                              {item.itemType === 'productPack' && (
                                <span className="block text-xs text-blue-600 font-normal">
                                  Pack ({item.productId?.quantity || 1} × {item.productId?.weightInLiter || 'N/A'})
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {item.itemType === 'productPack'
                                ? `${item.productId?.productId?.description || 'Product pack'}`
                                : (item.productId?.description || 'Product description')
                              }
                            </p>
                            <div className="flex items-center gap-3 mb-3">
                               <span className="text-xl font-bold text-green-600">
                                 ${item.itemType === 'productPack'
                                   ? (((item.productId?.priceInRupee || 0) * (item.productId?.quantity || 1)) - (item.productId?.discount || 0) + (item.productId?.shippingPrice || 0)).toFixed(2)
                                   : (item.productId?.price || 0)
                                 }
                               </span>
                               {item.itemType === 'productPack' && (item.productId?.discount || 0) > 0 && (
                                 <span className="text-sm text-red-500 line-through">
                                   ${((item.productId?.priceInRupee || 0) * (item.productId?.quantity || 1) + (item.productId?.shippingPrice || 0)).toFixed(2)}
                                 </span>
                               )}
                             </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-bold text-gray-600"
                              >
                                -
                              </button>
                              <span className="w-10 text-center font-semibold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 text-lg font-bold text-gray-600"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item._id)}
                              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-1 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                           <span className="text-gray-600">Item Total:</span>
                           <span className="text-lg font-bold text-blue-600">
                             ${item.itemType === 'productPack'
                               ? ((((item.productId?.priceInRupee || 0) * (item.productId?.quantity || 1)) - (item.productId?.discount || 0) + (item.productId?.shippingPrice || 0)) * item.quantity).toFixed(2)
                               : ((item.productId?.price || 0) * item.quantity).toFixed(2)
                             }
                           </span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items ({calculateTotalItems()}):</span>
                    <span className="font-semibold">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold text-orange-600">${(calculateTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${(parseFloat(calculateTotal()) + (parseFloat(calculateTotal()) * 0.1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Proceed to Checkout
                </button>

                <p className="text-center text-gray-500 text-sm mt-3">
                  Free shipping on orders over $50
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Shopping Button */}
        {cartItems.length > 0 && (
          <div className="text-center mt-6">
            <button 
              onClick={() => window.location.href = '/Products'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default Cart;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { getUserFromToken } from '../lib/getUser';
// import toast from 'react-hot-toast';
// import CheckoutModal from './CheckoutModal';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [showCheckout, setShowCheckout] = useState(false);

//   const fetchCart = async () => {
//     const user = getUserFromToken();
//     if (!user) {
//       toast.error('Please login to view cart');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/cart/get', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId: user.id }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setCartItems(data);
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch cart');
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateQuantity = async (cartId, newQuantity) => {
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/cart/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ cartId, quantity: newQuantity }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(data.message);
//         fetchCart(); // Refresh cart
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to update quantity');
//     }
//   };

//   const handleCheckout = () => {
//     if (cartItems.length === 0) {
//       toast.error('Cart is empty');
//       return;
//     }
//     setShowCheckout(true);
//   };

//   const handleOrderSuccess = () => {
//     setShowCheckout(false);
//     fetchCart(); // Refresh cart after order
//   };

//   return (
//     <div className="container mx-auto p-4 text-gray-800">
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <div className="space-y-4">
//           {cartItems.map((item) => (
//             <div key={item._id} className="flex items-center border p-4 rounded">
//               <img src={item.productId.images[0]} alt={item.productId.name} className="w-20 h-20 object-cover mr-4" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">{item.productId.name}</h3>
//                 <p className="text-gray-600">{item.productId.description}</p>
//                 <p className="text-xl font-bold">${item.productId.price}</p>
//                 <div className="flex items-center mt-2">
//                   <button
//                     onClick={() => updateQuantity(item._id, item.quantity - 1)}
//                     className="bg-gray-300 px-2 py-1 rounded-l"
//                   >
//                     -
//                   </button>
//                   <span className="px-4 py-1 bg-gray-100 text-gray-800">{item.quantity}</span>
//                   <button
//                     onClick={() => updateQuantity(item._id, item.quantity + 1)}
//                     className="bg-gray-300 px-2 py-1 rounded-r"
//                   >
//                     +
//                   </button>
//                   <button
//                     onClick={() => updateQuantity(item._id, 0)}
//                     className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div className="mt-6">
//             <button onClick={handleCheckout} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//       <CheckoutModal
//         isOpen={showCheckout}
//         onClose={() => setShowCheckout(false)}
//         items={cartItems}
//         onOrderSuccess={handleOrderSuccess}
//       />
//     </div>
//   );
// };

// export default Cart;