// 'use client';

// import { useState, useEffect } from 'react';
// import { getUserFromToken } from '../../../lib/getUser';
// import Navbar from '../../../Components/Navbar';

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const currentUser = getUserFromToken();
//     setUser(currentUser);
//     if (currentUser) {
//       fetchOrders();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchOrders = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/orders', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setOrders(data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'placed': return 'text-blue-600';
//       case 'shipped': return 'text-yellow-600';
//       case 'delivered': return 'text-green-600';
//       default: return 'text-gray-600';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-50">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">Loading orders...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen -mt-5 pt-5 bg-zinc-50">
//       <Navbar />
//       <main className="container mx-auto px-4 text-gray-800 py-8">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-2xl font-bold mb-6">My Orders</h1>

//           {orders.length === 0 ? (
//             <p className="text-center text-gray-500">No orders found.</p>
//           ) : (
//             <div className="space-y-6">
//               {orders.map((order) => (
//                 <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
//                       <p className="text-gray-600">
//                         {new Date(order.createdAt).toLocaleDateString()} at{' '}
//                         {new Date(order.createdAt).toLocaleTimeString()}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
//                         {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
//                       </p>
//                       <p className="text-sm text-gray-600">{order.paymentMethod}</p>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <h4 className="font-semibold mb-2">Items:</h4>
//                     <div className="space-y-2">
//                       {order.items.map((item, index) => (
//                         <div key={index} className="flex justify-between items-center border-b pb-2">
//                           <div className="flex items-center">
//                             <img
//                               src={
//                                 item.itemType === 'productPack'
//                                   ? (item.productData?.productId?.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTIyIDIySDQyVjQySDIyVjIyWiIgZmlsbD0iI0Y5RkFGRiIvPgo8L3N2Zz4K')
//                                   : (item.productData?.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTIyIDIySDQyVjQySDIyVjIyWiIgZmlsbD0iI0Y5RkFGRiIvPgo8L3N2Zz4K')
//                               }
//                               alt={
//                                 item.itemType === 'productPack'
//                                   ? (item.productData?.productName || 'Product Pack')
//                                   : (item.productData?.name || 'Product')
//                               }
//                               className="w-12 h-12 object-cover mr-3"
//                             />
//                             <div>
//                               <p className="font-medium">
//                                 {item.itemType === 'productPack'
//                                   ? (item.productData?.productName || 'Product Pack')
//                                   : (item.productData?.name || 'Product')
//                                 }
//                                 {item.itemType === 'productPack' && (
//                                   <span className="block text-xs text-blue-600">
//                                     Pack ({item.productData?.quantity || 1} × {item.productData?.weightInLiter || 'N/A'})
//                                   </span>
//                                 )}
//                               </p>
//                               <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                             </div>
//                           </div>
//                           <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <h4 className="font-semibold mb-2">Delivery Address:</h4>
//                     <p>{order.address.name}, {order.address.phone}</p>
//                     <p>{order.address.house}, {order.address.area}</p>
//                     <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
//                   </div>

//                   <div className="border-t pt-4">
//                     <div className="flex justify-between items-center">
//                       <div className="text-sm text-gray-600">
//                         <p>Subtotal: ₹{order.subtotal?.toFixed(2)}</p>
//                         <p>GST: ₹{order.gst?.toFixed(2)}</p>
//                         <p>Delivery: ₹{order.delivery?.toFixed(2)}</p>
//                         {order.discount > 0 && <p>Discount: -₹{order.discount?.toFixed(2)}</p>}
//                       </div>
//                       <div className="text-right">
//                         <p className="text-lg font-bold">Total: ₹{order.total?.toFixed(2)}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default OrdersPage;

'use client';

import { useState, useEffect, useRef } from 'react';
import { getUserFromToken } from '../../../lib/getUser';
import Navbar from '../../../Components/Navbar';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
const PhoneOtpLogin = dynamic(() => import('../../../Components/PhoneOtpLogin'), { ssr: false });

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const containerRef = useRef(null);
  const ordersRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
    if (currentUser) {
      fetchOrders();
    } else {
      setShowLogin(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && orders.length > 0 && containerRef.current && !hasAnimatedRef.current) {
      animateOrders();
    }
  }, [loading, orders]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const animateOrders = () => {
    const tl = gsap.timeline();
    
    // Page title animation
    tl.fromTo('.page-title',
      {
        y: -50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );

    // Orders cards animation
    tl.fromTo('.order-card',
      {
        x: -100,
        opacity: 0,
        scale: 0.9
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
      },
      "-=0.4"
    );

    hasAnimatedRef.current = true;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out for delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
      case 'confirmed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'shipped':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'out for delivery':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'card':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'upi':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'cod':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br -mt-5 pt-5 from-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-3 lg:px-4 py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="page-title text-2xl lg:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-gray-600 text-sm lg:text-base max-w-2xl mx-auto">
              Track and manage all your orders in one place
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 lg:py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
                Start shopping to see your orders here
              </p>
              <button
                onClick={() => window.location.href = '/Products'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 lg:px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6 lg:space-y-8">
              {orders.map((order, index) => (
                <div 
                  key={order._id}
                  ref={el => ordersRef.current[index] = el}
                  className="order-card bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Order #{order._id?.slice(-8)?.toUpperCase() || 'N/A'}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                            {' at '}
                            {new Date(order.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus?.charAt(0)?.toUpperCase() + order.orderStatus?.slice(1) || 'Processing'}
                        </span>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                          {getPaymentIcon(order.paymentMethod)}
                          {order.paymentMethod?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    {/* Order Items */}
                    <div className="mb-6 lg:mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Order Items
                      </h4>
                      <div className="space-y-4">
                        {order.items?.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="relative">
                                <img
                                  src={
                                    item.itemType === 'productPack'
                                      ? (item.productData?.productId?.images?.[0] || '/api/placeholder/64/64')
                                      : (item.productData?.images?.[0] || '/api/placeholder/64/64')
                                  }
                                  alt={
                                    item.itemType === 'productPack'
                                      ? (item.productData?.productName || 'Product Pack')
                                      : (item.productData?.name || 'Product')
                                  }
                                  className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg border border-gray-300"
                                />
                                {item.itemType === 'productPack' && (
                                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    Pack
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm lg:text-base">
                                  {item.itemType === 'productPack'
                                    ? (item.productData?.productName || 'Product Pack')
                                    : (item.productData?.name || 'Product')
                                  }
                                </p>
                                {item.itemType === 'productPack' && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    {item.productData?.quantity || 1} × {item.productData?.weightInLiter || 'N/A'}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800 text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-sm text-gray-600">₹{item.price?.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6 lg:mb-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Delivery Address
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">{order.address?.name}, {order.address?.phone}</p>
                        <p className="text-gray-600 mt-1">{order.address?.house}, {order.address?.area}</p>
                        <p className="text-gray-600">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST:</span>
                            <span>₹{order.gst?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Charge:</span>
                            <span>₹{order.delivery?.toFixed(2) || '0.00'}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount:</span>
                              <span>-₹{order.discount?.toFixed(2) || '0.00'}</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                            <span className="text-2xl font-bold text-blue-600">₹{order.total?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Phone OTP Login Modal */}
      {showLogin && (
        <PhoneOtpLogin
          onSuccess={(user) => {
            setShowLogin(false);
            setLoading(true);
            fetchOrders(); // Refresh orders after login
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
