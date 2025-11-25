'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const inputRefs = useRef([]);
  const imagePreviewRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();
    
    // Container entrance
    tl.fromTo(containerRef.current,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }
    );

    // Form entrance
    tl.fromTo(formRef.current,
      {
        opacity: 0,
        scale: 0.9
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );

    // Input fields staggered animation
    tl.fromTo(inputRefs.current,
      {
        opacity: 0,
        x: -30,
        y: 20
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      },
      "-=0.3"
    );

  }, []);

  const addToInputRefs = (el, index) => {
    if (el && !inputRefs.current.includes(el)) {
      inputRefs.current[index] = el;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Input focus animation
    const input = e.target;
    gsap.to(input, {
      scale: 1.02,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
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
        
        // Image preview animation
        if (imagePreviewRef.current) {
          gsap.fromTo('.image-preview-item',
            {
              opacity: 0,
              scale: 0.8,
              rotation: -10
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "back.out(1.7)"
            }
          );
        }
      }
    } catch (error) {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    // Remove animation
    const imageElement = document.querySelector(`[data-image-index="${index}"]`);
    if (imageElement) {
      gsap.to(imageElement, {
        opacity: 0,
        scale: 0,
        rotation: 45,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setImages(images.filter((_, i) => i !== index));
        }
      });
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    // Submit button animation
    const submitBtn = e.target.querySelector('button[type="submit"]');
    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.inOut"
    });

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
        
        // Success animation
        gsap.to(formRef.current, {
          backgroundColor: '#10b981',
          color: 'white',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });

        // Reset form with animation
        setTimeout(() => {
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
          
          // Reset animation
          gsap.to(formRef.current, {
            backgroundColor: 'white',
            color: 'inherit',
            duration: 0.5
          });
        }, 1000);
      } else {
        toast.error(result.error);
        
        // Error animation
        gsap.to(formRef.current, {
          backgroundColor: '#ef4444',
          color: 'white',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      }
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setIsSubmitting(false);
      gsap.to(submitBtn, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4"
      style={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Add New Product
          </h1>
          <p className="text-gray-600 text-lg">
            Fill in the details below to add a new product to your store
          </p>
        </div>

        {/* Form Container */}
        <div 
          ref={formRef}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ opacity: 0 }}
        >
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Product Name *
                  </label>
                  <input
                    ref={(el) => addToInputRefs(el, 0)}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                    placeholder="Enter product name"
                    style={{ opacity: 0 }}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    ref={(el) => addToInputRefs(el, 1)}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none resize-none"
                    placeholder="Describe your product..."
                    style={{ opacity: 0 }}
                  />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        ref={(el) => addToInputRefs(el, 2)}
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0"
                        className="w-full p-4 pl-10 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                        placeholder="0.00"
                        style={{ opacity: 0 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Stock
                    </label>
                    <input
                      ref={(el) => addToInputRefs(el, 3)}
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                      placeholder="Quantity"
                      style={{ opacity: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Category *
                  </label>
                  <input
                    ref={(el) => addToInputRefs(el, 4)}
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                    placeholder="Product category"
                    style={{ opacity: 0 }}
                  />
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Manufactured Date *
                    </label>
                    <input
                      ref={(el) => addToInputRefs(el, 5)}
                      type="date"
                      name="manufacturedDate"
                      value={formData.manufacturedDate}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                      style={{ opacity: 0 }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Expiry Date *
                    </label>
                    <input
                      ref={(el) => addToInputRefs(el, 6)}
                      type="date"
                      name="expireDate"
                      value={formData.expireDate}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                      style={{ opacity: 0 }}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Product Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all duration-300 hover:bg-blue-50">
                    <input
                      ref={(el) => addToInputRefs(el, 7)}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="image-upload"
                      style={{ opacity: 0 }}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 font-medium">
                          {uploading ? 'Uploading...' : 'Click to upload images'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div ref={imagePreviewRef} className="mt-4">
                      <p className="text-sm text-gray-600 mb-3 font-medium">
                        {images.length} image(s) uploaded
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {images.map((img, index) => (
                          <div
                            key={index}
                            data-image-index={index}
                            className="image-preview-item relative group"
                          >
                            <img
                              src={img}
                              alt={`Uploaded ${index + 1}`}
                              className="w-20 h-20 object-cover border-2 border-gray-200 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 shadow-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Product...</span>
                  </div>
                ) : (
                  'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            * Required fields. Make sure all information is accurate before submitting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;

// 'use client';

// import React, { useState } from 'react';
// import toast from 'react-hot-toast';

// const AddProductPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     stock: '',
//     manufacturedDate: '',
//     expireDate: '',
//   });
//   const [images, setImages] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     setUploading(true);
//     const token = localStorage.getItem('token');
//     const uploadedUrls = [];

//     try {
//       for (const file of files) {
//         const formDataUpload = new FormData();
//         formDataUpload.append('image', file);

//         const res = await fetch('/api/products/upload', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//           body: formDataUpload,
//         });

//         const data = await res.json();
//         if (data.url) {
//           uploadedUrls.push(data.url);
//         } else {
//           toast.error(`Failed to upload ${file.name}`);
//         }
//       }

//       if (uploadedUrls.length > 0) {
//         setImages((prev) => [...prev, ...uploadedUrls]);
//         toast.success(`Uploaded ${uploadedUrls.length} image(s)`);
//       }
//     } catch (error) {
//       toast.error('Upload error');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (images.length === 0) {
//       toast.error('Please upload at least one image');
//       return;
//     }
//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch('/api/products/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           images,
//           price: parseFloat(formData.price),
//           stock: parseInt(formData.stock),
//           manufacturedDate: new Date(formData.manufacturedDate),
//           expireDate: new Date(formData.expireDate),
//         }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         toast.success('Product added successfully');
//         setFormData({
//           name: '',
//           description: '',
//           price: '',
//           category: '',
//           stock: '',
//           manufacturedDate: '',
//           expireDate: '',
//         });
//         setImages([]);
//       } else {
//         toast.error(result.error);
//       }
//     } catch (error) {
//       toast.error('Failed to add product');
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Add Medical Product</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Price</label>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             required
//             step="0.01"
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Upload Images</label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageUpload}
//             disabled={uploading}
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//           {uploading && <p className="text-blue-600 mt-1">Uploading...</p>}
//           {images.length > 0 && (
//             <div className="mt-2">
//               <p className="text-sm text-gray-600 mb-2">{images.length} image(s) uploaded</p>
//               <div className="flex flex-wrap gap-2">
//                 {images.map((img, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={img}
//                       alt={`Uploaded ${index + 1}`}
//                       className="w-20 h-20 object-cover border rounded"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setImages(images.filter((_, i) => i !== index))}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Stock</label>
//           <input
//             type="number"
//             name="stock"
//             value={formData.stock}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Manufactured Date</label>
//           <input
//             type="date"
//             name="manufacturedDate"
//             value={formData.manufacturedDate}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Expire Date</label>
//           <input
//             type="date"
//             name="expireDate"
//             value={formData.expireDate}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Add Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProductPage;