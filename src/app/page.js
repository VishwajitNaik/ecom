"use client";
// Home.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { getUserFromToken } from '../lib/getUser';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import AboutUs from '../Components/AboutUs';
import Services from '../Components/Services';
import Contact from '../Components/Contact';
import Product from '../Components/Product';
import CheckoutModal from '../Components/CheckoutModal';
import dynamic from 'next/dynamic';

const OtpLogin = dynamic(() => import('../Components/OtpLogin'), { ssr: false });

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [productPacks, setProductPacks] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      comment: "Excellent product quality! Fast delivery and great customer support. Highly recommended!",
      date: "2024-03-15",
      avatar: "👨"
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      comment: "Very satisfied with my purchase. The product works exactly as described. Will buy again!",
      date: "2024-03-10",
      avatar: "👩"
    },
    {
      id: 3,
      name: "Amit Patel",
      location: "Bangalore",
      rating: 4,
      comment: "Good quality product. Delivery was on time. Customer service is responsive.",
      date: "2024-03-05",
      avatar: "👨"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      location: "Hyderabad",
      rating: 5,
      comment: "Amazing experience! The product exceeded my expectations. Thank you!",
      date: "2024-03-01",
      avatar: "👩"
    }
  ]);

  useEffect(() => {
    // Fetch products on component mount
    const fetchProducts = async () => {
      try {
        const [productsRes, packsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/productPacks')
        ]);

        const productsData = await productsRes.json();
        const packsData = await packsRes.json();

        setProducts(productsData);
        setProductPacks(packsData);

        // Combine and mark types
        const combined = [
          ...productsData.map(p => ({ ...p, itemType: 'product' })),
          ...packsData.map(p => ({ ...p, itemType: 'productPack' }))
        ];
        setAllItems(combined);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Mobile-specific animations only
    const isMobile = window.innerWidth < 768;

    if (!isMobile) return; // Skip animations for desktop

    // Initialize GSAP animations for mobile only
    const ctx = gsap.context(() => {
      // Hero section animation - very quick for mobile
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6, // Faster duration
          ease: "power2.out"
        }
      );

      // Welcome section animation - quick and responsive
      // AboutUs section animation
      // Services section animation - faster stagger
      // Contact section animation
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  const handleButtonClick = (element) => {
    if (element) {
      gsap.fromTo(element,
        { scale: 1 },
        {
          scale: 0.95,
          duration: 0.08, // Very fast click animation
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        }
      );
    }
  };

  // Handle Buy Now from any product
  const handleBuyNow = (product, quantity) => {
    const user = getUserFromToken();
    if (user) {
      setSelectedProduct(product);
      setSelectedQuantity(quantity);
      setShowCheckout(true);
      return;
    }
    // Guests need to login first - show OTP login modal
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (selectedProduct) {
      setShowCheckout(true);
    }
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    setSelectedProduct(null);
    setSelectedQuantity(1);
  };

  // Calculate average rating
  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  const totalProductsSold = 1250; // You can fetch this from your API

  // YouTube video IDs
  const youtubeVideos = [
    { id: "_vKV5IUJI60", title: "Product Review & Demo", duration: "5:23" },
    { id: "_vKV5IUJI60", title: "Customer Testimonial", duration: "3:45" },
    { id: "_vKV5IUJI60", title: "How It Works", duration: "4:12" }
  ];

  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden">
      <Navbar />
      <main className='bg-gradient-to-br from-blue-500 to-purple-300'>
        {/* Hero Banner Carousel */}
        <div ref={heroRef}>
          <Hero />
        </div>



        {/* Featured Products Section */}
        {allItems.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-blue-200/50 mb-4">
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    ✨ Featured Products
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-4">
                  Shop Our Best Sellers
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover our most popular products, carefully selected for quality and customer satisfaction.
                </p>
              </div>

              {/* Products Grid - Show first 6 products */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8">
                {allItems.slice(0, 6).map((product, index) => (
                  <div key={`${product.itemType}-${product._id}`} className="transform hover:scale-105 transition-transform duration-300">
                    <Product
                      product={product}
                      index={index}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <Link
                  href="/Products"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                >
                  <span>View All Products</span>
                  <span className="text-lg">🛍️</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-sm">
                    {allItems.length} items
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

                {/* AboutUs Section */}
        <div>
          <AboutUs />
        </div>

        {/* Services Section */}
        <div>
          <Services />
        </div>

        {/* Ratings, Stats & Reviews Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <div className="container mx-auto px-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl font-bold text-gray-800">{averageRating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
                <div className="text-xs text-gray-500 mt-1">from {reviews.length}+ reviews</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-3xl font-bold text-gray-800">{totalProductsSold}+</div>
                <div className="text-sm text-gray-600">Products Sold</div>
                <div className="text-xs text-gray-500 mt-1">happy customers</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-2">👥</div>
                <div className="text-3xl font-bold text-gray-800">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
                <div className="text-xs text-gray-500 mt-1">trusted by many</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl mb-2">🚚</div>
                <div className="text-3xl font-bold text-gray-800">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
                <div className="text-xs text-gray-500 mt-1">quick response</div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Real reviews from real customers who love our products
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl">
                        {review.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{review.name}</h3>
                        <p className="text-xs text-gray-500">{review.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                    <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span>Read All Reviews</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* YouTube Video Display Component */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
                  Watch Our Videos
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  See our products in action and hear from our team
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {youtubeVideos.map((video, index) => (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="relative aspect-video bg-gray-900">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1">{video.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Duration: {video.duration}</span>
                        <button className="text-blue-600 text-sm hover:text-blue-700 font-medium">
                          Watch Now →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <a 
                  href="https://www.youtube.com/@vishwajitnaik7952" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span>📺</span>
                  <span>Visit Our YouTube Channel</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>



        {/* Contact Section */}
        {/* <div>
          <Contact />
        </div> */}
      </main>

      {/* Floating Action Button - Smaller for mobile */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* OTP Login Modal */}
      {showLogin && (
        <OtpLogin
          onSuccess={() => setShowLogin(false)}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={selectedProduct ? [{
          productId: selectedProduct,
          quantity: selectedQuantity,
          itemType: selectedProduct.itemType
        }] : []}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
