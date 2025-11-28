'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Ayurveda-themed contact images
  const contactImages = [
    "assets/vecteezy_luxurious-spa-items_2030288.jpg", // Ayurvedic consultation
    "assets/pexels-n-voitkevich-7615457.jpg", // Natural herbs
    "assets/ayurvedaHero2.webp", // Ayurvedic products
    "assets/ayurveda9.avif"  // Wellness
  ];

  // Auto-change images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % contactImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Animation on component mount
  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            const tl = gsap.timeline();

            // Form animation
            tl.fromTo(formRef.current,
              {
                x: -100,
                opacity: 0,
                scale: 0.9
              },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.8)"
              }
            );

            // Info animation
            tl.fromTo(infoRef.current,
              {
                x: 100,
                opacity: 0,
                scale: 0.9
              },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.8)"
              },
              "-=0.5"
            );

            hasAnimatedRef.current = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px 0px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-300 rounded-full"></div>
      </div>

      {/* Floating Ayurvedic Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float">🪷</div>
        <div className="absolute top-40 right-40 text-3xl opacity-10 animate-float delay-1000">🌿</div>
        <div className="absolute bottom-32 left-32 text-2xl opacity-10 animate-float delay-500">☯️</div>
        <div className="absolute bottom-20 right-32 text-4xl opacity-10 animate-float delay-1500">🧘‍♀️</div>
      </div>

      <div ref={containerRef} className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-emerald-200/50 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-amber-600 text-transparent bg-clip-text">
              🌿 Connect With Us
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-amber-600 to-orange-600 text-transparent bg-clip-text">
              Ayurvedic Consultation
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Begin your <span className="font-semibold text-emerald-600">wellness journey</span> with personalized 
            Ayurvedic guidance from our certified practitioners
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div 
            ref={formRef}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-emerald-200/50"
            style={{ opacity: 0, transform: 'translateX(-100px) scale(0.9)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">📝</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Wellness Consultation Form</h3>
                <p className="text-gray-600">Let us understand your needs</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 group-hover:border-emerald-400"
                    placeholder="John"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 group-hover:border-amber-400"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 group-hover:border-emerald-400"
                  placeholder="john@example.com"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 group-hover:border-amber-400"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 group-hover:border-orange-400">
                  <option>General Wellness Consultation</option>
                  <option>Dosha Analysis</option>
                  <option>Diet & Nutrition Planning</option>
                  <option>Product Recommendation</option>
                  <option>Other Ayurvedic Services</option>
                </select>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Concerns</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 resize-none group-hover:border-emerald-400"
                  placeholder="Please describe your health concerns, current lifestyle, and wellness goals..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 to-amber-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <span>Schedule Consultation</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </form>
          </div>

          {/* Contact Information & Image Gallery */}
          <div 
            ref={infoRef}
            className="space-y-6"
            style={{ opacity: 0, transform: 'translateX(100px) scale(0.9)' }}
          >
            {/* Auto-changing Image Gallery */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-200/50">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img 
                  src={contactImages[currentImageIndex]}
                  alt="Ayurvedic Wellness Consultation"
                  className="relative w-full h-64 object-cover rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Image Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {contactImages.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 rounded-b-2xl">
                  <p className="text-white text-sm font-semibold">
                    Personalized Ayurvedic Guidance for Your Wellness Journey
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">📞</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Contact Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-emerald-600 text-lg">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-600 text-sm">wellness@ayurvedastore.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-amber-600 text-lg">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-600 text-sm">+1 (555) 123-HEAL (4325)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-orange-600 text-lg">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Wellness Center</p>
                    <p className="text-gray-600 text-sm">123 Harmony Street, Wellness City, WC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-emerald-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl text-white">🕒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Consultation Hours</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 hover:bg-emerald-50 rounded-lg transition-colors duration-200">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-semibold text-emerald-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-semibold text-amber-600">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-orange-50 rounded-lg transition-colors duration-200">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-semibold text-orange-600">Emergency Only</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white rounded-3xl p-6 text-center">
              <div className="text-3xl mb-2">🚨</div>
              <h4 className="font-bold mb-2">Emergency Ayurvedic Support</h4>
              <p className="text-sm opacity-90 mb-3">Available 24/7 for urgent wellness concerns</p>
              <p className="font-bold text-lg">+1 (555) 123-HELP (4357)</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: "👨‍⚕️",
              title: "Certified Practitioners",
              description: "All our Ayurvedic doctors are certified and experienced"
            },
            {
              icon: "🔒",
              title: "Confidential Consultation",
              description: "Your health information is kept completely private"
            },
            {
              icon: "💻",
              title: "Online Sessions Available",
              description: "Virtual consultations from the comfort of your home"
            }
          ].map((item, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
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

export default Contact;