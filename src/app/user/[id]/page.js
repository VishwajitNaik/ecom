// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { getUserFromToken } from '../../../lib/getUser';
// import toast from 'react-hot-toast';

// export default function UserDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAdminAccess();
//   }, [id]);

//   const checkAdminAccess = async () => {
//     const user = getUserFromToken();
//     if (!user || user.role !== 'admin') {
//       toast.error('Admin access required');
//       router.push('/');
//       return;
//     }
//     fetchUserDetails();
//   };

//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`/api/users/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const data = await res.json();
//         setUserData(data);
//       } else {
//         toast.error('Failed to fetch user details');
//         router.push('/admin/users');
//       }
//     } catch (error) {
//       toast.error('Failed to load user details');
//       router.push('/admin/users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'shipped': return 'bg-blue-100 text-blue-800';
//       case 'placed': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getPaymentStatusColor = (status) => {
//     switch (status) {
//       case 'success': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'failed': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading user details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
//           <button
//             onClick={() => router.push('/admin/users')}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//           >
//             Back to Users
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { user, orders, statistics } = userData;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Back Button */}
//         <button
//           onClick={() => router.push('/admin/users')}
//           className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           Back to Users
//         </button>

//         {/* User Profile Header */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex items-center space-x-6">
//             <div className="flex-shrink-0">
//               <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
//                 <span className="text-2xl font-bold text-gray-700">
//                   {user.name.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//             <div className="flex-1">
//               <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
//               <div className="mt-2 space-y-1">
//                 <p className="text-gray-600">
//                   <span className="font-medium">Phone:</span> {user.phone}
//                 </p>
//                 {user.email && (
//                   <p className="text-gray-600">
//                     <span className="font-medium">Email:</span> {user.email}
//                   </p>
//                 )}
//                 <p className="text-gray-600">
//                   <span className="font-medium">Role:</span>
//                   <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                     user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
//                   }`}>
//                     {user.role}
//                   </span>
//                 </p>
//                 <p className="text-gray-600">
//                   <span className="font-medium">Joined:</span> {formatDate(user.createdAt)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-800">{statistics.totalOrders}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-full">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Spent</p>
//                 <p className="text-2xl font-bold text-gray-800">₹{statistics.totalSpent.toFixed(2)}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-full">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Completed Orders</p>
//                 <p className="text-2xl font-bold text-gray-800">{statistics.completedOrders}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-yellow-100 rounded-full">
//                 <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Pending Orders</p>
//                 <p className="text-2xl font-bold text-gray-800">{statistics.pendingOrders}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Orders Section */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {orders.map((order) => (
//               <div key={order._id} className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       Order #{order._id.slice(-8)}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Placed on {formatDate(order.createdAt)}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
//                         {order.orderStatus}
//                       </span>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
//                         {order.paymentMethod} - {order.paymentStatus}
//                       </span>
//                     </div>
//                     <p className="text-lg font-bold text-gray-800">₹{order.total.toFixed(2)}</p>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="space-y-3">
//                   {order.items.map((item, index) => (
//                     <div key={index} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3">
//                       <div className="flex-shrink-0">
//                         {item.itemType === 'productPack' ? (
//                           item.productData?.productId?.images?.[0] ? (
//                             <Image
//                               src={item.productData.productId.images[0]}
//                               alt={item.productData.productName}
//                               width={60}
//                               height={60}
//                               className="rounded-lg object-cover"
//                             />
//                           ) : (
//                             <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
//                               <span className="text-xs text-gray-500">Pack</span>
//                             </div>
//                           )
//                         ) : (
//                           item.productData?.images?.[0] ? (
//                             <Image
//                               src={item.productData.images[0]}
//                               alt={item.productData.name}
//                               width={60}
//                               height={60}
//                               className="rounded-lg object-cover"
//                             />
//                           ) : (
//                             <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
//                               <span className="text-xs text-gray-500">No Image</span>
//                             </div>
//                           )
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-medium text-gray-800">
//                           {item.itemType === 'productPack'
//                             ? (item.productData?.productName || 'Product Pack')
//                             : (item.productData?.name || 'Product')
//                           }
//                           {item.itemType === 'productPack' && (
//                             <span className="block text-xs text-blue-600">
//                               Pack ({item.productData?.quantity || 1} × {item.productData?.weightInLiter || 'N/A'})
//                             </span>
//                           )}
//                         </h4>
//                         <p className="text-sm text-gray-600">
//                           Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-gray-800">
//                           ₹{(item.price * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order Summary */}
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                     <div>
//                       <span className="text-gray-600">Subtotal:</span>
//                       <span className="ml-2 font-medium">₹{order.subtotal.toFixed(2)}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">GST:</span>
//                       <span className="ml-2 font-medium">₹{order.gst.toFixed(2)}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Delivery:</span>
//                       <span className="ml-2 font-medium">₹{order.delivery.toFixed(2)}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-600">Discount:</span>
//                       <span className="ml-2 font-medium">-₹{order.discount.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Address */}
//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <h4 className="font-medium text-gray-800 mb-2">Delivery Address</h4>
//                   <div className="text-sm text-gray-600">
//                     <p>{order.address.name}</p>
//                     <p>{order.address.house}, {order.address.area}</p>
//                     <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
//                     <p>Phone: {order.address.phone}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {orders.length === 0 && (
//             <div className="text-center py-12">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
//               <p className="mt-1 text-sm text-gray-500">This user hasn't placed any orders yet.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import { getUserFromToken } from '../../../lib/getUser';
import toast from 'react-hot-toast';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const statsRef = useRef([]);
  const ordersRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    checkAdminAccess();
  }, [id]);

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current || !userData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            const tl = gsap.timeline();
            
            // Header animation
            tl.fromTo('.user-header',
              {
                y: -50,
                opacity: 0
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.8)"
              }
            );

            // Stats cards animation
            tl.fromTo('.stat-card',
              {
                y: 60,
                opacity: 0,
                scale: 0.8
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out"
              },
              "-=0.4"
            );

            // Orders animation
            tl.fromTo('.order-card',
              {
                x: -50,
                opacity: 0
              },
              {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.08,
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
  }, [userData]);

  const checkAdminAccess = async () => {
    const user = getUserFromToken();
    if (!user || user.role !== 'admin') {
      toast.error('🔒 Admin access required');
      router.push('/');
      return;
    }
    fetchUserDetails();
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        toast.error('❌ Failed to fetch user details');
        router.push('/admin/users');
      }
    } catch (error) {
      toast.error('❌ Failed to load user details');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'placed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or you don't have access.</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const { user, orders, statistics } = userData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/users')}
          className="mb-8 group flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="font-semibold">Back to Users</span>
        </button>

        {/* User Profile Header */}
        <div className="user-header bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg border">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                }`}>
                  <span className="text-xs text-white font-bold">
                    {user.role === 'admin' ? 'A' : 'U'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {user.name}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">{user.phone}</p>
                  </div>
                </div>

                {user.email && (
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 border-purple-200' 
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-semibold text-gray-800">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: '🛒',
              label: 'Total Orders',
              value: statistics.totalOrders,
              color: 'from-blue-500 to-cyan-500',
              bg: 'bg-blue-50'
            },
            {
              icon: '💰',
              label: 'Total Spent',
              value: `₹${statistics.totalSpent.toFixed(2)}`,
              color: 'from-green-500 to-emerald-500',
              bg: 'bg-green-50'
            },
            {
              icon: '✅',
              label: 'Completed Orders',
              value: statistics.completedOrders,
              color: 'from-purple-500 to-pink-500',
              bg: 'bg-purple-50'
            },
            {
              icon: '⏳',
              label: 'Pending Orders',
              value: statistics.pendingOrders,
              color: 'from-orange-500 to-red-500',
              bg: 'bg-orange-50'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              ref={el => statsRef.current[index] = el}
              className="stat-card group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-6 border border-white/20 transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
              <div className={`mt-4 h-1 bg-gradient-to-r ${stat.color} rounded-full transform origin-left group-hover:scale-x-100 scale-x-90 transition-transform duration-500`} />
            </div>
          ))}
        </div>

        {/* Orders Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Section Header */}
          <div className="px-8 py-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Order History
                </h2>
                <p className="text-gray-600 mt-1">
                  {orders.length} order{orders.length !== 1 ? 's' : ''} placed by this user
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl px-4 py-2 border border-blue-200">
                <span className="text-blue-700 font-semibold">
                  Total: ₹{statistics.totalSpent.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-200/50">
            {orders.map((order, index) => (
              <div 
                key={order._id}
                ref={el => ordersRef.current[index] = el}
                className="order-card group p-8 hover:bg-gray-50/50 transition-all duration-300"
              >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-start lg:items-end space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.orderStatus)}`}>
                        📦 {order.orderStatus}
                      </span>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}>
                        💳 {order.paymentMethod} - {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 group-hover:border-blue-100 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 relative">
                        {item.itemType === 'productPack' ? (
                          item.productData?.productId?.images?.[0] ? (
                            <Image
                              src={item.productData.productId.images[0]}
                              alt={item.productData.productName}
                              width={70}
                              height={70}
                              className="rounded-xl object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                              <span className="text-xs font-semibold text-blue-700">📦 Pack</span>
                            </div>
                          )
                        ) : (
                          item.productData?.images?.[0] ? (
                            <Image
                              src={item.productData.images[0]}
                              alt={item.productData.name}
                              width={70}
                              height={70}
                              className="rounded-xl object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                              <span className="text-xs font-semibold text-gray-700">🛍️ Product</span>
                            </div>
                          )
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">
                          {item.itemType === 'productPack'
                            ? (item.productData?.productName || 'Product Pack')
                            : (item.productData?.name || 'Product')
                          }
                        </h4>
                        {item.itemType === 'productPack' && (
                          <p className="text-sm text-blue-600 font-medium">
                            Pack of {item.productData?.quantity || 1} × {item.productData?.weightInLiter || 'N/A'}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-lg">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  {[
                    { label: 'Subtotal', value: order.subtotal },
                    { label: 'GST', value: order.gst },
                    { label: 'Delivery', value: order.delivery },
                    { label: 'Discount', value: -order.discount }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                      <p className={`text-lg font-bold ${
                        item.label === 'Discount' ? 'text-red-600' : 'text-gray-800'
                      }`}>
                        {item.label === 'Discount' ? '-' : ''}₹{Math.abs(item.value).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{order.address.name}</p>
                    <p>{order.address.house}, {order.address.area}</p>
                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    <p className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {order.address.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                This user hasn't placed any orders yet. They'll appear here once they start shopping.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}