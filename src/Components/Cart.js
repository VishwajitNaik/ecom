'use client';

import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../lib/getUser';
import toast from 'react-hot-toast';
import CheckoutModal from './CheckoutModal';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchCart = async () => {
    const user = getUserFromToken();
    if (!user) {
      toast.error('Please login to view cart');
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
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQuantity) => {
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

  return (
    <div className="container mx-auto p-4 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center border p-4 rounded">
              <img src={item.productId.images[0]} alt={item.productId.name} className="w-20 h-20 object-cover mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                <p className="text-gray-600">{item.productId.description}</p>
                <p className="text-xl font-bold">${item.productId.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="bg-gray-300 px-2 py-1 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="bg-gray-300 px-2 py-1 rounded-r"
                  >
                    +
                  </button>
                  <button
                    onClick={() => updateQuantity(item._id, 0)}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6">
            <button onClick={handleCheckout} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
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