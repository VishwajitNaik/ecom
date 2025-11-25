'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../../Components/Navbar';

const CarouselPage = () => {
  const [carousels, setCarousels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    order: 0,
  });

  const fetchCarousels = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/carousel', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCarousels(data);
      }
    } catch (error) {
      toast.error('Failed to fetch carousels');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const token = localStorage.getItem('token');
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingCarousel ? `/api/carousel/${editingCarousel._id}` : '/api/carousel';
    const method = editingCarousel ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingCarousel ? 'Carousel updated' : 'Carousel added');
        fetchCarousels();
        setShowForm(false);
        setEditingCarousel(null);
        setFormData({
          title: '',
          description: '',
          image: '',
          link: '',
          order: 0,
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to save carousel');
    }
  };

  const handleEdit = (carousel) => {
    setEditingCarousel(carousel);
    setFormData({
      title: carousel.title,
      description: carousel.description,
      image: carousel.image,
      link: carousel.link,
      order: carousel.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Carousel deleted');
        fetchCarousels();
      } else {
        toast.error('Failed to delete carousel');
      }
    } catch (error) {
      toast.error('Failed to delete carousel');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 text-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Carousel</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Slide
            </button>
          </div>

          {carousels.length === 0 ? (
            <p className="text-center text-gray-500">No carousel slides created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carousels.map((carousel) => (
                <div key={carousel._id} className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={carousel.image}
                    alt={carousel.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">{carousel.title}</h3>
                  <p className="text-gray-600 mb-2">{carousel.description}</p>
                  {carousel.link && (
                    <p className="text-blue-600 text-sm mb-2">Link: {carousel.link}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-4">Order: {carousel.order}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(carousel)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(carousel._id)}
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
                  {editingCarousel ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="w-full p-2 border rounded"
                      />
                      {uploading && <p className="text-blue-600 mt-1">Uploading...</p>}
                      {formData.image && (
                        <div className="mt-2">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-32 h-24 object-cover border rounded"
                          />
                        </div>
                      )}
                    </div>
                    <input
                      type="url"
                      placeholder="Link (optional)"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Order"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingCarousel(null);
                        setFormData({
                          title: '',
                          description: '',
                          image: '',
                          link: '',
                          order: 0,
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
                      {editingCarousel ? 'Update' : 'Save'}
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

export default CarouselPage;