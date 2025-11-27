'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

const AddProductPackPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!hasAnimatedRef.current && containerRef.current) {
      const tl = gsap.timeline();
      
      // Background elements animation
      tl.fromTo('.bg-shape-1',
        { x: -100, y: -100, opacity: 0, rotation: -45 },
        { x: 0, y: 0, opacity: 0.3, rotation: 0, duration: 1, ease: "power2.out" }
      );
      
      tl.fromTo('.bg-shape-2',
        { x: 100, y: 100, opacity: 0, rotation: 45 },
        { x: 0, y: 0, opacity: 0.2, rotation: 0, duration: 1, ease: "power2.out" },
        "-=0.8"
      );

      // Form container animation
      tl.fromTo(formRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        },
        "-=0.5"
      );

      // Form elements stagger animation
      tl.fromTo('.form-element',
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out"
        },
        "-=0.3"
      );

      hasAnimatedRef.current = true;
    }
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
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
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
        // Success animation
        gsap.to(formRef.current, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
        
        toast.success('Product pack created successfully!');
        setTimeout(() => {
          router.push('/ProductPacks');
        }, 1500);
      } else {
        // Error shake animation
        gsap.to(formRef.current, {
          x: 10,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: "power1.inOut"
        });
        toast.error(data.error || 'Failed to create product pack');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen text-gray-800 bg-gradient-to-br from-orange-50 via-white to-amber-50 relative overflow-hidden"
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-shape-1 absolute -top-20 -left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="bg-shape-2 absolute -bottom-20 -right-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Form Container */}
          <div 
            ref={formRef}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 hover:shadow-3xl"
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create Product Pack</h1>
              <p className="text-orange-100 text-sm">Bundle products together for better value</p>
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex justify-between items-center mb-6">
                <Link
                  href="/ProductPacks"
                  className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Product Packs
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Selection */}
                <div className="form-element lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Base Product *
                  </label>
                  <div className="relative">
                    <select
                      name="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm appearance-none"
                    >
                      <option value="">Choose a product to bundle...</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div className="form-element lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Pack Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Vitamin D3 1000IU - 30 Day Wellness Pack"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>

                {/* Type of Pack */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pack Type *
                  </label>
                  <div className="relative">
                    <select
                      name="typeOfPack"
                      value={formData.typeOfPack}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm appearance-none"
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
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Weight/Volume */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Size/Volume *
                  </label>
                  <div className="relative">
                    <select
                      name="weightInLiter"
                      value={formData.weightInLiter}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm appearance-none"
                    >
                      <option value="">Select size...</option>
                      <option value="1">1 Liter</option>
                      <option value="500ml">500ml</option>
                      <option value="250ml">250ml</option>
                      <option value="100ml">100ml</option>
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Day of Dose */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    name="dayOfDose"
                    value={formData.dayOfDose}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 30"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>

                {/* Use Per Day */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usage Frequency *
                  </label>
                  <div className="relative">
                    <select
                      name="usePerDay"
                      value={formData.usePerDay}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm appearance-none"
                    >
                      <option value="">Select frequency...</option>
                      <option value="2 times">2 times daily</option>
                      <option value="3 times">3 times daily</option>
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity (Packs) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Number of individual packs in this bundle
                  </p>
                </div>

                {/* Discount */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bundle Discount (₹)
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
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Discount for buying multiple packs
                  </p>
                </div>

                {/* Price */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price per Pack (₹) *
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
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>

                {/* Shipping Price */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shipping Price (₹) *
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
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                  />
                </div>

                {/* Submit Button */}
                <div className="form-element lg:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Pack...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Product Pack
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Note */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Create attractive bundles to increase customer value
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.2; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AddProductPackPage;