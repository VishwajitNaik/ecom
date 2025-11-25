// Components/Hero.jsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch carousel data
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await fetch('/api/carousel/public');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const formattedData = data.map((item, index) => ({
              image: item.image,
              title: item.title || `Slide ${index + 1}`,
              subtitle: item.description || "Welcome to Ecom Store",
              cta: item.link ? "Shop Now" : "Explore",
              link: item.link,
              overlay: index % 4 === 0 ? "from-green-900/60 via-green-800/40 to-transparent" :
                      index % 4 === 1 ? "from-blue-900/60 via-blue-800/40 to-transparent" :
                      index % 4 === 2 ? "from-orange-900/60 via-orange-800/40 to-transparent" :
                      "from-purple-900/60 via-purple-800/40 to-transparent"
            }));
            setHeroData(formattedData);
          } else {
            // Fallback to default slides if no carousel data
            setHeroData([
              {
                image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop",
                title: "Welcome to Ecom Store",
                subtitle: "Discover amazing products at great prices",
                cta: "Shop Now",
                overlay: "from-green-900/60 via-green-800/40 to-transparent"
              }
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch carousel data:', error);
        // Fallback to default
        setHeroData([
          {
            image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop",
            title: "Welcome to Ecom Store",
            subtitle: "Discover amazing products at great prices",
            cta: "Shop Now",
            overlay: "from-green-900/60 via-green-800/40 to-transparent"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  // Preload images
  useEffect(() => {
    if (heroData.length > 0) {
      heroData.forEach(slide => {
        const img = new Image();
        img.src = slide.image;
      });
    }
  }, [heroData]);

  useEffect(() => {
    if (!containerRef.current || loading || heroData.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // Initial animations
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )
    .fromTo(titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      "-=0.5"
    )
    .fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    )
    .fromTo(ctaRef.current,
      { y: 30, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8 },
      "-=0.5"
    );

    // Carousel animation
    const carouselTl = gsap.timeline({ repeat: -1 });

    heroData.forEach((_, index) => {
      const nextIndex = (index + 1) % heroData.length;

      carouselTl
        .to(`.slide-${index}`, {
          opacity: 0,
          scale: 1.1,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => setCurrentSlide(nextIndex)
        })
        .fromTo(`.slide-${nextIndex}`,
          { opacity: 0, scale: 1 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.inOut"
          },
          "<"
        )
        .to({}, { duration: 4 }); // Pause between slides
    });

    // Floating animation for CTA
    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.to(ctaRef.current, {
      y: -10,
      duration: 2,
      ease: "sine.inOut"
    });

    return () => {
      tl.kill();
      carouselTl.kill();
      floatTl.kill();
    };
  }, [heroData, loading]);

  const goToSlide = (index) => {
    // Kill existing animations
    gsap.killTweensOf(".hero-slide");
    
    // Animate current slide out
    gsap.to(`.slide-${currentSlide}`, {
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: "power2.inOut"
    });
    
    // Animate new slide in
    gsap.fromTo(`.slide-${index}`,
      { opacity: 0, scale: 1 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => setCurrentSlide(index)
      }
    );
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % heroData.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + heroData.length) % heroData.length);
  };

  const handleCTAClick = () => {
    const currentData = heroData[currentSlide];
    if (currentData.link) {
      window.location.href = currentData.link;
    } else {
      // Default action - scroll to products or navigate to products page
      const productsSection = document.querySelector('#products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/Products';
      }
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-gray-900">
      {/* Background Carousel */}
      <div ref={carouselRef} className="absolute inset-0">
        {heroData.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide slide-${index} absolute inset-0 transition-opacity duration-1000 ${
              index === 0 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop&text=Ecom+Store+${index + 1}`;
              }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl">
          {/* Title */}
          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl"
          >
            {heroData[currentSlide].title}
          </h1>
          
          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl mb-8 leading-relaxed drop-shadow-lg max-w-2xl mx-auto opacity-95"
          >
            {heroData[currentSlide].subtitle}
          </p>
          
          {/* CTA Button */}
          <button
            ref={ctaRef}
            onClick={handleCTAClick}
            className="bg-white text-gray-900 px-12 py-4 rounded-full font-bold
            hover:bg-gray-100 transform hover:scale-105 transition-all duration-300
            shadow-2xl border-2 border-white text-lg min-w-[200px] hover:shadow-3xl
            active:scale-95"
          >
            {heroData[currentSlide].cta}
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {heroData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 border-2 border-white ${
              currentSlide === index 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-transparent hover:bg-white/50 hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 
        bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center 
        text-white text-2xl border-2 border-white/20 hover:bg-white/20 transition-all 
        duration-300 z-20 hover:scale-110 hover:border-white/40 shadow-2xl
        active:scale-95"
        aria-label="Previous slide"
      >
        ‹
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 
        bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center 
        text-white text-2xl border-2 border-white/20 hover:bg-white/20 transition-all 
        duration-300 z-20 hover:scale-110 hover:border-white/40 shadow-2xl
        active:scale-95"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-md rounded-full 
        px-4 py-2 text-white font-semibold border border-white/20 z-20 shadow-2xl">
        <span className="text-lg">{currentSlide + 1}</span>
        <span className="text-white/60 mx-2">/</span>
        <span className="text-white/60">{heroData.length}</span>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
        text-white/70 animate-bounce z-10">
        <div className="text-center">
          <div className="text-sm mb-2 font-medium">Scroll to Explore</div>
          <div className="text-2xl">↓</div>
        </div>
      </div>

      {/* Additional Gradient Overlays */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent z-10" />
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/30 to-transparent z-10" />
    </section>
  );
};

export default Hero;