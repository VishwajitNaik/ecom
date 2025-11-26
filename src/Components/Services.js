'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const services = [
    { 
      icon: '🚚', 
      title: 'Fast Delivery', 
      description: 'Get your orders delivered within 2-3 business days with real-time tracking.',
      features: ['Free shipping over $50', 'Express delivery available', 'Nationwide coverage']
    },
    { 
      icon: '⭐', 
      title: 'Quality Products', 
      description: 'We offer only the best quality products with rigorous quality checks.',
      features: ['30-day return policy', 'Quality guarantee', 'Premium brands']
    },
    { 
      icon: '💬', 
      title: '24/7 Support', 
      description: 'Round-the-clock customer support for all your queries and concerns.',
      features: ['Live chat support', 'Phone & email support', 'Quick response time']
    },
  ];

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const hasAnimatedRef = useRef(false);

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

            // Cards animation - throwing from bottom with proper stagger
            tl.fromTo(cardsRef.current,
              {
                y: 400, // Increased distance for more dramatic effect
                opacity: 0,
                rotation: 10, // Reduced rotation
                scale: 0.5
              },
              {
                y: 0,
                opacity: 1,
                rotation: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.2, // Simple stagger without complex configuration
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
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '-50px 0px' // Start animation a bit earlier
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
    <div ref={containerRef} className="container mx-auto px-4 my-20 text-center max-w-6xl">
      {/* Title with animation */}
      <h2 
        ref={titleRef}
        className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-orange-200 text-transparent bg-clip-text"
        style={{ opacity: 0 }}
      >
        Our Services
      </h2>
      
      {/* Subtitle with animation */}
      <p 
        ref={subtitleRef}
        className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90"
        style={{ opacity: 0 }}
      >
        We provide exceptional services to ensure the best shopping experience for our customers.
      </p>
      
      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div 
            key={index} 
            ref={(el) => addToCardsRef(el, index)}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-300 relative overflow-hidden group hover:bg-white/15 hover:scale-105"
            style={{ 
              opacity: 0,
              transform: 'translateY(400px) rotate(10deg) scale(0.5)'
            }}
          >
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-400/30 rounded-3xl transition-all duration-500" />
            
            {/* Icon */}
            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
              {service.icon}
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold mb-4 text-orange-300 relative z-10">
              {service.title}
            </h3>
            
            {/* Description */}
            <p className="text-lg mb-6 opacity-90 leading-relaxed relative z-10">
              {service.description}
            </p>
            
            {/* Features List */}
            <ul className="text-left space-y-2 relative z-10">
              {service.features.map((feature, idx) => (
                <li 
                  key={idx} 
                  className="flex items-center gap-2 opacity-90"
                >
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm md:text-base">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;