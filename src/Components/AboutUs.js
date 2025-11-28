  // // Components/AboutUs.jsx
  // const AboutUs = () => {
  //   return (
  //     <div className="container mx-auto px-4 bg-gradient-to-b from-blue-300 rounded-2xl shadow-2xl shadow-black hover:scale-105 transition-transform duration-300 to-gray-600 py-20 text-center max-w-6xl">
  //       <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-green-200 text-transparent bg-clip-text">
  //         About Our Store
  //       </h2>
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  //         <div className="text-left">
  //           <p className="text-xl md:text-2xl mb-6 leading-relaxed opacity-95">
  //             Welcome to <span className="font-bold text-yellow-300">Ecom Store</span>, your premier destination for quality products and exceptional service.
  //           </p>
  //           <p className="text-lg md:text-xl mb-6 leading-relaxed opacity-90">
  //             Founded with a vision to revolutionize online shopping, we bring you carefully curated products 
  //             that combine quality, affordability, and style.
  //           </p>
  //           <p className="text-lg md:text-xl leading-relaxed opacity-90">
  //             Our commitment to customer satisfaction drives everything we do, from product selection 
  //             to delivery and beyond.
  //           </p>
  //         </div>
  //         <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
  //           <h3 className="text-2xl font-bold mb-6 text-yellow-300">Why Choose Us?</h3>
  //           <div className="space-y-4 text-left">
  //             <div className="flex items-start gap-4">
  //               <div className="text-2xl">🚀</div>
  //               <div>
  //                 <h4 className="text-xl font-semibold mb-1">Fast Shipping</h4>
  //                 <p className="opacity-90">Delivery within 2-3 business days</p>
  //               </div>
  //             </div>
  //             <div className="flex items-start gap-4">
  //               <div className="text-2xl">⭐</div>
  //               <div>
  //                 <h4 className="text-xl font-semibold mb-1">Quality Guarantee</h4>
  //                 <p className="opacity-90">30-day money back guarantee</p>
  //               </div>
  //             </div>
  //             <div className="flex items-start gap-4">
  //               <div className="text-2xl">🔒</div>
  //               <div>
  //                 <h4 className="text-xl font-semibold mb-1">Secure Shopping</h4>
  //                 <p className="opacity-90">SSL encrypted secure payments</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // export default AboutUs;

  "use client";

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const AboutUs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const aboutRef = useRef(null);
  
  // Ayurveda-themed images (replace with your actual Ayurveda product/images)
  const ayurvedaImages = [
    "/assets/main/ayurveda1-removebg-preview.png", // Herbs
    "/assets/main/ayurveda2-removebg-preview.png", // Ayurvedic products
    "/assets/main/ayurveda3-removebg-preview.png", // Natural ingredients
    "/assets/main/ayurveda4-removebg-preview.png", // Wellness
    "/assets/main/ayurveda5-removebg-preview.png"  // Meditation
  ];

  // Auto-change images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % ayurvedaImages.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Animation on component mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(aboutRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={aboutRef} className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-500 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-400 rounded-full"></div>
      </div>

      {/* Floating Leaves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float">🍃</div>
        <div className="absolute top-40 right-40 text-3xl opacity-10 animate-float delay-1000">🌿</div>
        <div className="absolute bottom-32 left-32 text-2xl opacity-10 animate-float delay-500">🌱</div>
        <div className="absolute bottom-20 right-32 text-4xl opacity-10 animate-float delay-1500">🍂</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-emerald-200/50 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-amber-600 text-transparent bg-clip-text">
              🌿 Authentic Ayurveda Wellness
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-amber-600 to-orange-600 text-transparent bg-clip-text">
              About AyurVeda Store
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Embracing <span className="font-semibold text-emerald-600">5000+ years</span> of ancient wisdom 
            for <span className="font-semibold text-amber-600">modern wellness</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-700">
                Welcome to <span className="font-bold text-emerald-600">AyurVeda Store</span>, your trusted gateway to 
                authentic Ayurvedic wellness. We bridge ancient wisdom with modern living, bringing you 
                time-tested remedies and natural solutions for holistic health.
              </p>
              
              <p className="text-lg md:text-xl mb-6 leading-relaxed text-gray-700">
                Founded on the principles of <span className="font-semibold text-amber-600">balance, purity, and harmony</span>, 
                we carefully source each product to ensure it meets the highest standards of 
                Ayurvedic authenticity and quality.
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                Our mission is to make <span className="font-semibold text-orange-600">authentic Ayurveda</span> accessible to everyone, 
                helping you achieve natural wellness and balanced living in today's fast-paced world.
              </p>
            </div>

            {/* Ayurveda Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "⚖️", title: "Balance", desc: "Dosha Harmony" },
                { icon: "🌱", title: "Purity", desc: "Natural Ingredients" },
                { icon: "🕉️", title: "Harmony", desc: "Mind & Body" }
              ].map((principle, index) => (
                <div key={index} className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white rounded-2xl p-4 text-center shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl mb-2">{principle.icon}</div>
                  <h4 className="font-bold text-sm mb-1">{principle.title}</h4>
                  <p className="text-xs opacity-90">{principle.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-changing Image Gallery */}
          <div className="relative">
            {/* Main Auto-changing Image */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img 
                src={ayurvedaImages[currentImageIndex]}
                alt="Ayurvedic Wellness"
                className="relative w-full h-80 object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Image Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {ayurvedaImages.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Product Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-emerald-200/50 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <img 
                src="assets/main/ayurveda5-removebg-preview.png"
                alt="Ayurvedic Herbs"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-800">Medicinal Herbs</p>
                <p className="text-xs text-emerald-600 font-bold">Pure & Natural</p>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl border border-amber-200/50 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <img 
                src="assets/main/ayurveda6-removebg-preview.png"
                alt="Ayurvedic Oils"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-800">Therapeutic Oils</p>
                <p className="text-xs text-amber-600 font-bold">Authentic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ayurveda Information Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: "🌿",
              title: "What is Ayurveda?",
              description: "The ancient Indian science of life and longevity, focusing on holistic wellness through natural balance of mind, body, and spirit.",
              color: "from-emerald-500 to-emerald-600"
            },
            {
              icon: "⚖️",
              title: "Dosha Balance",
              description: "Understanding Vata, Pitta, and Kapha doshas to maintain optimal health through personalized lifestyle and dietary choices.",
              color: "from-amber-500 to-amber-600"
            },
            {
              icon: "💎",
              title: "Our Promise",
              description: "100% authentic Ayurvedic products sourced directly from trusted growers and manufacturers, ensuring purity and potency.",
              color: "from-orange-500 to-orange-600"
            }
          ].map((box, index) => (
            <div key={index} className="group">
              <div className={`bg-gradient-to-br ${box.color} text-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 h-full`}>
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {box.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{box.title}</h3>
                <p className="text-white/90 leading-relaxed">{box.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-200/50">
          <h3 className="text-3xl font-bold mb-8 text-center text-emerald-600">Why Choose AyurVeda Store?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🔬", title: "Lab Tested", desc: "Rigorous quality checks" },
              { icon: "🌍", title: "Direct Source", desc: "From farm to you" },
              { icon: "📚", title: "Expert Guidance", desc: "Ayurvedic consultation" },
              { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl text-white">{feature.icon}</span>
                </div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ayurvedic Wisdom Quote */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 rounded-2xl p-8 border border-emerald-200/30">
            <p className="text-xl md:text-2xl italic text-gray-700 mb-4">
              "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need."
            </p>
            <p className="text-lg text-emerald-600 font-semibold">- Ancient Ayurvedic Proverb</p>
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutUs;