// 'use client';

// import { useState, useEffect } from 'react';
// import { getUserFromToken } from '../../../lib/getUser';
// import toast from 'react-hot-toast';
// import Navbar from '../../../Components/Navbar';

// const CouponsPage = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingCoupon, setEditingCoupon] = useState(null);
//   const [formData, setFormData] = useState({
//     code: '',
//     discountPercentage: '',
//     expiryDate: '',
//     usageLimit: '',
//   });

//   const user = getUserFromToken();

//   const fetchCoupons = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/coupons', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setCoupons(data);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch coupons');
//     }
//   };

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
//     const method = editingCoupon ? 'PUT' : 'POST';

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           discountPercentage: parseInt(formData.discountPercentage),
//           usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
//           expiryDate: new Date(formData.expiryDate),
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(editingCoupon ? 'Coupon updated' : 'Coupon added');
//         fetchCoupons();
//         setShowForm(false);
//         setEditingCoupon(null);
//         setFormData({
//           code: '',
//           discountPercentage: '',
//           expiryDate: '',
//           usageLimit: '',
//         });
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to save coupon');
//     }
//   };

//   const handleEdit = (coupon) => {
//     setEditingCoupon(coupon);
//     setFormData({
//       code: coupon.code,
//       discountPercentage: coupon.discountPercentage.toString(),
//       expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
//       usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : '',
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch(`/api/coupons/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (res.ok) {
//         toast.success('Coupon deleted');
//         fetchCoupons();
//       } else {
//         toast.error('Failed to delete coupon');
//       }
//     } catch (error) {
//       toast.error('Failed to delete coupon');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8 text-gray-800">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">Manage Coupons</h1>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Add New Coupon
//             </button>
//           </div>

//           {coupons.length === 0 ? (
//             <p className="text-center text-gray-500">No coupons created yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {coupons.map((coupon) => (
//                 <div key={coupon._id} className="bg-white p-4 rounded-lg shadow-md">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="text-lg font-semibold">{coupon.code}</h3>
//                       <p>Discount: {coupon.discountPercentage}%</p>
//                       <p>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
//                       <p>Used: {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</p>
//                       <p>Status: {coupon.isActive ? 'Active' : 'Inactive'}</p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(coupon)}
//                         className="text-blue-600 hover:underline"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(coupon._id)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {showForm && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-lg max-w-md w-full">
//                 <h2 className="text-xl font-bold mb-4">
//                   {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
//                 </h2>
//                 <form onSubmit={handleSubmit}>
//                   <div className="space-y-4">
//                     <input
//                       type="text"
//                       placeholder="Coupon Code"
//                       value={formData.code}
//                       onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="number"
//                       placeholder="Discount Percentage"
//                       value={formData.discountPercentage}
//                       onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       min="1"
//                       max="100"
//                       required
//                     />
//                     <input
//                       type="date"
//                       placeholder="Expiry Date"
//                       value={formData.expiryDate}
//                       onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="number"
//                       placeholder="Usage Limit (optional)"
//                       value={formData.usageLimit}
//                       onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       min="1"
//                     />
//                   </div>
//                   <div className="flex justify-end space-x-4 mt-6">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowForm(false);
//                         setEditingCoupon(null);
//                         setFormData({
//                           code: '',
//                           discountPercentage: '',
//                           expiryDate: '',
//                           usageLimit: '',
//                         });
//                       }}
//                       className="px-4 py-2 border rounded"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-blue-600 text-white rounded"
//                     >
//                       {editingCoupon ? 'Update' : 'Save'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CouponsPage;

'use client';

import { useState, useEffect, useRef } from 'react';
import { getUserFromToken } from '../../../lib/getUser';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import Navbar from '../../../Components/Navbar';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    expiryDate: '',
    usageLimit: '',
  });

  const containerRef = useRef(null);
  const couponsRef = useRef([]);
  const formRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const user = getUserFromToken();

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!hasAnimatedRef.current && containerRef.current && coupons.length > 0) {
      setTimeout(() => {
        animateCoupons();
      }, 100);
    }
  }, [coupons]);

  const fetchCoupons = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/coupons', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons(data);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    }
  };

  const animateCoupons = () => {
    const pageTitle = document.querySelector('.page-title');
    const couponCards = document.querySelectorAll('.coupon-card');
    
    const tl = gsap.timeline();
    
    if (pageTitle) {
      tl.fromTo(pageTitle,
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
    }

    if (couponCards.length > 0) {
      tl.fromTo(couponCards,
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        },
        pageTitle ? "-=0.4" : "+=0"
      );
    }

    hasAnimatedRef.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
    const method = editingCoupon ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          discountPercentage: parseInt(formData.discountPercentage),
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          expiryDate: new Date(formData.expiryDate),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Success animation
        if (formRef.current) {
          gsap.to(formRef.current, {
            scale: 1.02,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          });
        }
        
        toast.success(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
        fetchCoupons();
        setShowForm(false);
        setEditingCoupon(null);
        setFormData({
          code: '',
          discountPercentage: '',
          expiryDate: '',
          usageLimit: '',
        });
      } else {
        // Error shake animation
        if (formRef.current) {
          gsap.to(formRef.current, {
            x: 10,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
            ease: "power1.inOut"
          });
        }
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to save coupon');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage.toString(),
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        // Animate removal
        const couponElement = document.querySelector(`[data-coupon-id="${id}"]`);
        if (couponElement) {
          gsap.to(couponElement, {
            scale: 0.8,
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
              toast.success('Coupon deleted successfully');
              fetchCoupons();
            }
          });
        } else {
          toast.success('Coupon deleted successfully');
          fetchCoupons();
        }
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const isCouponExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const isCouponActive = (coupon) => {
    return coupon.isActive && !isCouponExpired(coupon.expiryDate) && 
           (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen text-gray-800 -mt-5 pt-5 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden"
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      <Navbar />
      
      <main className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="page-title text-2xl lg:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Manage Coupons
            </h1>
            <p className="text-gray-600 text-sm lg:text-base max-w-2xl mx-auto">
              Create and manage discount coupons for your customers
            </p>
          </div>

          {/* Add Coupon Button */}
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
              Active Coupons ({coupons.filter(c => isCouponActive(c)).length})
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Coupon
            </button>
          </div>

          {coupons.length === 0 ? (
            <div className="text-center py-12 lg:py-16 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">No coupons created yet</h3>
              <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
                Create your first coupon to offer discounts to customers
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 lg:px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create First Coupon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {coupons.map((coupon) => (
                <div 
                  key={coupon._id}
                  data-coupon-id={coupon._id}
                  className="coupon-card bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ opacity: hasAnimatedRef.current ? 1 : 0 }}
                >
                  {/* Coupon Header */}
                  <div className={`p-4 text-center ${
                    isCouponActive(coupon) 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <h3 className="text-xl font-bold text-white tracking-wider">{coupon.code}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      isCouponActive(coupon) 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-white'
                    }`}>
                      {isCouponActive(coupon) ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Discount Percentage */}
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {coupon.discountPercentage}%
                      </div>
                      <div className="text-sm text-gray-600 font-medium">DISCOUNT</div>
                    </div>

                    {/* Coupon Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Expires:</span>
                        <span className={`font-medium ${
                          isCouponExpired(coupon.expiryDate) ? 'text-red-600' : 'text-gray-800'
                        }`}>
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium text-gray-800">
                          {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ' (No limit)'}
                        </span>
                      </div>

                      {coupon.usageLimit && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Coupon Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={formRef}
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300"
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCoupon(null);
                    setFormData({
                      code: '',
                      discountPercentage: '',
                      expiryDate: '',
                      usageLimit: '',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                {editingCoupon ? 'Update your coupon details' : 'Fill in the coupon details below'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SUMMER25"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Percentage *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usage Limit <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 100 (leave empty for unlimited)"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty for unlimited usage
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCoupon(null);
                    setFormData({
                      code: '',
                      discountPercentage: '',
                      expiryDate: '',
                      usageLimit: '',
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingCoupon ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.2; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default CouponsPage;