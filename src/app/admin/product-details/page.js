'use client';

import { useState, useEffect } from 'react';
import { getUserFromToken } from '../../../lib/getUser';

const ProductDetailsAdmin = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [formData, setFormData] = useState({
    about: '',
    info: '',
    gradients: [''],
    additionalImages: [''],
    poweredBy: '',
    opinion: '',
  });
  const [uploadingImages, setUploadingImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);

    if (currentUser?.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      return;
    }

    fetchProducts();
    fetchProductDetails();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/productDetails/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await fetch('/api/productDetails');
      const data = await response.json();
      if (data.success) {
        setProductDetails(data.productDetails);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    // Reset form when product changes
    setFormData({
      about: '',
      info: '',
      gradients: [''],
      additionalImages: [''],
      poweredBy: '',
      opinion: '',
    });
    setEditingId(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    setIsLoading(true);
    try {
      const selectedProductData = products.find(p => p.id === selectedProduct);
      const payload = {
        productType: selectedProductData.type,
        productId: selectedProduct,
        ...formData,
      };

      const url = editingId ? `/api/productDetails/${editingId}` : '/api/productDetails';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert(editingId ? 'Product details updated successfully!' : 'Product details created successfully!');
        fetchProductDetails();
        // Reset form
        setSelectedProduct('');
        setFormData({
          about: '',
          info: '',
          gradients: [''],
          additionalImages: [''],
          poweredBy: '',
          opinion: '',
        });
        setEditingId(null);
      } else {
        alert(data.error || 'Failed to save product details');
      }
    } catch (error) {
      console.error('Error saving product details:', error);
      alert('Failed to save product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (detail) => {
    setSelectedProduct(detail.productId._id || detail.productId);
    setFormData({
      about: detail.about,
      info: detail.info,
      gradients: detail.gradients.length > 0 ? detail.gradients : [''],
      additionalImages: detail.additionalImages.length > 0 ? detail.additionalImages : [''],
      poweredBy: detail.poweredBy,
      opinion: detail.opinion,
    });
    setEditingId(detail._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete these product details?')) return;

    try {
      const response = await fetch(`/api/productDetails/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Product details deleted successfully!');
        fetchProductDetails();
      } else {
        alert(data.error || 'Failed to delete product details');
      }
    } catch (error) {
      console.error('Error deleting product details:', error);
      alert('Failed to delete product details');
    }
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;

    setUploadingImages(prev => ({ ...prev, [index]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/productDetails/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        handleArrayInputChange('additionalImages', index, data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Details Management</h1>
          <p className="mt-2 text-gray-600">Add detailed information for products and product packs</p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Product Details' : 'Add New Product Details'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product *
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.type === 'single' ? 'Single Product' : 'Product Pack'}) - ₹{product.price}
                  </option>
                ))}
              </select>
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Product *
              </label>
              <textarea
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Detailed description about the product..."
                required
              />
            </div>

            {/* Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Information *
              </label>
              <textarea
                value={formData.info}
                onChange={(e) => handleInputChange('info', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Additional product information..."
                required
              />
            </div>

            {/* Gradients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradients Used *
              </label>
              {formData.gradients.map((gradient, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={gradient}
                    onChange={(e) => handleArrayInputChange('gradients', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., from-emerald-500 to-amber-500"
                    required
                  />
                  {formData.gradients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('gradients', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('gradients')}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
              >
                Add Gradient
              </button>
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images *
              </label>
              {formData.additionalImages.map((image, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], index)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={uploadingImages[index]}
                    />
                    {formData.additionalImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('additionalImages', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {image && (
                    <div className="mt-2">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}

                  {/* Upload Status */}
                  {uploadingImages[index] && (
                    <div className="mt-2 text-sm text-blue-600">
                      Uploading...
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('additionalImages')}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
              >
                Add Image
              </button>
            </div>

            {/* Powered By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Powered By *
              </label>
              <input
                type="text"
                value={formData.poweredBy}
                onChange={(e) => handleInputChange('poweredBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Natural Herbs, Ayurvedic Extracts"
                required
              />
            </div>

            {/* Opinion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Opinion *
              </label>
              <textarea
                value={formData.opinion}
                onChange={(e) => handleInputChange('opinion', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your professional opinion about this product..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (editingId ? 'Update Details' : 'Save Details')}
            </button>
          </form>
        </div>

        {/* Existing Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Product Details</h2>

          {productDetails.length === 0 ? (
            <p className="text-gray-500">No product details found.</p>
          ) : (
            <div className="space-y-4">
              {productDetails.map((detail) => (
                <div key={detail._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {detail.productId?.name || detail.productId?.productName || 'Unknown Product'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Type: {detail.productType === 'single' ? 'Single Product' : 'Product Pack'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(detail)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(detail._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>About:</strong>
                      <p className="mt-1 text-gray-700">{detail.about}</p>
                    </div>
                    <div>
                      <strong>Info:</strong>
                      <p className="mt-1 text-gray-700">{detail.info}</p>
                    </div>
                    <div>
                      <strong>Powered By:</strong>
                      <p className="mt-1 text-gray-700">{detail.poweredBy}</p>
                    </div>
                    <div>
                      <strong>Gradients:</strong>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {detail.gradients.map((gradient, idx) => (
                          <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {gradient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <strong>Opinion:</strong>
                    <p className="mt-1 text-gray-700">{detail.opinion}</p>
                  </div>

                  <div className="mt-4">
                    <strong>Additional Images:</strong>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {detail.additionalImages.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Additional ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsAdmin;