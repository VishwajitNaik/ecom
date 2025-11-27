  // 'use client';

  // import { useState } from 'react';
  // import { useRouter } from 'next/navigation';
  // import Link from 'next/link';
  // import toast from 'react-hot-toast';
  // import Navbar from '../../../Components/Navbar';

  // export default function SignUp() {
  //   const router = useRouter();
  //   const [name, setName] = useState('');
  //   const [email, setEmail] = useState('');
  //   const [phone, setPhone] = useState('');
  //   const [password, setPassword] = useState('');

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     // Handle sign up logic
  //     const res = await fetch('/api/user/signup', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ name, email: email || undefined, phone, password }),
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       toast.success('Signed up successfully');
  //       router.push('/user/SignIn');
  //     } else {
  //       toast.error(data.error);
  //     }
  //   };

  //   return (
  //     <div className="min-h-screen -mt-5 pt-5 bg-zinc-50">
  //       <Navbar />
  //       <main className="container mx-auto px-4 py-8 text-gray-800">
  //         <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
  //           <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
  //           <form onSubmit={handleSubmit}>
  //             <div className="mb-4">
  //               <label className="block text-sm font-medium text-gray-700">Name</label>
  //               <input
  //                 type="text"
  //                 value={name}
  //                 onChange={(e) => setName(e.target.value)}
  //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
  //                 required
  //               />
  //             </div>
  //             <div className="mb-4">
  //               <label className="block text-sm font-medium text-gray-700">Phone</label>
  //               <input
  //                 type="tel"
  //                 value={phone}
  //                 onChange={(e) => setPhone(e.target.value)}
  //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
  //                 required
  //               />
  //             </div>
  //             <div className="mb-4">
  //               <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
  //               <input
  //                 type="email"
  //                 value={email}
  //                 onChange={(e) => setEmail(e.target.value)}
  //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
  //               />
  //             </div>
  //             <div className="mb-4">
  //               <label className="block text-sm font-medium text-gray-700">Password</label>
  //               <input
  //                 type="password"
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
  //                 required
  //               />
  //             </div>
  //             <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
  //               Sign Up
  //             </button>
  //           </form>
  //           <p className="mt-4 text-center">
  //             Already have an account? <Link href="/user/SignIn" className="text-blue-600 hover:underline">Sign In</Link>
  //           </p>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import Navbar from '../../../Components/Navbar';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!hasAnimatedRef.current && containerRef.current) {
      const tl = gsap.timeline();
      
      // Background elements animation
      tl.fromTo('.bg-shape-1',
        { x: -100, y: -100, opacity: 0, rotation: -45 },
        { x: 0, y: 0, opacity: 0.3, rotation: 0, duration: 1, ease: "power2.out" }
      );
      
      tl.fromTo('.bg-shape-2',
        { x: 100, y: 100, opacity: 0, rotation: 45 },
        { x: 0, y: 0, opacity: 0.2, rotation: 0, duration: 1, ease: "power2.out" },
        "-=0.8"
      );

      // Form container animation
      tl.fromTo(formRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        },
        "-=0.5"
      );

      // Form elements stagger animation
      tl.fromTo('.form-element',
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        },
        "-=0.3"
      );

      hasAnimatedRef.current = true;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email || undefined, phone, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Success animation
        gsap.to(formRef.current, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
        
        toast.success('Account created successfully! Welcome!');
        setTimeout(() => {
          router.push('/user/SignIn');
        }, 1500);
      } else {
        // Error shake animation
        gsap.to(formRef.current, {
          x: 10,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: "power1.inOut"
        });
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-500 via-white to-slate-600 relative overflow-hidden"
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-shape-1 absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="bg-shape-2 absolute -bottom-20 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Form Container */}
          <div 
            ref={formRef}
            className="text-gray-800 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 hover:shadow-3xl"
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Join Us Today</h1>
              <p className="text-blue-100 text-sm">Create your account and start your journey</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Enter your full name"
                      required
                    />
                    <div className="absolute right-3 top-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Enter your phone number"
                      required
                    />
                    <div className="absolute right-3 top-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Enter your email address"
                    />
                    <div className="absolute right-3 top-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-element">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Create a strong password"
                      required
                    />
                    <div className="absolute right-3 top-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-element pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sign In Link */}
              <div className="form-element text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/user/SignIn" 
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                  >
                    Sign In
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your information is securely encrypted
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.2; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}