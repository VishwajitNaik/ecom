'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getUserFromToken } from '../lib/getUser';
import toast from 'react-hot-toast';

const CheckoutModal = ({ isOpen, onClose, items, onOrderSuccess }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    house: '',
    area: '',
    city: '',
    state: '',
  });

  const user = useMemo(() => getUserFromToken(), []);

  useEffect(() => {
    if (isOpen && user) {
      fetchAddresses();
    } else if (!isOpen) {
      setIsProcessing(false); // Reset processing state when modal closes
      setLoadingAddresses(false); // Reset loading state when modal closes
    }
  }, [isOpen, user]);

  // Load Razorpay script once when component mounts
  useEffect(() => {
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  const fetchAddresses = async () => {
    if (loadingAddresses) return; // Prevent multiple calls

    setLoadingAddresses(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data);
        // Set default address only if not already selected
        if (!selectedAddressId) {
          const defaultAddr = data.find(addr => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
          } else if (data.length > 0) {
            setSelectedAddressId(data[0]._id);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to fetch addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Calculate prices
  const subtotal = items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const delivery = subtotal >= 499 ? 0 : 40;
  const discount = appliedDiscount;
  const total = subtotal + gst + delivery - discount;

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedDiscount(subtotal * (data.discountPercentage / 100));
        toast.success(`Coupon applied! ${data.discountPercentage}% off`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    }
  };

  const handleOrder = async () => {
    if (isProcessing) return; // Prevent multiple submissions

    let addressData;
    if (selectedAddressId === 'new') {
      if (!newAddress.name || !newAddress.phone || !newAddress.pincode) {
        toast.error('Please fill in all address fields');
        return;
      }
      addressData = newAddress;
    } else {
      const selectedAddr = addresses.find(addr => addr._id === selectedAddressId);
      if (!selectedAddr) {
        toast.error('Please select an address');
        return;
      }
      addressData = {
        name: selectedAddr.name,
        phone: selectedAddr.phone,
        pincode: selectedAddr.pincode,
        house: selectedAddr.house,
        area: selectedAddr.area,
        city: selectedAddr.city,
        state: selectedAddr.state,
      };
    }

    setIsProcessing(true);

    if (paymentMethod === 'Razorpay') {
      // Handle Razorpay payment
      try {
        // 1. Create order from backend
        const res = await fetch("/api/payment/order", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total }),
        });

        const data = await res.json();
        if (!data.success) {
          toast.error('Failed to create payment order');
          return;
        }

        const order = data.order;

        // 2. Open Razorpay popup
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Ecom Store",
          description: "Order Payment",
          order_id: order.id,
          handler: async function (response) {
            // 3. Verify payment in backend
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // 4. Save order in database
              const orderData = {
                userId: user.id,
                items: items.map(item => ({
                  productId: item.productId._id,
                  quantity: item.quantity,
                  price: item.productId.price,
                })),
                address: addressData,
                paymentMethod,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentStatus: 'success',
                subtotal,
                gst,
                delivery,
                discount,
                total,
                couponCode: appliedDiscount > 0 ? coupon : null,
              };

              const token = localStorage.getItem('token');
              await fetch("/api/payment/save-order", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
              });

              setIsProcessing(false);
              toast.success('Payment successful! Order placed.');
              onOrderSuccess();
              onClose();
              window.location.href = '/success';
            } else {
              setIsProcessing(false);
              toast.error("Payment Verification Failed!");
            }
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error('Payment failed');
        setIsProcessing(false);
      }
      return;
    }

    // Handle COD order
    const orderData = {
      userId: user.id,
      items: items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      address: addressData,
      paymentMethod,
      subtotal,
      gst,
      delivery,
      discount,
      total,
      couponCode: appliedDiscount > 0 ? coupon : null,
    };

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order placed successfully!');
        onOrderSuccess();
        onClose();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-800    ">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {/* Product Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          {items.map((item) => (
            <div key={item._id || item.productId._id} className="flex items-center border-b py-2">
              <img src={item.productId.images[0]} alt={item.productId.name} className="w-16 h-16 object-cover mr-4" />
              <div className="flex-1">
                <h4 className="font-semibold">{item.productId.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>${item.productId.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Address Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses saved. Please add an address first.</p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label key={addr._id} className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    {addr.isDefault && <span className="text-green-600 text-sm">Default</span>}
                    <p className="font-semibold">{addr.name} - {addr.phone}</p>
                    <p>{addr.house}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            className="mt-2 text-blue-600 hover:underline"
          >
            {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
          </button>
          {showNewAddressForm && (
            <div className="mt-4 p-4 border rounded">
              <h4 className="font-semibold mb-2">Add New Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="House No."
                  value={newAddress.house}
                  onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Area/Road"
                  value={newAddress.area}
                  onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
              </div>
              <label className="flex items-center mt-2">
                <input
                  type="radio"
                  name="address"
                  value="new"
                  checked={selectedAddressId === 'new'}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="mr-2"
                />
                Use this new address
              </label>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Online Payment (Razorpay)
            </label>
          </div>
        </div>

        {/* Coupon */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Coupon Code</h3>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="border p-2 rounded-l flex-1"
            />
            <button onClick={applyCoupon} className="bg-blue-600 text-white px-4 rounded-r">
              Apply
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%):</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>${delivery.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleOrder}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;