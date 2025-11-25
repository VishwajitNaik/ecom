'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const AddProductPackPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    typeOfPack: '',
    dayOfDose: '',
    weightInLiter: '',
    priceInRupee: '',
    shippingPrice: '',
    usePerDay: '',
    quantity: 1,
    discount: 0,
    productId: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/productPacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          dayOfDose: parseInt(formData.dayOfDose),
          priceInRupee: parseFloat(formData.priceInRupee),
          shippingPrice: parseFloat(formData.shippingPrice),
          quantity: parseInt(formData.quantity) || 1,
          discount: parseFloat(formData.discount) || 0,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product pack added successfully');
        router.push('/ProductPacks');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to add product pack');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Add Product Pack</h1>
            <Link
              href="/ProductPacks"
              className="text-blue-600 hover:underline"
            >
              Back to Product Packs
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Pack Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                placeholder="e.g., Vitamin D3 1000IU - 30 Day Pack"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type of Pack */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Pack
              </label>
              <select
                name="typeOfPack"
                value={formData.typeOfPack}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select pack type...</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
                <option value="strip">Strip</option>
                <option value="packet">Packet</option>
                <option value="sachet">Sachet</option>
                <option value="tube">Tube</option>
                <option value="jar">Jar</option>
                <option value="can">Can</option>
              </select>
            </div>

            {/* Weight in Liter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight/Volume
              </label>
              <select
                name="weightInLiter"
                value={formData.weightInLiter}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select size...</option>
                <option value="1">1 Liter</option>
                <option value="500ml">500ml</option>
                <option value="250ml">250ml</option>
                <option value="100ml">100ml</option>
              </select>
            </div>

            {/* Day of Dose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days of Dose
              </label>
              <input
                type="number"
                name="dayOfDose"
                value={formData.dayOfDose}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Use Per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Per Day
              </label>
              <select
                name="usePerDay"
                value={formData.usePerDay}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select frequency...</option>
                <option value="2 times">2 times</option>
                <option value="3 times">3 times</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (Number of Packs)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of individual packs in this bundle (e.g., 2 bottles for 3 months)
              </p>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (₹)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 50.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Discount applied for buying multiple packs (e.g., ₹50 off for 2 bottles)
              </p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="priceInRupee"
                value={formData.priceInRupee}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 299.99"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Shipping Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Price (₹)
              </label>
              <input
                type="number"
                name="shippingPrice"
                value={formData.shippingPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 50.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Product Pack
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPackPage;