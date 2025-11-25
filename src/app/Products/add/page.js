'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    manufacturedDate: '',
    expireDate: '',
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem('token');
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const res = await fetch('/api/products/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataUpload,
        });

        const data = await res.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        toast.success(`Uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (error) {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          images,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          manufacturedDate: new Date(formData.manufacturedDate),
          expireDate: new Date(formData.expireDate),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('Product added successfully');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          manufacturedDate: '',
          expireDate: '',
        });
        setImages([]);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Medical Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {uploading && <p className="text-blue-600 mt-1">Uploading...</p>}
          {images.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">{images.length} image(s) uploaded</p>
              <div className="flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Uploaded ${index + 1}`}
                      className="w-20 h-20 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Manufactured Date</label>
          <input
            type="date"
            name="manufacturedDate"
            value={formData.manufacturedDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Expire Date</label>
          <input
            type="date"
            name="expireDate"
            value={formData.expireDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;