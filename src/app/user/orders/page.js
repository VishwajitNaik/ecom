'use client';

import { useState, useEffect } from 'react';
import { getUserFromToken } from '../../../lib/getUser';
import Navbar from '../../../Components/Navbar';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getUserFromToken();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'text-blue-600';
      case 'shipped': return 'text-yellow-600';
      case 'delivered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>

          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                      <p className="text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                          <div className="flex items-center">
                            <img
                              src={item.productId?.images?.[0] || '/placeholder.png'}
                              alt={item.productId?.name || 'Product'}
                              className="w-12 h-12 object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium">{item.productId?.name || 'Product'}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Delivery Address:</h4>
                    <p>{order.address.name}, {order.address.phone}</p>
                    <p>{order.address.house}, {order.address.area}</p>
                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <p>Subtotal: ${order.subtotal?.toFixed(2)}</p>
                        <p>GST: ${order.gst?.toFixed(2)}</p>
                        <p>Delivery: ${order.delivery?.toFixed(2)}</p>
                        {order.discount > 0 && <p>Discount: -${order.discount?.toFixed(2)}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">Total: ${order.total?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;