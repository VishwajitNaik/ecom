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
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Addresses</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-center text-gray-500">No addresses saved yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address._id} className="bg-white p-4 rounded-lg shadow-md">
                  {address.isDefault && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                  )}
                  <p className="font-semibold">{address.name}</p>
                  <p>{address.phone}</p>
                  <p>{address.house}, {address.area}</p>
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="House No."
                      value={formData.house}
                      onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Area/Road"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="mr-2"
                      />
                      Set as default address
                    </label>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
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
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      {editingAddress ? 'Update' : 'Save'}
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