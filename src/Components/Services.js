'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  
  // Ayurveda-themed services
  const services = [
    { 
      icon: '🌿', 
      title: 'Authentic Ayurvedic Products', 
      description: 'Pure, natural Ayurvedic formulations sourced directly from trusted growers and traditional manufacturers.',
      features: ['100% natural ingredients', 'Traditional preparation methods', 'Quality tested', 'No artificial additives'],
      image: 'assets/ai-generated-8221936_1280.png',
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      icon: '👨‍⚕️', 
      title: 'Ayurvedic Consultation', 
      description: 'Personalized wellness guidance from certified Ayurvedic practitioners for your unique dosha balance.',
      features: ['Dosha analysis', 'Personalized diet plans', 'Lifestyle recommendations', 'Follow-up support'],
      image: 'assets/ai-generated-8644566_1920.jpg',
      color: 'from-amber-500 to-amber-600'
    },
    { 
      icon: '📚', 
      title: 'Ayurvedic Education', 
      description: 'Learn the ancient wisdom of Ayurveda through workshops, courses, and educational resources.',
      features: ['Online courses', 'Workshops & webinars', 'Educational materials', 'Community support'],
      image: 'assets/vecteezy_aromatherapy-spa-treatment-on-a-table_2111150.jpg',
      color: 'from-orange-500 to-orange-600'
    },
  ];

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  // Auto-rotate featured service
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            const tl = gsap.timeline();

            // Title animation
            tl.fromTo(titleRef.current,
              {
                y: 100,
                opacity: 0,
                rotationX: 45
              },
              {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 1.2,
                ease: "back.out(2.5)"
              }
            );

            // Subtitle animation
            tl.fromTo(subtitleRef.current,
              {
                y: 50,
                opacity: 0,
                scale: 0.8
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
              },
              "-=0.6"
            );

            // Cards animation
            tl.fromTo(cardsRef.current,
              {
                y: 200,
                opacity: 0,
                rotation: 5,
                scale: 0.8
              },
              {
                y: 0,
                opacity: 1,
                rotation: 0,
                scale: 1,
                duration: 1,
                stagger: 0.15,
                ease: "back.out(1.8)"
              },
              "-=0.3"
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

  const addToCardsRef = (el, index) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current[index] = el;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-400 rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-32 h-32 bg-amber-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300 rounded-full"></div>
      </div>

      {/* Floating Ayurvedic Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-32 text-4xl opacity-10 animate-float">🪷</div>
        <div className="absolute top-48 right-48 text-3xl opacity-10 animate-float delay-1000">🧘‍♀️</div>
        <div className="absolute bottom-40 left-40 text-2xl opacity-10 animate-float delay-500">🌱</div>
        <div className="absolute bottom-28 right-40 text-4xl opacity-10 animate-float delay-1500">☯️</div>
      </div>

      <div ref={containerRef} className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-emerald-200/50 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-amber-600 text-transparent bg-clip-text">
              🌿 Our Ayurvedic Services
            </span>
          </div>
          
          <h2 
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ opacity: 0 }}
          >
            <span className="bg-gradient-to-r from-emerald-600 via-amber-600 to-orange-600 text-transparent bg-clip-text">
              Ayurvedic Wellness Services
            </span>
          </h2>
          
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{ opacity: 0 }}
          >
            Experience the <span className="font-semibold text-emerald-600">transformative power</span> of authentic Ayurveda 
            through our comprehensive wellness services
          </p>
        </div>

        {/* Auto-changing Featured Service */}
        <div className="mb-16">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-emerald-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-full px-4 py-2 text-sm font-semibold mb-4">
                  <span>{services[currentServiceIndex].icon}</span>
                  <span>Featured Service</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {services[currentServiceIndex].title}
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {services[currentServiceIndex].description}
                </p>
                <div className="flex gap-2 justify-center lg:justify-start">
                  {services.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentServiceIndex ? 'bg-emerald-500 scale-125' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img 
                  src={services[currentServiceIndex].image}
                  alt={services[currentServiceIndex].title}
                  className="relative w-full h-64 object-cover rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              ref={(el) => addToCardsRef(el, index)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-200/50 transition-all duration-300 hover:bg-white/90 hover:scale-105"
              style={{ 
                opacity: 0,
                transform: 'translateY(200px) rotate(5deg) scale(0.8)'
              }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Animated Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-400/30 rounded-3xl transition-all duration-500" />

              {/* Icon */}
              <div className="relative z-10">
                <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <span className="text-3xl text-white">{service.icon}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed text-center">
                  {service.description}
                </p>
                
                {/* Features List */}
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className={`w-6 h-6 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full mt-6 bg-gradient-to-r ${service.color} text-white font-semibold py-3 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
                  Learn More
                </button>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
            </div>
          ))}
        </div>

        {/* Additional Ayurvedic Services Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 rounded-2xl p-8 border border-emerald-200/30">
            <h3 className="text-2xl font-bold text-emerald-600 mb-4">Why Choose Our Ayurvedic Services?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600">🎯</span>
                </div>
                <span>Authentic Traditional Methods</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <span className="text-amber-600">💎</span>
                </div>
                <span>Certified Practitioners</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <span className="text-orange-600">🌍</span>
                </div>
                <span>Global Ayurvedic Standards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Services;  