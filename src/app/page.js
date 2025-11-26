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

"use client";
// Home.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import AboutUs from '../Components/AboutUs';
import Services from '../Components/Services';
import Contact from '../Components/Contact';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const welcomeRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP animations
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2,
          ease: "power3.out"
        }
      );

      // Welcome section animation
      gsap.fromTo(welcomeRef.current.querySelector('h1'),
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: welcomeRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(welcomeRef.current.querySelector('p'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: {
            trigger: welcomeRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // AboutUs section animation
      gsap.fromTo(aboutRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Services section animation with staggered items
      gsap.fromTo(servicesRef.current.querySelectorAll('.service-item'),
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Contact section animation
      gsap.fromTo(contactRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax effect for welcome section
      gsap.to(welcomeRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: welcomeRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Floating animation for elements
      const floatAnimation = gsap.to(welcomeRef.current, {
        y: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Clean up floating animation
      return () => floatAnimation.kill();
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden">
      <Navbar />
      <main className='bg-gradient-to-br from-blue-500 to-purple-300'>
        {/* Hero Banner Carousel */}
        <div ref={heroRef}>
          <Hero />
        </div>

        {/* Welcome Section with Parallax */}
        <section 
          ref={welcomeRef}
          className="py-20  text-gray-800 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-500 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-6">
              Welcome to Ecom Store
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover amazing products at great prices. Experience seamless shopping with premium quality and exceptional service.
            </p>
            
            {/* Animated CTA Button */}
            <div className="mt-8">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-purple-700">
                Start Shopping Now
              </button>
            </div>
          </div>
        </section>

        {/* AboutUs Section */}
        <div ref={aboutRef}>
          <AboutUs />
        </div>

        {/* Services Section */}
        <div ref={servicesRef}>
          <Services />
        </div>

        {/* Contact Section */}
        <div ref={contactRef}>
          <Contact />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-110 transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}