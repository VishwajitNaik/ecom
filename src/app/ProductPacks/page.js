'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

const ProductPacksPage = () => {
  const [productPacks, setProductPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const packsRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    fetchProductPacks();
  }, []);

  useEffect(() => {
    if (!loading && productPacks.length > 0 && containerRef.current && !hasAnimatedRef.current) {
      setTimeout(() => {
        animatePacks();
      }, 100);
    }
  }, [loading, productPacks]);

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

  const animatePacks = () => {
    const pageTitle = document.querySelector('.page-title');
    const packCards = document.querySelectorAll('.pack-card');
    
    const tl = gsap.timeline();
    
    if (pageTitle) {
      tl.fromTo(pageTitle,
        {
          y: -50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      );
    }

    if (packCards.length > 0) {
      tl.fromTo(packCards,
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out"
        },
        pageTitle ? "-=0.4" : "+=0"
      );
    }

    hasAnimatedRef.current = true;
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
        
        // Animate removal
        const packElement = document.querySelector(`[data-pack-id="${id}"]`);
        if (packElement) {
          gsap.to(packElement, {
            scale: 0.8,
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
              fetchProductPacks();
            }
          });
        } else {
          fetchProductPacks();
        }
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete product pack');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product packs...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="page-title text-2xl lg:text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Packs & Bundles
          </h1>
          <p className="text-gray-600 text-sm lg:text-base max-w-2xl mx-auto">
            Manage your product packs and special bundles for customers
          </p>
        </div>

        {/* Add Product Pack Button */}
        <div className="flex justify-between items-center mb-6 lg:mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
            Available Packs ({productPacks.length})
          </h2>
          <Link
            href="/ProductPacks/add"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product Pack
          </Link>
        </div>

        {productPacks.length === 0 ? (
          <div className="text-center py-12 lg:py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">No product packs found</h3>
            <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
              Create your first product pack to offer bundled products to customers
            </p>
            <Link
              href="/ProductPacks/add"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 lg:px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create First Pack
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {productPacks.map((pack, index) => (
              <div 
                key={pack._id}
                data-pack-id={pack._id}
                className="pack-card rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ opacity: hasAnimatedRef.current ? 1 : 0 }}
              >
                {/* Pack Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                          {pack.productName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {pack.typeOfPack?.charAt(0)?.toUpperCase() + pack.typeOfPack?.slice(1) || 'Standard'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Product Image and Info */}
                  <div className="flex items-start gap-4 mb-6">
                    {pack.productId?.images?.[0] && (
                      <div className="relative">
                        <img
                          src={pack.productId.images[0]}
                          alt={pack.productId.name}
                          className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTIyIDIySDQyVjQySDIyVjIyWiIgZmlsbD0iI0Y5RkFGRiIvPgo8L3N2Zz4K';
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Pack
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Based on product:</p>
                      <p className="font-semibold text-gray-800 text-sm lg:text-base">
                        {pack.productId?.name || 'Unknown Product'}
                      </p>
                    </div>
                  </div>

                  {/* Pack Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{pack.quantity || 1}</div>
                      <div className="text-xs text-gray-600 font-medium">Packs</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{pack.dayOfDose}</div>
                      <div className="text-xs text-gray-600 font-medium">Days</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-600 mb-1">{pack.usePerDay}</div>
                      <div className="text-xs text-gray-600 font-medium">Use/Day</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-orange-600 mb-1">{pack.weightInLiter}</div>
                      <div className="text-xs text-gray-600 font-medium">Size</div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Unit Price:</span>
                      {(pack.discount || 0) > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-gray-400">₹{pack.priceInRupee?.toFixed(2)}</span>
                          <span className="text-green-600 font-semibold">
                            ₹{(pack.priceInRupee - ((pack.discount || 0) / (pack.quantity || 1)))?.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold">₹{pack.priceInRupee?.toFixed(2)}</span>
                      )}
                    </div>

                    {(pack.discount || 0) > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-green-600 font-semibold">
                          -₹{(pack.discount || 0)?.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold">₹{pack.shippingPrice?.toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">Total Price:</span>
                        <span className="text-xl font-bold text-blue-600">
                          ₹{((pack.priceInRupee * (pack.quantity || 1)) - (pack.discount || 0) + pack.shippingPrice)?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => deleteProductPack(pack._id)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Pack
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