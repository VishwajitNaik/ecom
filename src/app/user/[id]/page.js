'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUserFromToken } from '../../../lib/getUser';
import toast from 'react-hot-toast';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [id]);

  const checkAdminAccess = async () => {
    const user = getUserFromToken();
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
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
        toast.error('Failed to fetch user details');
        router.push('/admin/users');
      }
    } catch (error) {
      toast.error('Failed to load user details');
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
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'placed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const { user, orders, statistics } = userData;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/users')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </button>

        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {user.phone}
                </p>
                {user.email && (
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Role:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Joined:</span> {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">₹{statistics.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentMethod} - {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3">
                      <div className="flex-shrink-0">
                        {item.itemType === 'productPack' ? (
                          item.productData?.productId?.images?.[0] ? (
                            <Image
                              src={item.productData.productId.images[0]}
                              alt={item.productData.productName}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">Pack</span>
                            </div>
                          )
                        ) : (
                          item.productData?.images?.[0] ? (
                            <Image
                              src={item.productData.images[0]}
                              alt={item.productData.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.itemType === 'productPack'
                            ? (item.productData?.productName || 'Product Pack')
                            : (item.productData?.name || 'Product')
                          }
                          {item.itemType === 'productPack' && (
                            <span className="block text-xs text-blue-600">
                              Pack ({item.productData?.quantity || 1} × {item.productData?.weightInLiter || 'N/A'})
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="ml-2 font-medium">₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">GST:</span>
                      <span className="ml-2 font-medium">₹{order.gst.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery:</span>
                      <span className="ml-2 font-medium">₹{order.delivery.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Discount:</span>
                      <span className="ml-2 font-medium">-₹{order.discount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Delivery Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{order.address.name}</p>
                    <p>{order.address.house}, {order.address.area}</p>
                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    <p>Phone: {order.address.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">This user hasn't placed any orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}