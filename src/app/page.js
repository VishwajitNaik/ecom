// // Home.jsx
// import Navbar from '../Components/Navbar';
// import Hero from '../Components/Hero'; // Add this import
// import AboutUs from '../Components/AboutUs';
// import Services from '../Components/Services';
// import Contact from '../Components/Contact';

// export default function Home() {
//   return (
//     <div className="font-sans text-gray-800">
//       <Navbar />
//       <main>
//         {/* Hero Banner Carousel */}
//         <Hero />

//         <section className="py-16 bg-blue-100 text-gray-800">
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-4">Welcome to Ecom Store</h1>
//             <p className="text-lg">Discover amazing products at great prices.</p>
//           </div>
//         </section>

//         <AboutUs />
//         <Services />
//         <Contact />
//       </main>
//     </div>
//   );
// }

// "use client";
// // Home.jsx
// import { useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Navbar from '../Components/Navbar';
// import Hero from '../Components/Hero';
// import AboutUs from '../Components/AboutUs';
// import Services from '../Components/Services';
// import Contact from '../Components/Contact';

// // Register ScrollTrigger plugin
// gsap.registerPlugin(ScrollTrigger);

// export default function Home() {
//   const heroRef = useRef(null);
//   const welcomeRef = useRef(null);
//   const aboutRef = useRef(null);
//   const servicesRef = useRef(null);
//   const contactRef = useRef(null);

//   useEffect(() => {
//     // Initialize GSAP animations
//     const ctx = gsap.context(() => {
//       // Hero section animation
//       gsap.fromTo(heroRef.current, 
//         { opacity: 0, y: 50 },
//         { 
//           opacity: 1, 
//           y: 0, 
//           duration: 1.2,
//           ease: "power3.out"
//         }
//       );

//       // Welcome section animation
//       gsap.fromTo(welcomeRef.current.querySelector('h1'),
//         { opacity: 0, y: 30, scale: 0.9 },
//         {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//           duration: 1,
//           scrollTrigger: {
//             trigger: welcomeRef.current,
//             start: "top 80%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       gsap.fromTo(welcomeRef.current.querySelector('p'),
//         { opacity: 0, y: 20 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//           delay: 0.3,
//           scrollTrigger: {
//             trigger: welcomeRef.current,
//             start: "top 80%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // AboutUs section animation
//       gsap.fromTo(aboutRef.current,
//         { opacity: 0, y: 60 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 1.2,
//           scrollTrigger: {
//             trigger: aboutRef.current,
//             start: "top 80%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // Services section animation with staggered items
//       gsap.fromTo(servicesRef.current.querySelectorAll('.service-item'),
//         { opacity: 0, y: 40, scale: 0.95 },
//         {
//           opacity: 1,
//           y: 0,
//           scale: 1,
//           duration: 0.8,
//           stagger: 0.2,
//           scrollTrigger: {
//             trigger: servicesRef.current,
//             start: "top 70%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // Contact section animation
//       gsap.fromTo(contactRef.current,
//         { opacity: 0, x: -50 },
//         {
//           opacity: 1,
//           x: 0,
//           duration: 1,
//           scrollTrigger: {
//             trigger: contactRef.current,
//             start: "top 80%",
//             end: "bottom 20%",
//             toggleActions: "play none none reverse"
//           }
//         }
//       );

//       // Parallax effect for welcome section
//       gsap.to(welcomeRef.current, {
//         yPercent: -30,
//         ease: "none",
//         scrollTrigger: {
//           trigger: welcomeRef.current,
//           start: "top bottom",
//           end: "bottom top",
//           scrub: true
//         }
//       });

//       // Floating animation for elements
//       const floatAnimation = gsap.to(welcomeRef.current, {
//         y: 10,
//         duration: 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut"
//       });

//       // Clean up floating animation
//       return () => floatAnimation.kill();
//     });

//     return () => ctx.revert(); // Cleanup
//   }, []);

//   return (
//     <div className="font-sans text-gray-800 bg-white overflow-x-hidden">
//       <Navbar />
//       <main className='bg-gradient-to-br from-blue-500 to-purple-300'>
//         {/* Hero Banner Carousel */}
//         <div ref={heroRef}>
//           <Hero />
//         </div>

//         {/* Welcome Section with Parallax */}
//         <section 
//           ref={welcomeRef}
//           className="py-20  text-gray-800 relative overflow-hidden"
//         >
//           {/* Background decorative elements */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
//             <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full"></div>
//             <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500 rounded-full"></div>
//           </div>
          
//           <div className="container mx-auto px-4 text-center relative z-10">
//             <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-6">
//               Welcome to Ecom Store
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
//               Discover amazing products at great prices. Experience seamless shopping with premium quality and exceptional service.
//             </p>
            
//             {/* Animated CTA Button */}
//             <div className="mt-8">
//               <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
//                 Start Shopping Now
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* AboutUs Section */}
//         <div ref={aboutRef}>
//           <AboutUs />
//         </div>

//         {/* Services Section */}
//         <div ref={servicesRef}>
//           <Services />
//         </div>

//         {/* Contact Section */}
//         <div ref={contactRef}>
//           <Contact />
//         </div>
//       </main>

//       {/* Floating Action Button */}
//       <div className="fixed bottom-8 right-8 z-50">
//         <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-110 transition-all duration-300">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }

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



  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden">
      <Navbar />
      <main className='bg-gradient-to-br from-blue-500 to-purple-300'>
        {/* Hero Banner Carousel */}
        <div ref={heroRef}>
          <Hero />
        </div>

        {/* Quick Access Buttons Section - Optimized for mobile */}
        <section 
          className="py- backdrop-blur-sm bg-white/80 border-b border-white/20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-3">
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                Quick Access
              </h2>
              <p className="text-gray-600 text-xs">
                Get started quickly
              </p>
            </div>
            
            <div className="flex flex-nowrap justify-center items-stretch gap-2 overflow-x-auto pb-1">

              {/* Login Button */}
              <button
                onClick={() => setShowLogin(true)}
                className="group bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl p-2 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-400/30 hover:border-purple-300/50 min-w-[85px] flex flex-col items-center justify-center"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-sm">🔐</span>
                </div>
                <h3 className="font-bold text-xs mb-0.5">Login</h3>
                <p className="text-purple-100 text-[9px] opacity-90">Account</p>
              </button>

              {/* Products Button */}
              <Link
                href="/Products"
                className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-2 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-blue-400/30 hover:border-blue-300/50 min-w-[85px] flex flex-col items-center justify-center"
                onClick={(e) => handleButtonClick(e.currentTarget)}
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-sm">🛍️</span>
                </div>
                <h3 className="font-bold text-xs mb-0.5">Products</h3>
                <p className="text-blue-100 text-[9px] opacity-90">Browse</p>
              </Link>

              {/* Cart Button */}
              <Link
                href="/Products/Cart"
                className="group bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-2 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-green-400/30 hover:border-green-300/50 min-w-[85px] flex flex-col items-center justify-center"
                onClick={(e) => handleButtonClick(e.currentTarget)}
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-sm">🛒</span>
                </div>
                <h3 className="font-bold text-xs mb-0.5">Cart</h3>
                <p className="text-green-100 text-[9px] opacity-90">View</p>
              </Link>
            </div>
          </div>
        </section>

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


        {/* Welcome Section - Compact for mobile */}
<section 
  className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-100 relative overflow-hidden"
>
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:40px_40px]"></div>
  </div>

  {/* Floating Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-pink-400/5 rounded-full blur-xl animate-pulse delay-500"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
        {/* Main Product Image */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <img 
            src="/assets/Shuga_amrit2.jpeg" 
            alt="Premium Products Collection"
            className="relative w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
          />
          {/* Floating Badge */}
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg transform rotate-6">
            <span className="text-sm font-bold">Best Seller</span>
          </div>
        </div>

        {/* Floating Product Cards */}
        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200/50 transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <img 
            src="assets/Shuga_amrit1.jpeg" 
            alt="Smart Watch"
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-800">Smart Watch</p>
            <p className="text-xs text-green-600 font-bold">$199.99</p>
          </div>
        </div>

        <div className="absolute -top-6 -right-10 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200/50 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <img 
            src="/assets/shuga_amrit3.jpeg" 
            alt="Wireless Headphones"
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-800">Headphones</p>
            <p className="text-xs text-green-600 font-bold">$149.99</p>
          </div>
        </div>

        <div className="absolute bottom-20 right-20 bg-white rounded-2xl p-3 shadow-xl border border-gray-200/50">
          <img 
            src="assets/aurvedaman.webp" 
            alt="Smartphone"
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>
      </div>
    </div>

  </div>
</section>


        {/* AboutUs Section */}
        {/* <div>
          <AboutUs />
        </div> */}

        {/* Services Section */}
        {/* <div>
          <Services />
        </div> */}

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
