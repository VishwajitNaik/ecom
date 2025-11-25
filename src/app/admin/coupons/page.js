'use client';

import { useState, useEffect } from 'react';
import { getUserFromToken } from '../../../lib/getUser';
import toast from 'react-hot-toast';
import Navbar from '../../../Components/Navbar';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    expiryDate: '',
    usageLimit: '',
  });

  const user = getUserFromToken();

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

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        toast.success(editingCoupon ? 'Coupon updated' : 'Coupon added');
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
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to save coupon');
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
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Coupons</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Coupon
            </button>
          </div>

          {coupons.length === 0 ? (
            <p className="text-center text-gray-500">No coupons created yet.</p>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{coupon.code}</h3>
                      <p>Discount: {coupon.discountPercentage}%</p>
                      <p>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                      <p>Used: {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</p>
                      <p>Status: {coupon.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Discount Percentage"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                      className="w-full p-2 border rounded"
                      min="1"
                      max="100"
                      required
                    />
                    <input
                      type="date"
                      placeholder="Expiry Date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Usage Limit (optional)"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
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
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      {editingCoupon ? 'Update' : 'Save'}
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

export default CouponsPage;