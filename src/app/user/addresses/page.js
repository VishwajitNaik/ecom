// 'use client';

// import { useState, useEffect } from 'react';
// import { getUserFromToken } from '../../../lib/getUser';
// import toast from 'react-hot-toast';
// import Navbar from '../../../Components/Navbar';

// const AddressesPage = () => {
//   const [addresses, setAddresses] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     pincode: '',
//     house: '',
//     area: '',
//     city: '',
//     state: '',
//     isDefault: false,
//   });
//   const [user, setUser] = useState(null);

//   const fetchAddresses = async () => {
//     if (!user) return;
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch('/api/addresses', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setAddresses(data);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch addresses');
//     }
//   };

//   useEffect(() => {
//     const currentUser = getUserFromToken();
//     setUser(currentUser);
//   }, []);

//   useEffect(() => {
//     if (user) {
//       fetchAddresses();
//     }
//   }, [user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const url = editingAddress ? `/api/addresses/${editingAddress._id}` : '/api/addresses';
//     const method = editingAddress ? 'PUT' : 'POST';

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ ...formData, userId: user.id }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(editingAddress ? 'Address updated' : 'Address added');
//         fetchAddresses();
//         setShowForm(false);
//         setEditingAddress(null);
//         setFormData({
//           name: '',
//           phone: '',
//           pincode: '',
//           house: '',
//           area: '',
//           city: '',
//           state: '',
//           isDefault: false,
//         });
//       } else {
//         toast.error(data.error);
//       }
//     } catch (error) {
//       toast.error('Failed to save address');
//     }
//   };

//   const handleEdit = (address) => {
//     setEditingAddress(address);
//     setFormData({
//       name: address.name,
//       phone: address.phone,
//       pincode: address.pincode,
//       house: address.house,
//       area: address.area,
//       city: address.city,
//       state: address.state,
//       isDefault: address.isDefault,
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch(`/api/addresses/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       if (res.ok) {
//         toast.success('Address deleted');
//         fetchAddresses();
//       } else {
//         toast.error('Failed to delete address');
//       }
//     } catch (error) {
//       toast.error('Failed to delete address');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8 text-gray-800">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">My Addresses</h1>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Add New Address
//             </button>
//           </div>

//           {addresses.length === 0 ? (
//             <p className="text-center text-gray-500">No addresses saved yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {addresses.map((address) => (
//                 <div key={address._id} className="bg-white p-4 rounded-lg shadow-md">
//                   {address.isDefault && (
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
//                   )}
//                   <p className="font-semibold">{address.name}</p>
//                   <p>{address.phone}</p>
//                   <p>{address.house}, {address.area}</p>
//                   <p>{address.city}, {address.state} - {address.pincode}</p>
//                   <div className="mt-4 flex space-x-2">
//                     <button
//                       onClick={() => handleEdit(address)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(address._id)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {showForm && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-lg max-w-md w-full">
//                 <h2 className="text-xl font-bold mb-4">
//                   {editingAddress ? 'Edit Address' : 'Add New Address'}
//                 </h2>
//                 <form onSubmit={handleSubmit}>
//                   <div className="space-y-4">
//                     <input
//                       type="text"
//                       placeholder="Full Name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="tel"
//                       placeholder="Phone"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="Pincode"
//                       value={formData.pincode}
//                       onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="House No."
//                       value={formData.house}
//                       onChange={(e) => setFormData({ ...formData, house: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="Area/Road"
//                       value={formData.area}
//                       onChange={(e) => setFormData({ ...formData, area: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="City"
//                       value={formData.city}
//                       onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <input
//                       type="text"
//                       placeholder="State"
//                       value={formData.state}
//                       onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                       className="w-full p-2 border rounded"
//                       required
//                     />
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={formData.isDefault}
//                         onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
//                         className="mr-2"
//                       />
//                       Set as default address
//                     </label>
//                   </div>
//                   <div className="flex justify-end space-x-4 mt-6">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowForm(false);
//                         setEditingAddress(null);
//                         setFormData({
//                           name: '',
//                           phone: '',
//                           pincode: '',
//                           house: '',
//                           area: '',
//                           city: '',
//                           state: '',
//                           isDefault: false,
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
//                       {editingAddress ? 'Update' : 'Save'}
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

// export default AddressesPage;

'use client';

import { useState, useEffect } from 'react';
import { getUserFromToken } from '../../../lib/getUser';
import toast from 'react-hot-toast';
import Navbar from '../../../Components/Navbar';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    house: '',
    area: '',
    city: '',
    state: '',
    isDefault: false,
  });
  const [user, setUser] = useState(null);

  const fetchAddresses = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data);
      }
    } catch (error) {
      toast.error('Failed to fetch addresses');
    }
  };

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingAddress ? `/api/addresses/${editingAddress._id}` : '/api/addresses';
    const method = editingAddress ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingAddress ? 'Address updated' : 'Address added');
        fetchAddresses();
        setShowForm(false);
        setEditingAddress(null);
        setFormData({
          name: '',
          phone: '',
          pincode: '',
          house: '',
          area: '',
          city: '',
          state: '',
          isDefault: false,
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      pincode: address.pincode,
      house: address.house,
      area: address.area,
      city: address.city,
      state: address.state,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Address deleted');
        fetchAddresses();
      } else {
        toast.error('Failed to delete address');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br -mt-5 pt-5 from-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-3 lg:px-4 text-gray-800 py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Addresses
            </h1>
            <p className="text-gray-600 text-sm lg:text-base max-w-2xl mx-auto">
              Manage your delivery addresses for faster and smoother shopping experience
            </p>
          </div>

          {/* Add Address Button */}
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
              Saved Addresses ({addresses.length})
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add New Address</span>
              <span className="sm:hidden">Add Address</span>
            </button>
          </div>

          {/* Addresses Grid */}
          {addresses.length === 0 ? (
            <div className="text-center py-12 lg:py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">No addresses saved yet</h3>
              <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
                Add your first address to make checkout faster and easier.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 lg:px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {addresses.map((address) => (
                <div 
                  key={address._id} 
                  className={`bg-white rounded-xl shadow-lg border-2 p-4 lg:p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    address.isDefault ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {/* Default Badge */}
                  {address.isDefault && (
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full mb-4">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Default Address
                    </div>
                  )}
                  
                  {/* Address Details */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-800 text-lg">{address.name}</h3>
                      <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                        {address.phone}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>{address.house}, {address.area}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{address.city}, {address.state} - {address.pincode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-4 lg:mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-200 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Address Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-white/10 bg-blure-30 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingAddress(null);
                        setFormData({
                          name: '',
                          phone: '',
                          pincode: '',
                          house: '',
                          area: '',
                          city: '',
                          state: '',
                          isDefault: false,
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
                    {editingAddress ? 'Update your address details' : 'Fill in your address details for delivery'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* House No */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        House/Building No. *
                      </label>
                      <input
                        type="text"
                        placeholder="House/Building number"
                        value={formData.house}
                        onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area/Road *
                      </label>
                      <input
                        type="text"
                        placeholder="Area, Street, Road"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        <input
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-medium text-gray-800">Set as default address</span>
                          <p className="text-sm text-gray-600 mt-1">
                            This address will be selected by default for all your orders
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingAddress(null);
                        setFormData({
                          name: '',
                          phone: '',
                          pincode: '',
                          house: '',
                          area: '',
                          city: '',
                          state: '',
                          isDefault: false,
                        });
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddressesPage;