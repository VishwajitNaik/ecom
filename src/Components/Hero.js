"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const ctaRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Desktop static images
  const desktopImages = [
    "/assets/desktop.png",
    "/assets/desktop1.png",
    "/assets/desktop2.png",
    "/assets/desktop3.png"
  ];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const isDesktop = window.innerWidth >= 768;
        console.log('isDesktop:', isDesktop, 'window.innerWidth:', window.innerWidth);

        // ✅ DESKTOP → USE CUSTOM IMAGES
        if (isDesktop) {
          const desktopData = desktopImages.map((image) => ({
            image: image,
            cta: "Shop Now",
            link: "/Products"
          }));
          console.log('Setting desktop heroData:', desktopData);
          setHeroData(desktopData);
          setLoading(false);
          return;
        }

        // ✅ MOBILE → USE API
        const response = await fetch('/api/carousel/public');

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            const formattedData = data.map((item) => ({
              image: item.image,
              cta: "Shop Now",
              link: item.link || "/Products"
            }));

            console.log('Setting mobile heroData from API:', formattedData);
            setHeroData(formattedData);
          } else {
            fallbackImages();
          }
        } else {
          fallbackImages();
        }
      } catch (error) {
        console.error(error);
        fallbackImages();
      } finally {
        setLoading(false);
      }
    };

    const fallbackImages = () => {
      console.log('Using fallback images');
      setHeroData([
        {
          image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop",
          cta: "Shop Now",
          link: "/Products"
        }
      ]);
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

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    )
    .fromTo(ctaRef.current,
      { y: 30, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8 },
      "-=0.5"
    );

    // Only start carousel if there are multiple slides
    if (heroData.length > 1) {
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
          .to({}, { duration: 4 });
      });
    }

    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.to(ctaRef.current, {
      y: -10,
      duration: 2,
      ease: "sine.inOut"
    });

    return () => {
      tl.kill();
      if (heroData.length > 1) {
        gsap.killTweensOf(".hero-slide");
      }
      floatTl.kill();
    };
  }, [heroData, loading]);

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    
    gsap.killTweensOf(".hero-slide");

    gsap.to(`.slide-${currentSlide}`, {
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: "power2.inOut"
    });

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
    if (heroData.length > 1) {
      goToSlide((currentSlide + 1) % heroData.length);
    }
  };

  const prevSlide = () => {
    if (heroData.length > 1) {
      goToSlide((currentSlide - 1 + heroData.length) % heroData.length);
    }
  };

  const handleCTAClick = () => {
    const currentData = heroData[currentSlide];
    if (currentData && currentData.link) {
      window.location.href = currentData.link;
    } else {
      window.location.href = '/Products';
    }
  };

  if (loading || heroData.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-300">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  // Mobile-specific height adjustment
  const mobileHeightClass = isMobile ? "h-[60vh]" : "h-screen";

  return (
    <section 
      ref={containerRef} 
      className={`relative ${mobileHeightClass} overflow-hidden bg-gray-900`}
    >
      {/* Images */}
      <div ref={carouselRef} className="absolute inset-0">
        {heroData.map((slide, index) => (
          <div
            key={index}
            className={`slide-${index} absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              className="w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop`;
              }}
            />
          </div>
        ))}
      </div>

      {/* Gradient Overlay for better text visibility (mobile only) */}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20" />
      )}

      {/* CTA Button */}
      <div className="relative z-30 flex items-center justify-center h-full">
        <button
          ref={ctaRef}
          onClick={handleCTAClick}
          className={`bg-white text-gray-900 font-bold rounded-full 
            shadow-2xl border-2 border-white hover:bg-gray-100 
            transform hover:scale-105 transition-all duration-300
            active:scale-95
            ${isMobile 
              ? 'px-6 py-2 text-sm min-w-[120px]' 
              : 'px-12 py-4 text-lg min-w-[200px]'
            }`}
        >
          Shop Now
        </button>
      </div>

      {/* Indicators - Only show if multiple slides */}
      {heroData.length > 1 && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 flex gap-2 z-30
          ${isMobile ? 'bottom-4' : 'bottom-6'}`}
        >
          {heroData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer
                ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}
                ${currentSlide === index 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70 hover:scale-110'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows - Only show if multiple slides and not mobile */}
      {heroData.length > 1 && !isMobile && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 
            w-10 h-10 bg-black/40 backdrop-blur-md rounded-full 
            flex items-center justify-center text-white text-2xl 
            hover:bg-white/20 transition-all duration-300 z-30
            hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            ‹
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 
            w-10 h-10 bg-black/40 backdrop-blur-md rounded-full 
            flex items-center justify-center text-white text-2xl 
            hover:bg-white/20 transition-all duration-300 z-30
            hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Slide Counter - Desktop only */}
      {heroData.length > 1 && !isMobile && (
        <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md 
          rounded-full px-3 py-1 text-white text-sm font-semibold z-30">
          {currentSlide + 1} / {heroData.length}
        </div>
      )}

      {/* Scroll Indicator - Desktop only */}
      {!isMobile && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
          text-white/70 animate-bounce z-30 hidden md:block">
          <div className="text-center">
            <div className="text-xs mb-1 font-medium">Scroll</div>
            <div className="text-lg">↓</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

// "use client";

// import { useEffect, useRef, useState } from 'react';
// import { gsap } from 'gsap';

// const Hero = () => {
//   const containerRef = useRef(null);
//   const carouselRef = useRef(null);
//   const ctaRef = useRef(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [heroData, setHeroData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch carousel data
//   useEffect(() => {
//     const fetchCarouselData = async () => {
//       try {
//         const response = await fetch('/api/carousel/public');
//         if (response.ok) {
//           const data = await response.json();
//           console.log('Carousel data received:', data);
//           if (Array.isArray(data) && data.length > 0) {
//             const formattedData = data.map((item, index) => ({
//               image: item.image || "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop",
//               cta: "Shop Now",
//               link: item.link || "/Products"
//             }));
//             setHeroData(formattedData);
//           } else {
//             // Fallback to default slides if no carousel data
//             console.log('No carousel data, using fallback');
//             setHeroData([
//               {
//                 image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop",
//                 cta: "Shop Now",
//                 link: "/Products"
//               }
//             ]);
//           }
//         } else {
//           console.error('Carousel API response not ok:', response.status);
//           // Fallback to default
//           setHeroData([
//             {
//               image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop",
//               cta: "Shop Now",
//               link: "/Products"
//             }
//           ]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch carousel data:', error);
//         // Fallback to default
//         setHeroData([
//           {
//             image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop",
//             cta: "Shop Now",
//             link: "/Products"
//           }
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCarouselData();
//   }, []);

//   // Preload images
//   useEffect(() => {
//     if (heroData.length > 0) {
//       heroData.forEach(slide => {
//         const img = new Image();
//         img.src = slide.image;
//       });
//     }
//   }, [heroData]);

//   useEffect(() => {
//     if (!containerRef.current || loading || heroData.length === 0) return;

//     const tl = gsap.timeline({
//       defaults: { ease: "power3.out" }
//     });

//     // Initial animations
//     tl.fromTo(containerRef.current,
//       { opacity: 0 },
//       { opacity: 1, duration: 1 }
//     )
//     .fromTo(ctaRef.current,
//       { y: 30, opacity: 0, scale: 0.8 },
//       { y: 0, opacity: 1, scale: 1, duration: 0.8 },
//       "-=0.5"
//     );

//     // Carousel animation
//     const carouselTl = gsap.timeline({ repeat: -1 });

//     heroData.forEach((_, index) => {
//       const nextIndex = (index + 1) % heroData.length;

//       carouselTl
//         .to(`.slide-${index}`, {
//           opacity: 0,
//           scale: 1.1,
//           duration: 1.5,
//           ease: "power2.inOut",
//           onComplete: () => setCurrentSlide(nextIndex)
//         })
//         .fromTo(`.slide-${nextIndex}`,
//           { opacity: 0, scale: 1 },
//           {
//             opacity: 1,
//             scale: 1,
//             duration: 1.5,
//             ease: "power2.inOut"
//           },
//           "<"
//         )
//         .to({}, { duration: 4 }); // Pause between slides
//     });

//     // Floating animation for CTA
//     const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
//     floatTl.to(ctaRef.current, {
//       y: -10,
//       duration: 2,
//       ease: "sine.inOut"
//     });

//     return () => {
//       tl.kill();
//       carouselTl.kill();
//       floatTl.kill();
//     };
//   }, [heroData, loading]);

//   const goToSlide = (index) => {
//     // Kill existing animations
//     gsap.killTweensOf(".hero-slide");
    
//     // Animate current slide out
//     gsap.to(`.slide-${currentSlide}`, {
//       opacity: 0,
//       scale: 1.1,
//       duration: 0.8,
//       ease: "power2.inOut"
//     });
    
//     // Animate new slide in
//     gsap.fromTo(`.slide-${index}`,
//       { opacity: 0, scale: 1 },
//       {
//         opacity: 1,
//         scale: 1,
//         duration: 0.8,
//         ease: "power2.inOut",
//         onComplete: () => setCurrentSlide(index)
//       }
//     );
//   };

//   const nextSlide = () => {
//     goToSlide((currentSlide + 1) % heroData.length);
//   };

//   const prevSlide = () => {
//     goToSlide((currentSlide - 1 + heroData.length) % heroData.length);
//   };

//   const handleCTAClick = () => {
//     const currentData = heroData[currentSlide] || heroData[0];
//     if (currentData && currentData.link) {
//       window.location.href = currentData.link;
//     } else {
//       // Default action - scroll to products or navigate to products page
//       const productsSection = document.querySelector('#products');
//       if (productsSection) {
//         productsSection.scrollIntoView({ behavior: 'smooth' });
//       } else {
//         window.location.href = '/Products';
//       }
//     }
//   };

//   if (loading || heroData.length === 0) {
//     return (
//       <section className="relative h-screen md:h-screen overflow-hidden bg-gray-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading...</div>
//       </section>
//     );
//   }

//   const currentSlideData = heroData[currentSlide] || heroData[0];

//   return (
//     <section 
//       ref={containerRef} 
//       className="relative h-[80vh] mt-0 md:h-screen -mt-28 overflow-hidden bg-gray-900"
//     >
//       {/* Background Carousel - No overlay/color wrapper */}
//       <div ref={carouselRef} className="absolute inset-0">
//         {heroData.map((slide, index) => (
//           <div
//             key={index}
//             className={`hero-slide slide-${index} absolute inset-0 transition-opacity duration-1000 ${
//               index === 0 ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             {/* Background Image - Full clear image without any overlay */}
//             <img
//               src={slide.image}
//               alt={`Slide ${index + 1}`}
//               className="w-full h-full object-cover"
//               loading="eager"
//               onError={(e) => {
//                 e.target.src = `https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&h=800&fit=crop`;
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Content - Only Shop Now button */}
//       <div className="relative z-10 flex items-center justify-center h-full">
//         <div className="text-center px-4">
//           {/* Only CTA Button */}
//           <button
//             ref={ctaRef}
//             onClick={handleCTAClick}
//             className="bg-white text-gray-900 px-6 md:px-12 py-2 md:py-4 rounded-full font-bold
//             hover:bg-gray-100 transform hover:scale-105 transition-all duration-300
//             shadow-2xl border-2 border-white text-sm md:text-lg min-w-[120px] md:min-w-[200px] hover:shadow-3xl
//             active:scale-95"
//           >
//             {currentSlideData.cta}
//           </button>
//         </div>
//       </div>

//       {/* Carousel Indicators */}
//       <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-4 z-20">
//         {heroData.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 md:w-4 md:h-4 rounded-full cursor-pointer transition-all duration-300 border-2 border-white ${
//               currentSlide === index
//                 ? 'bg-white scale-125 shadow-lg'
//                 : 'bg-transparent hover:bg-white/50 hover:scale-110'
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button 
//         onClick={prevSlide}
//         className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 
//         bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center 
//         text-white text-lg md:text-2xl border-2 border-white/20 hover:bg-white/20 transition-all 
//         duration-300 z-20 hover:scale-110 hover:border-white/40 shadow-2xl
//         active:scale-95"
//         aria-label="Previous slide"
//       >
//         ‹
//       </button>
      
//       <button 
//         onClick={nextSlide}
//         className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 
//         bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center 
//         text-white text-lg md:text-2xl border-2 border-white/20 hover:bg-white/20 transition-all 
//         duration-300 z-20 hover:scale-110 hover:border-white/40 shadow-2xl
//         active:scale-95"
//         aria-label="Next slide"
//       >
//         ›
//       </button>

//       {/* Slide Counter */}
//       <div className="hidden md:block absolute top-8 right-8 bg-black/40 backdrop-blur-md rounded-full 
//         px-4 py-2 text-white font-semibold border border-white/20 z-20 shadow-2xl">
//         <span className="text-lg">{currentSlide + 1}</span>
//         <span className="text-white/60 mx-2">/</span>
//         <span className="text-white/60">{heroData.length}</span>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="hidden md:block absolute bottom-6 left-1/2 transform -translate-x-1/2 
//         text-white/70 animate-bounce z-10">
//         <div className="text-center">
//           <div className="text-sm mb-2 font-medium">Scroll to Explore</div>
//           <div className="text-2xl">↓</div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;