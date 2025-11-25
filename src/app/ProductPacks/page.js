'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ProductPacksPage = () => {
  const [productPacks, setProductPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductPacks();
  }, []);

  const fetchProductPacks = async () => {
    try {
      const res = await fetch('/api/productPacks');
      const data = await res.json();
      if (res.ok) {
        setProductPacks(data);
      } else {
        toast.error('Failed to fetch product packs');
      }
    } catch (error) {
      toast.error('Failed to fetch product packs');
    } finally {
      setLoading(false);
    }
  };

  const deleteProductPack = async (id) => {
    if (!confirm('Are you sure you want to delete this product pack?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/productPacks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product pack deleted successfully');
        fetchProductPacks();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete product pack');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Packs</h1>
          <Link
            href="/ProductPacks/add"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Product Pack
          </Link>
        </div>

        {productPacks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No product packs found.</p>
            <Link
              href="/ProductPacks/add"
              className="text-blue-600 hover:underline mt-4 inline-block"
            >
              Add your first product pack
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productPacks.map((pack) => (
              <div key={pack._id} className="bg-white rounded-lg shadow-md p-6">
                {/* Product Image and Pack Info */}
                <div className="flex items-start gap-4 mb-4">
                  {pack.productId?.images?.[0] && (
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={pack.productId.images[0]}
                        alt={pack.productId.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {pack.productName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Based on: <span className="font-medium text-blue-600">{pack.productId?.name || 'Unknown Product'}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{pack.typeOfPack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{pack.weightInLiter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days:</span>
                    <span>{pack.dayOfDose} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Use:</span>
                    <span>{pack.usePerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{pack.quantity} packs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    {(pack.discount || 0) > 0 ? (
                      <span className="line-through text-gray-500">₹{pack.priceInRupee.toFixed(2)}</span>
                    ) : (
                      <span>₹{pack.priceInRupee.toFixed(2)}</span>
                    )}
                  </div>
                  {(pack.discount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Discounted Price:</span>
                      <span className="text-green-600 font-medium">₹{(pack.priceInRupee - ((pack.discount || 0) / pack.quantity)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{pack.quantity || 1} × ₹{((pack.discount || 0) > 0 ? (pack.priceInRupee - ((pack.discount || 0) / pack.quantity)) : pack.priceInRupee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{((pack.priceInRupee * (pack.quantity || 1)) - (pack.discount || 0)).toFixed(2)}</span>
                  </div>
                  {(pack.discount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Applied:</span>
                      <span>-₹{(pack.discount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₹{pack.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-800 border-t pt-2">
                    <span>Final Total:</span>
                    <span>₹{((pack.priceInRupee * (pack.quantity || 1)) - (pack.discount || 0) + pack.shippingPrice).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => deleteProductPack(pack._id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPacksPage;