'use client';

import { useState, useEffect } from 'react';
import { getUserFromToken } from '../../../lib/getUser';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

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
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Error fetching orders');
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
        toast.success('Order status updated successfully');
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
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin - Order Management</h1>
          <p className="text-gray-600">Update order statuses to enable reviews</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.userId?.name} - {order.userId?.phone}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <p className="text-lg font-bold text-gray-800 mt-2">
                    ₹{order.total}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>
                        {item.productData?.productName || item.productData?.name} × {item.quantity}
                      </span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Current Status: <span className="font-medium capitalize">{order.orderStatus}</span>
                </div>
                <div className="flex space-x-2">
                  {order.orderStatus === 'placed' && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'shipped')}
                      disabled={updatingOrder === order._id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                    >
                      {updatingOrder === order._id ? 'Updating...' : 'Mark as Shipped'}
                    </button>
                  )}
                  {(order.orderStatus === 'placed' || order.orderStatus === 'shipped') && (
                    <button
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                      disabled={updatingOrder === order._id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm"
                    >
                      {updatingOrder === order._id ? 'Updating...' : 'Mark as Delivered'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}