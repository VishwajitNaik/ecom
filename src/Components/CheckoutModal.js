// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { getUserFromToken } from '../lib/getUser';
// import toast from 'react-hot-toast';

// const CheckoutModal = ({ isOpen, onClose, items, onOrderSuccess }) => {
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('COD');
//   const [coupon, setCoupon] = useState('');
//   const [appliedDiscount, setAppliedDiscount] = useState(0);
//   const [showNewAddressForm, setShowNewAddressForm] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [loadingAddresses, setLoadingAddresses] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     name: '',
//     phone: '',
//     pincode: '',
//     house: '',
//     area: '',
//     city: '',
//     state: '',
//   });

//   const user = useMemo(() => getUserFromToken(), []);

//   useEffect(() => {
//     if (isOpen && user) {
//       fetchAddresses();
//     } else if (!isOpen) {
//       setIsProcessing(false); // Reset processing state when modal closes
//       setLoadingAddresses(false); // Reset loading state when modal closes
//     }
//   }, [isOpen, user]);

//   // Load Razorpay script once when component mounts
//   useEffect(() => {
//     if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       document.body.appendChild(script);
//     }
//   }, []);

//   const fetchAddresses = async () => {
//     if (loadingAddresses) return; // Prevent multiple calls

//     setLoadingAddresses(true);
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/addresses', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setAddresses(data);
//         // Set default address only if not already selected
//         if (!selectedAddressId) {
//           const defaultAddr = data.find(addr => addr.isDefault);
//           if (defaultAddr) {
//             setSelectedAddressId(defaultAddr._id);
//           } else if (data.length > 0) {
//             setSelectedAddressId(data[0]._id);
//           }
//         }
//       }
//     } catch (error) {
//       toast.error('Failed to fetch addresses');
//     } finally {
//       setLoadingAddresses(false);
//     }
//   };

//   // Calculate prices
//   const subtotal = items.reduce((sum, item) => {
//     if (item.itemType === 'productPack') {
//       // Use pre-calculated totalPrice for ProductPacks, fallback to calculation
//       let packPrice = Number(item.productId?.totalPrice) || 0;
//       if (packPrice === 0) {
//         // Fallback calculation for existing ProductPacks without totalPrice
//         const priceInRupee = Number(item.productId?.priceInRupee) || 0;
//         const packQuantity = Number(item.productId?.quantity) || 1;
//         const discount = Number(item.productId?.discount) || 0;
//         const shippingPrice = Number(item.productId?.shippingPrice) || 0;
//         packPrice = ((priceInRupee * packQuantity) - discount + shippingPrice);
//       }
//       return sum + (packPrice * (Number(item.quantity) || 1));
//     } else {
//       const price = Number(item.productId?.price) || 0;
//       return sum + (price * (Number(item.quantity) || 1));
//     }
//   }, 0);
//   const gst = subtotal * 0.18;
//   const delivery = subtotal >= 499 ? 0 : 40;
//   const discount = appliedDiscount;
//   const total = subtotal + gst + delivery - discount;

//   const applyCoupon = async () => {
//     if (!coupon.trim()) {
//       toast.error('Please enter a coupon code');
//       return;
//     }

//     try {
//       const res = await fetch('/api/coupons/validate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ code: coupon }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setAppliedDiscount(subtotal * (data.discountPercentage / 100));
//         toast.success(`Coupon applied! ${data.discountPercentage}% off`);
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to apply coupon');
//     }
//   };

//   const handleOrder = async () => {
//     if (isProcessing) return; // Prevent multiple submissions

//     let addressData;
//     if (selectedAddressId === 'new') {
//       if (!newAddress.name || !newAddress.phone || !newAddress.pincode) {
//         toast.error('Please fill in all address fields');
//         return;
//       }
//       addressData = newAddress;
//     } else {
//       const selectedAddr = addresses.find(addr => addr._id === selectedAddressId);
//       if (!selectedAddr) {
//         toast.error('Please select an address');
//         return;
//       }
//       addressData = {
//         name: selectedAddr.name,
//         phone: selectedAddr.phone,
//         pincode: selectedAddr.pincode,
//         house: selectedAddr.house,
//         area: selectedAddr.area,
//         city: selectedAddr.city,
//         state: selectedAddr.state,
//       };
//     }

//     setIsProcessing(true);

//     if (paymentMethod === 'Razorpay') {
//       // Handle Razorpay payment
//       try {
//         // 1. Create order from backend
//         const res = await fetch("/api/payment/order", {
//           method: "POST",
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ amount: total }),
//         });

//         const data = await res.json();
//         if (!data.success) {
//           toast.error('Failed to create payment order');
//           return;
//         }

//         const order = data.order;

//         // 2. Open Razorpay popup
//         const options = {
//           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//           amount: order.amount,
//           currency: "INR",
//           name: "Ecom Store",
//           description: "Order Payment",
//           order_id: order.id,
//           handler: async function (response) {
//             // 3. Verify payment in backend
//             const verifyRes = await fetch("/api/payment/verify", {
//               method: "POST",
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(response),
//             });

//             const verifyData = await verifyRes.json();

//             if (verifyData.success) {
//               // 4. Save order in database
//               const orderData = {
//                 userId: user.id,
//                 items: items.map(item => ({
//                   itemId: item.itemId || item.productId._id,
//                   itemType: item.itemType || 'product',
//                   quantity: item.quantity,
//                   price: item.itemType === 'productPack'
//                     ? (() => {
//                         let packPrice = Number(item.productId?.totalPrice) || 0;
//                         if (packPrice === 0) {
//                           const priceInRupee = Number(item.productId?.priceInRupee) || 0;
//                           const packQuantity = Number(item.productId?.quantity) || 1;
//                           const discount = Number(item.productId?.discount) || 0;
//                           const shippingPrice = Number(item.productId?.shippingPrice) || 0;
//                           packPrice = ((priceInRupee * packQuantity) - discount + shippingPrice);
//                         }
//                         return packPrice;
//                       })()
//                     : (item.productId?.price || 0),
//                 })),
//                 address: addressData,
//                 paymentMethod,
//                 paymentId: response.razorpay_payment_id,
//                 orderId: response.razorpay_order_id,
//                 paymentStatus: 'success',
//                 subtotal,
//                 gst,
//                 delivery,
//                 discount,
//                 total,
//                 couponCode: appliedDiscount > 0 ? coupon : null,
//               };

//               const token = localStorage.getItem('token');
//               await fetch("/api/payment/save-order", {
//                 method: "POST",
//                 headers: {
//                   'Content-Type': 'application/json',
//                   'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(orderData),
//               });

//               setIsProcessing(false);
//               onOrderSuccess();
//               onClose();
//               window.location.href = '/success?type=payment';
//             } else {
//               setIsProcessing(false);
//               toast.error("Payment Verification Failed!");
//             }
//           },
//           theme: { color: "#3399cc" },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } catch (error) {
//         toast.error('Payment failed');
//         setIsProcessing(false);
//       }
//       return;
//     }

//     // Handle COD order
//     const orderData = {
//       userId: user.id,
//       items: items.map(item => ({
//         itemId: item.itemId || item.productId._id,
//         itemType: item.itemType || 'product',
//         quantity: item.quantity,
//         price: item.itemType === 'productPack'
//           ? (() => {
//               let packPrice = Number(item.productId?.totalPrice) || 0;
//               if (packPrice === 0) {
//                 const priceInRupee = Number(item.productId?.priceInRupee) || 0;
//                 const packQuantity = Number(item.productId?.quantity) || 1;
//                 const discount = Number(item.productId?.discount) || 0;
//                 const shippingPrice = Number(item.productId?.shippingPrice) || 0;
//                 packPrice = ((priceInRupee * packQuantity) - discount + shippingPrice);
//               }
//               return packPrice;
//             })()
//           : (item.productId?.price || 0),
//         quantity: item.quantity || 1,
//       })),
//       address: addressData,
//       paymentMethod,
//       subtotal,
//       gst,
//       delivery,
//       discount,
//       total,
//       couponCode: appliedDiscount > 0 ? coupon : null,
//     };

//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/order/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(orderData),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         onOrderSuccess();
//         onClose();
//         // Redirect to success page with order type
//         window.location.href = '/success?type=order';
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to place order');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-white/10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 text-gray-800    ">
//       <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">Checkout</h2>

//         {/* Product Summary */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
//           {items.map((item) => (
//             <div key={item._id || item.productId._id} className="flex items-center border-b py-2">
//               <img
//                 src={
//                   item.itemType === 'productPack'
//                     ? (item.productId.productId?.images?.[0] || 'https://via.placeholder.com/150x150?text=Pack')
//                     : (item.productId.images?.[0] || 'https://via.placeholder.com/150x150?text=Product')
//                 }
//                 alt={
//                   item.itemType === 'productPack'
//                     ? (item.productId?.productName || 'Product Pack')
//                     : (item.productId?.name || 'Product')
//                 }
//                 className="w-16 h-16 object-cover mr-4"
//               />
//               <div className="flex-1">
//                 <h4 className="font-semibold">
//                   {item.itemType === 'productPack' ? (item.productId?.productName || 'Product Pack') : (item.productId?.name || 'Product')}
//                   {item.itemType === 'productPack' && (
//                     <span className="block text-xs text-blue-600 font-normal">
//                       Pack ({item.productId?.quantity || 1} × {item.productId?.weightInLiter || 'N/A'})
//                     </span>
//                   )}
//                 </h4>
//                 <p>Quantity: {item.quantity}</p>
//                 <p>
//                   ₹{item.itemType === 'productPack'
//                     ? (() => {
//                         let packPrice = Number(item.productId?.totalPrice) || 0;
//                         if (packPrice === 0) {
//                           const priceInRupee = Number(item.productId?.priceInRupee) || 0;
//                           const packQuantity = Number(item.productId?.quantity) || 1;
//                           const discount = Number(item.productId?.discount) || 0;
//                           const shippingPrice = Number(item.productId?.shippingPrice) || 0;
//                           packPrice = ((priceInRupee * packQuantity) - discount + shippingPrice);
//                         }
//                         return (packPrice * (Number(item.quantity) || 1)).toFixed(2);
//                       })()
//                     : ((Number(item.productId?.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)
//                   }
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Address Selection */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
//           {addresses.length === 0 ? (
//             <p className="text-gray-500">No addresses saved. Please add an address first.</p>
//           ) : (
//             <div className="space-y-2">
//               {addresses.map((addr) => (
//                 <label key={addr._id} className="flex items-start space-x-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="address"
//                     value={addr._id}
//                     checked={selectedAddressId === addr._id}
//                     onChange={(e) => setSelectedAddressId(e.target.value)}
//                     className="mt-1"
//                   />
//                   <div className="flex-1">
//                     {addr.isDefault && <span className="text-green-600 text-sm">Default</span>}
//                     <p className="font-semibold">{addr.name} - {addr.phone}</p>
//                     <p>{addr.house}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}</p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           )}
//           <button
//             onClick={() => setShowNewAddressForm(!showNewAddressForm)}
//             className="mt-2 text-blue-600 hover:underline"
//           >
//             {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
//           </button>
//           {showNewAddressForm && (
//             <div className="mt-4 p-4 border rounded">
//               <h4 className="font-semibold mb-2">Add New Address</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={newAddress.name}
//                   onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
//                   className="border p-2 rounded"
//                   required
//                 />
//                 <input
//                   type="tel"
//                   placeholder="Phone"
//                   value={newAddress.phone}
//                   onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
//                   className="border p-2 rounded"
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="Pincode"
//                   value={newAddress.pincode}
//                   onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
//                   className="border p-2 rounded"
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="House No."
//                   value={newAddress.house}
//                   onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
//                   className="border p-2 rounded"
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="Area/Road"
//                   value={newAddress.area}
//                   onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
//                   className="border p-2 rounded"
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={newAddress.city}
//                   onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
//                   className="border p-2 rounded"
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="State"
//                   value={newAddress.state}
//                   onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
//                   className="border p-2 rounded"
//                   required
//                 />
//               </div>
//               <label className="flex items-center mt-2">
//                 <input
//                   type="radio"
//                   name="address"
//                   value="new"
//                   checked={selectedAddressId === 'new'}
//                   onChange={(e) => setSelectedAddressId(e.target.value)}
//                   className="mr-2"
//                 />
//                 Use this new address
//               </label>
//             </div>
//           )}
//         </div>

//         {/* Payment Method */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
//           <div className="space-y-2">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="COD"
//                 checked={paymentMethod === 'COD'}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-2"
//               />
//               Cash on Delivery
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 value="Razorpay"
//                 checked={paymentMethod === 'Razorpay'}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="mr-2"
//               />
//               Online Payment (Razorpay)
//             </label>
//           </div>
//         </div>

//         {/* Coupon */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Coupon Code</h3>
//           <div className="flex">
//             <input
//               type="text"
//               placeholder="Enter coupon code"
//               value={coupon}
//               onChange={(e) => setCoupon(e.target.value)}
//               className="border p-2 rounded-l flex-1"
//             />
//             <button onClick={applyCoupon} className="bg-blue-600 text-white px-4 rounded-r">
//               Apply
//             </button>
//           </div>
//         </div>

//         {/* Price Summary */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
//           <div className="space-y-1">
//             <div className="flex justify-between">
//               <span>Subtotal:</span>
//               <span>${subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>GST (18%):</span>
//               <span>${gst.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery:</span>
//               <span>${delivery.toFixed(2)}</span>
//             </div>
//             {discount > 0 && (
//               <div className="flex justify-between text-green-600">
//                 <span>Discount:</span>
//                 <span>-${discount.toFixed(2)}</span>
//               </div>
//             )}
//             <hr />
//             <div className="flex justify-between font-bold">
//               <span>Total:</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end space-x-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded"
//             disabled={isProcessing}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleOrder}
//             className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
//             disabled={isProcessing}
//           >
//             {isProcessing ? 'Processing...' : 'Place Order'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutModal;

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
      setIsProcessing(false);
      setLoadingAddresses(false);
    }
  }, [isOpen, user]);

  // Load Razorpay script
  useEffect(() => {
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  const fetchAddresses = async () => {
    if (loadingAddresses) return;

    setLoadingAddresses(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data);
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
  const subtotal = items.reduce((sum, item) => {
    if (item.itemType === 'productPack') {
      let packPrice = Number(item.productId?.totalPrice) || 0;
      if (packPrice === 0) {
        const priceInRupee = Number(item.productId?.priceInRupee) || 0;
        const packQuantity = Number(item.productId?.quantity) || 1;
        const discount = Number(item.productId?.discount) || 0;
        const shippingPrice = Number(item.productId?.shippingPrice) || 0;
        packPrice = ((priceInRupee * packQuantity) - discount + shippingPrice);
      }
      return sum + (packPrice * (Number(item.quantity) || 1));
    } else {
      const price = Number(item.productId?.price) || 0;
      return sum + (price * (Number(item.quantity) || 1));
    }
  }, 0);
  const gst = subtotal * 0.18;
  const delivery = subtotal >= 499 ? 0 : 40;
  const discount = appliedDiscount;
  const total = Math.round((subtotal + gst + delivery - discount) * 100) / 100; // Round to 2 decimal places

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
        toast.success(`🎉 Coupon applied! ${data.discountPercentage}% off`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    }
  };

  const openRazorpayPopup = async (orderData) => {
    try {
      // Create order from backend
      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) }), // Convert to paise
      });

      const data = await res.json();
      if (!data.success) {
        toast.error('Failed to create payment order');
        return;
      }

      const order = data.order;

      // Custom Razorpay options with UPI-first configuration
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Ecom Store",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Save order
            const finalOrderData = {
              ...orderData,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentStatus: 'success',
            };

            const token = localStorage.getItem('token');
            await fetch("/api/payment/save-order", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(finalOrderData),
            });

            setIsProcessing(false);
            onOrderSuccess();
            onClose();
            window.location.href = '/success?type=payment';
          } else {
            setIsProcessing(false);
            toast.error("❌ Payment Verification Failed!");
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          order_type: "ecommerce_purchase",
        },
        theme: {
          color: "#4F46E5",
          backdrop_color: "#00000040"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
          animation: true,
          escape: true,
          backdropclose: true
        },
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true,
          emi: false
        },
        // UPI Apps configuration - Show these first
        upi: {
          flow: "collect",
          apps: ["google_pay", "phonepe", "paytm", "bhim", "amazon_pay"]
        },
        // Custom order for payment methods
        method_order: ["upi", "card", "netbanking", "wallet"],
        // Custom display for UPI apps
        _: {
          integration: "react",
          version: "1.0"
        }
      };

      // Open Razorpay with custom configuration
      const rzp = new window.Razorpay(options);
      
      // Customize the modal before opening
      rzp.on('payment.loaded', function(response) {
        // Force UPI as default tab
        setTimeout(() => {
          const upiTab = document.querySelector('[data-method="upi"]');
          if (upiTab) {
            upiTab.click();
          }
        }, 100);
      });

      rzp.open();

    } catch (error) {
      console.error('Razorpay error:', error);
      toast.error('❌ Payment initialization failed');
      setIsProcessing(false);
    }
  };

  const handleOrder = async () => {
    if (isProcessing) return;

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

    // Prepare order data
    const orderData = {
      userId: user.id,
      items: items.map(item => ({
        itemId: item.itemId || item.productId._id,
        itemType: item.itemType || 'product',
        quantity: item.quantity,
        price: item.itemType === 'productPack'
          ? (() => {
              let packPrice = Number(item.productId?.totalPrice) || 0;
              if (packPrice === 0) {
                const priceInRupee = Number(item.productId?.priceInRupee) || 0;
                const packQuantity = Number(item.productId?.quantity) || 1;
                const discount = Number(item.productId?.discount) || 0;
                const shippingPrice = Number(item.productId?.shippingPrice) || 0;
                packPrice = ((priceInRupee * packQuantity) - discount + shippingPrice);
              }
              return packPrice;
            })()
          : (item.productId?.price || 0),
        quantity: item.quantity || 1,
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

    if (paymentMethod === 'Razorpay') {
      await openRazorpayPopup(orderData);
      return;
    }

    // Handle COD order
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
        onOrderSuccess();
        onClose();
        window.location.href = '/success?type=order';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          <p className="text-blue-100 mt-2">Review your items and delivery details</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Details */}
            <div className="space-y-6">
              {/* Product Summary */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🛒</span>
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id || item.productId._id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                      <img
                        src={
                          item.itemType === 'productPack'
                            ? (item.productId.productId?.images?.[0] || 'https://via.placeholder.com/150x150?text=Pack')
                            : (item.productId.images?.[0] || 'https://via.placeholder.com/150x150?text=Product')
                        }
                        alt={
                          item.itemType === 'productPack'
                            ? (item.productId?.productName || 'Product Pack')
                            : (item.productId?.name || 'Product')
                        }
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {item.itemType === 'productPack' ? (item.productId?.productName || 'Product Pack') : (item.productId?.name || 'Product')}
                        </h4>
                        {item.itemType === 'productPack' && (
                          <p className="text-sm text-blue-600">
                            Pack of {item.productId?.quantity || 1} × {item.productId?.weightInLiter || 'N/A'}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-semibold text-gray-800">
                            ₹{item.itemType === 'productPack'
                              ? (() => {
                                  let packPrice = Number(item.productId?.totalPrice) || 0;
                                  if (packPrice === 0) {
                                    const priceInRupee = Number(item.productId?.priceInRupee) || 0;
                                    const packQuantity = Number(item.productId?.quantity) || 1;
                                    const discount = Number(item.productId?.discount) || 0;
                                    const shippingPrice = Number(item.productId?.shippingPrice) || 0;
                                    packPrice = ((priceInRupee * packQuantity) - discount + shippingPrice);
                                  }
                                  return (packPrice * (Number(item.quantity) || 1)).toFixed(2);
                                })()
                              : ((Number(item.productId?.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Selection */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📍</span>
                  Delivery Address
                </h3>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No addresses saved</p>
                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {addresses.map((addr) => (
                      <label key={addr._id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="radio"
                          name="address"
                          value={addr._id}
                          checked={selectedAddressId === addr._id}
                          onChange={(e) => setSelectedAddressId(e.target.value)}
                          className="mt-1 text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{addr.phone}</p>
                          <p className="text-gray-600 text-sm">
                            {addr.house}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="w-full mt-4 bg-white border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  {showNewAddressForm ? 'Cancel New Address' : 'Add New Address'}
                </button>

                {showNewAddressForm && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Add New Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode *"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="House/Building No. *"
                        value={newAddress.house}
                        onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Area/Street *"
                        value={newAddress.area}
                        onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="City *"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                        required
                      />
                    </div>
                    <label className="flex items-center mt-3 p-2 bg-blue-50 rounded-lg">
                      <input
                        type="radio"
                        name="address"
                        value="new"
                        checked={selectedAddressId === 'new'}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-blue-700 font-medium">Use this new address</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Payment & Summary */}
            <div className="space-y-6">
              {/* Payment Method */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💳</span>
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${paymentMethod === 'COD' ? 'bg-blue-600' : 'bg-transparent'}`} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Cash on Delivery</span>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${paymentMethod === 'Razorpay' ? 'bg-blue-600' : 'bg-transparent'}`} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Online Payment</span>
                        <p className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-xs text-white">UPI</div>
                      <div className="w-8 h-5 bg-green-500 rounded flex items-center justify-center text-xs text-white">Card</div>
                      <div className="w-8 h-5 bg-purple-500 rounded flex items-center justify-center text-xs text-white">Net</div>
                    </div>
                    <input
                      type="radio"
                      value="Razorpay"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* External Purchase Links */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🛍️</span>
                  Alternative Purchase Options
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Compare prices and buy from other platforms
                </p>
                <div className="space-y-3">
                  {items.map((item) => {
                    const product = item.itemType === 'productPack' ? item.productId?.productId : item.productId;
                    const externalLinks = product?.externalLinks || [];

                    if (externalLinks.length === 0) return null;

                    return (
                      <div key={item._id || item.productId._id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          {item.itemType === 'productPack' ? (item.productId?.productName || 'Product Pack') : (item.productId?.name || 'Product')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {externalLinks.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                link.platform === 'amazon'
                                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                  : link.platform === 'flipkart'
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                  : 'bg-gray-500 hover:bg-gray-600 text-white'
                              }`}
                            >
                              {link.platform === 'amazon' && <span>🛒</span>}
                              {link.platform === 'flipkart' && <span>📦</span>}
                              {link.platform === 'other' && <span>🛍️</span>}
                              Purchase from {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                              {link.price && (
                                <span className="text-sm opacity-90">
                                  (₹{link.price})
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {items.every(item => {
                    const product = item.itemType === 'productPack' ? item.productId?.productId : item.productId;
                    return !product?.externalLinks || product.externalLinks.length === 0;
                  }) && (
                    <div className="text-center py-6 text-gray-500">
                      <p>No alternative purchase links available for these products</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🎫</span>
                  Apply Coupon
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      ✅ Coupon Applied! You saved ₹{appliedDiscount.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💰</span>
                  Price Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleOrder}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'COD' ? 'Place Order (COD)' : 'Pay Now'}
                        <span>₹{total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;