// 'use client';

// import { useState, useEffect } from 'react';
// import { getUserFromToken } from '../../../lib/getUser';
// import toast from 'react-hot-toast';

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingOrder, setUpdatingOrder] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch('/api/admin/orders', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setOrders(data);
//       } else {
//         toast.error('Failed to fetch orders');
//       }
//     } catch (error) {
//       toast.error('Error fetching orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     setUpdatingOrder(orderId);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch('/api/admin/orders', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           orderId,
//           orderStatus: newStatus,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success('Order status updated successfully');
//         // Update the order in the local state
//         setOrders(orders.map(order =>
//           order._id === orderId
//             ? { ...order, orderStatus: newStatus }
//             : order
//         ));
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to update order status');
//     } finally {
//       setUpdatingOrder(null);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'placed': return 'bg-yellow-100 text-yellow-800';
//       case 'shipped': return 'bg-blue-100 text-blue-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin - Order Management</h1>
//           <p className="text-gray-600">Update order statuses to enable reviews</p>
//         </div>

//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     Order #{order._id.slice(-8).toUpperCase()}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {order.userId?.name} - {order.userId?.phone}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
//                     {order.orderStatus}
//                   </span>
//                   <p className="text-lg font-bold text-gray-800 mt-2">
//                     ₹{order.total}
//                   </p>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="mb-4">
//                 <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
//                 <div className="space-y-2">
//                   {order.items.map((item, index) => (
//                     <div key={index} className="flex justify-between items-center text-sm">
//                       <span>
//                         {item.productData?.productName || item.productData?.name} × {item.quantity}
//                       </span>
//                       <span>₹{item.price}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Status Update */}
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-600">
//                   Current Status: <span className="font-medium capitalize">{order.orderStatus}</span>
//                 </div>
//                 <div className="flex space-x-2">
//                   {order.orderStatus === 'placed' && (
//                     <button
//                       onClick={() => updateOrderStatus(order._id, 'shipped')}
//                       disabled={updatingOrder === order._id}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
//                     >
//                       {updatingOrder === order._id ? 'Updating...' : 'Mark as Shipped'}
//                     </button>
//                   )}
//                   {(order.orderStatus === 'placed' || order.orderStatus === 'shipped') && (
//                     <button
//                       onClick={() => updateOrderStatus(order._id, 'delivered')}
//                       disabled={updatingOrder === order._id}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm"
//                     >
//                       {updatingOrder === order._id ? 'Updating...' : 'Mark as Delivered'}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {orders.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-lg">No orders found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { getUserFromToken } from '../../../lib/getUser';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  const containerRef = useRef(null);
  const orderCardsRef = useRef([]);
  const statsRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current || orders.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            const tl = gsap.timeline();
            
            // Header animation
            tl.fromTo('.admin-header',
              {
                y: -60,
                opacity: 0,
                scale: 0.9
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.8)"
              }
            );

            // Stats cards animation
            tl.fromTo('.stat-card',
              {
                y: 80,
                opacity: 0,
                rotationX: 15
              },
              {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out"
              },
              "-=0.4"
            );

            // Order cards animation
            tl.fromTo('.order-card',
              {
                x: -100,
                opacity: 0,
                scale: 0.8
              },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
              },
              "-=0.3"
            );

            hasAnimatedRef.current = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [orders.length]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error('❌ Failed to fetch orders');
      }
    } catch (error) {
      toast.error('❌ Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          orderStatus: newStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`🎉 Order marked as ${newStatus}!`);
        // Animate the status update
        const orderElement = document.getElementById(`order-${orderId}`);
        if (orderElement) {
          gsap.fromTo(orderElement,
            { backgroundColor: '#fef3c7', scale: 1.02 },
            { backgroundColor: '#ffffff', scale: 1, duration: 0.5, ease: "power2.out" }
          );
        }
        
        // Update the order in the local state
        setOrders(orders.map(order =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        ));
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('❌ Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300';
      case 'shipped': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-300';
      case 'delivered': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-300';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed': return '📦';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      default: return '❓';
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { status: 'placed', label: 'Placed', icon: '📦' },
      { status: 'shipped', label: 'Shipped', icon: '🚚' },
      { status: 'delivered', label: 'Delivered', icon: '✅' }
    ];
    
    return steps.map(step => ({
      ...step,
      active: 
        step.status === currentStatus ||
        (step.status === 'shipped' && currentStatus === 'delivered') ||
        (step.status === 'placed' && (currentStatus === 'shipped' || currentStatus === 'delivered')),
      completed: 
        (step.status === 'placed' && (currentStatus === 'shipped' || currentStatus === 'delivered')) ||
        (step.status === 'shipped' && currentStatus === 'delivered')
    }));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filter);

  const statistics = {
    total: orders.length,
    placed: orders.filter(o => o.orderStatus === 'placed').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br -mt-5 pt-5 from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl font-medium">Loading orders...</p>
          <p className="text-gray-500 mt-2">Preparing your order dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-300 to-indigo-100 py-8 px-4">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="admin-header text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Order Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and track all customer orders in real-time with beautiful analytics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            {
              icon: '📊',
              label: 'Total Orders',
              value: statistics.total,
              color: 'from-purple-500 to-pink-500',
              bg: 'bg-purple-50'
            },
            {
              icon: '📦',
              label: 'Placed',
              value: statistics.placed,
              color: 'from-yellow-500 to-orange-500',
              bg: 'bg-yellow-50'
            },
            {
              icon: '🚚',
              label: 'Shipped',
              value: statistics.shipped,
              color: 'from-blue-500 to-cyan-500',
              bg: 'bg-blue-50'
            },
            {
              icon: '✅',
              label: 'Delivered',
              value: statistics.delivered,
              color: 'from-green-500 to-emerald-500',
              bg: 'bg-green-50'
            },
            {
              icon: '💰',
              label: 'Revenue',
              value: `₹${statistics.totalRevenue.toFixed(2)}`,
              color: 'from-green-600 to-emerald-600',
              bg: 'bg-emerald-50'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              ref={el => statsRef.current[index] = el}
              className="stat-card group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-6 border border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
              <div className={`mt-3 h-1 bg-gradient-to-r ${stat.color} rounded-full transform origin-left group-hover:scale-x-100 scale-x-90 transition-transform duration-500`} />
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-8 border border-white/20">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { key: 'all', label: 'All Orders', icon: '📋', count: statistics.total },
              { key: 'placed', label: 'Placed', icon: '📦', count: statistics.placed },
              { key: 'shipped', label: 'Shipped', icon: '🚚', count: statistics.shipped },
              { key: 'delivered', label: 'Delivered', icon: '✅', count: statistics.delivered }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filter === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  filter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div 
              key={order._id}
              id={`order-${order._id}`}
              ref={el => orderCardsRef.current[index] = el}
              className="order-card group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-8 border border-white/20 transition-all duration-500 hover:border-blue-200"
            >
              {/* Order Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)} {order.orderStatus.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{order.userId?.name}</p>
                        <p className="text-gray-600">{order.userId?.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600">📅</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{order.total}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Amount</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {getStatusSteps(order.orderStatus).map((step, index, array) => (
                    <div key={step.status} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 ${
                          step.completed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400'
                            : step.active
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400'
                            : 'bg-gray-100 text-gray-400 border-gray-300'
                        }`}>
                          {step.completed ? '✓' : step.icon}
                        </div>
                        <span className={`text-xs font-medium mt-2 ${
                          step.active || step.completed ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {index < array.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                          step.completed 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🛍️</span>
                  Order Items
                </h4>
                <div className="grid gap-3">
                  {order.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 group-hover:border-blue-200 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📦</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.productData?.productName || item.productData?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Current Status:</span>{' '}
                  <span className="font-bold text-gray-800 capitalize">{order.orderStatus}</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {order.orderStatus === 'placed' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'shipped')}
                      disabled={updatingOrder === order._id}
                      className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center gap-2">
                        {updatingOrder === order._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            🚚 Mark as Shipped
                          </>
                        )}
                      </span>
                    </button>
                  )}
                  
                  {(order.orderStatus === 'placed' || order.orderStatus === 'shipped') && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                      disabled={updatingOrder === order._id}
                      className="group relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center gap-2">
                        {updatingOrder === order._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            ✅ Mark as Delivered
                          </>
                        )}
                      </span>
                    </button>
                  )}
                  
                  {order.orderStatus === 'delivered' && (
                    <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-semibold border border-green-200">
                      🎉 Order Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {filter === 'all' ? 'No Orders Found' : `No ${filter} Orders`}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {filter === 'all' 
                ? "There are no orders in the system yet. They'll appear here when customers start placing orders."
                : `There are no ${filter} orders at the moment.`
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View All Orders
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}