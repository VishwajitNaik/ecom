'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
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

  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);
  const hasAnimatedRef = useRef(false);

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

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current || carousels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            const tl = gsap.timeline();
            
            // Header animation
            tl.fromTo('.page-header',
              {
                y: -50,
                opacity: 0
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.8)"
              }
            );

            // Cards animation
            tl.fromTo('.carousel-card',
              {
                y: 80,
                opacity: 0,
                scale: 0.9,
                rotationY: 15
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power3.out"
              },
              "-=0.4"
            );

            hasAnimatedRef.current = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [carousels.length]);

  // Form animation
  useEffect(() => {
    if (showForm && formRef.current) {
      gsap.fromTo(formRef.current,
        {
          scale: 0.8,
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [showForm]);

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
        toast.success('🎉 Image uploaded successfully!');
      } else {
        toast.error('❌ Upload failed');
      }
    } catch (error) {
      toast.error('❌ Upload error');
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
        toast.success(editingCarousel ? '✨ Carousel updated successfully!' : '🎉 Carousel added successfully!');
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
      toast.error('❌ Failed to save carousel');
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
    if (!confirm('Are you sure you want to delete this carousel slide?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('🗑️ Carousel deleted successfully!');
        fetchCarousels();
      } else {
        toast.error('❌ Failed to delete carousel');
      }
    } catch (error) {
      toast.error('❌ Failed to delete carousel');
    }
  };

  const closeForm = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setShowForm(false);
          setEditingCarousel(null);
          setFormData({
            title: '',
            description: '',
            image: '',
            link: '',
            order: 0,
          });
        }
      });
    } else {
      setShowForm(false);
      setEditingCarousel(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        link: '',
        order: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br -mt-5 pt-5 from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div ref={containerRef} className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 page-header">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Manage Carousel
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Create and manage beautiful carousel slides for your homepage
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Carousel Slides</h2>
              <p className="text-gray-600 mt-1">
                {carousels.length} slide{carousels.length !== 1 ? 's' : ''} created
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Slide
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Carousel Grid */}
          {carousels.length === 0 ? (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎠</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Carousel Slides Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating your first beautiful carousel slide to showcase your content.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create First Slide
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {carousels.map((carousel, index) => (
                <div 
                  key={carousel._id} 
                  className="carousel-card group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200"
                  ref={el => cardsRef.current[index] = el}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={carousel.image}
                      alt={carousel.title}
                      className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        Order: {carousel.order}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {carousel.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {carousel.description}
                    </p>
                    
                    {carousel.link && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500">Link:</span>
                        <a 
                          href={carousel.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm ml-2 truncate block"
                        >
                          {carousel.link}
                        </a>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(carousel)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(carousel._id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              ref={formRef}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-white/20"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white text-center">
                  {editingCarousel ? 'Edit Carousel Slide' : 'Create New Slide'}
                </h2>
                <p className="text-blue-100 text-center mt-2">
                  {editingCarousel ? 'Update your carousel slide' : 'Add a beautiful new slide to your carousel'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter slide title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter slide description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 mt-2 text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  )}
                  {formData.image && (
                    <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-green-700 text-sm font-medium mb-2">✅ Image uploaded successfully!</p>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    min="0"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {editingCarousel ? 'Update Slide' : 'Create Slide'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CarouselPage;