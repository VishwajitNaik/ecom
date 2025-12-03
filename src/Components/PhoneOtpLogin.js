// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { getFirebaseAuth } from '../lib/firebaseClient';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// import toast from 'react-hot-toast';
// import { gsap } from 'gsap';

// export default function PhoneOtpLogin({ onSuccess, onClose }) {
//   const auth = getFirebaseAuth();
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [confirmation, setConfirmation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtpFields, setShowOtpFields] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);

//   // Refs for animations
//   const modalRef = useRef(null);
//   const formRef = useRef(null);
//   const phoneInputRef = useRef(null);
//   const otpInputRef = useRef(null);
//   const buttonRef = useRef(null);

//   useEffect(() => {
//     if (!auth) {
//       toast.error('Firebase not initialized. Please refresh the page.');
//       return;
//     }

//     // Modal entrance animation
//     gsap.fromTo(modalRef.current,
//       { 
//         opacity: 0,
//         scale: 0.8,
//         y: 50,
//         rotationX: -10
//       },
//       { 
//         opacity: 1,
//         scale: 1,
//         y: 0,
//         rotationX: 0,
//         duration: 0.5,
//         ease: "back.out(1.2)"
//       }
//     );

//     // Background fade in
//     gsap.fromTo('.modal-backdrop',
//       { opacity: 0 },
//       { opacity: 1, duration: 0.3 }
//     );

//     // Input focus animations
//     const inputs = document.querySelectorAll('input');
//     inputs.forEach(input => {
//       input.addEventListener('focus', () => {
//         gsap.to(input, {
//           scale: 1.02,
//           borderColor: "#4F46E5",
//           boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
//           duration: 0.2,
//           ease: "power2.out"
//         });
//       });

//       input.addEventListener('blur', () => {
//         gsap.to(input, {
//           scale: 1,
//           borderColor: "#D1D5DB",
//           boxShadow: "none",
//           duration: 0.2,
//           ease: "power2.out"
//         });
//       });
//     });

//     // Resend timer logic
//     if (otpSent && resendTimer > 0) {
//       const timer = setInterval(() => {
//         setResendTimer(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [auth, otpSent, resendTimer]);

//   // Setup reCAPTCHA
//   const setupRecaptcha = () => {
//     if (typeof window === "undefined") return;
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         { size: "invisible" }
//       );
//     }
//     return window.recaptchaVerifier;
//   };

//   // Phone number validation
//   const handlePhoneChange = (e) => {
//     const value = e.target.value.replace(/\D/g, "");
//     if (value.length <= 10) setPhone(value);
//   };

//   const formattedPhone = `+91${phone}`;

//   // Send OTP with animation
//   const sendOtp = async () => {
//     if (phone.length !== 10) {
//       toast.error("Please enter a valid 10-digit phone number");
      
//       // Shake animation for error
//       if (phoneInputRef.current) {
//         gsap.fromTo(phoneInputRef.current,
//           { x: -5 },
//           { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: "power1.inOut" }
//         );
//       }
//       return;
//     }

//     try {
//       setLoading(true);
      
//       // Button loading animation
//       if (buttonRef.current) {
//         gsap.to(buttonRef.current, {
//           scale: 0.98,
//           duration: 0.1,
//           ease: "power2.out"
//         });
//       }

//       const recaptcha = setupRecaptcha();
//       const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
      
//       setConfirmation(confirmationResult);
//       setOtpSent(true);
//       setShowOtpFields(true);
//       setResendTimer(30); // 30 seconds timer
      
//       // Success animation for form transition
//       gsap.to(formRef.current, {
//         opacity: 0,
//         y: -20,
//         duration: 0.3,
//         onComplete: () => {
//           gsap.set(formRef.current, { opacity: 0, y: 20 });
//           gsap.to(formRef.current, {
//             opacity: 1,
//             y: 0,
//             duration: 0.4,
//             ease: "back.out(1.2)"
//           });
//         }
//       });

//       toast.success(`OTP sent to +91 ${phone}`);
      
//     } catch (err) {
//       console.error("OTP send error:", err);
//       toast.error("Failed to send OTP. Please try again.");
      
//       // Error animation
//       if (formRef.current) {
//         gsap.fromTo(formRef.current,
//           { x: -5 },
//           { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: "power1.inOut" }
//         );
//       }
//     } finally {
//       setLoading(false);
//       if (buttonRef.current) {
//         gsap.to(buttonRef.current, {
//           scale: 1,
//           duration: 0.2
//         });
//       }
//     }
//   };

//   // Resend OTP
//   const handleResendOtp = async () => {
//     if (resendTimer > 0) return;
    
//     try {
//       setLoading(true);
//       const recaptcha = setupRecaptcha();
//       const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
      
//       setConfirmation(confirmationResult);
//       setResendTimer(30);
      
//       // Resend animation
//       const resendBtn = document.querySelector('.resend-button');
//       if (resendBtn) {
//         gsap.to(resendBtn, {
//           scale: 0.95,
//           duration: 0.1,
//           yoyo: true,
//           repeat: 1,
//           ease: "power2.out",
//           onComplete: () => {
//             gsap.to(resendBtn, {
//               backgroundColor: "#10B981",
//               scale: 1.1,
//               duration: 0.3,
//               onComplete: () => {
//                 setTimeout(() => {
//                   gsap.to(resendBtn, {
//                     backgroundColor: "#6B7280",
//                     scale: 1,
//                     duration: 0.3
//                   });
//                 }, 500);
//               }
//             });
//           }
//         });
//       }
      
//       toast.success(`OTP resent to +91 ${phone}`);
//     } catch (err) {
//       console.error("Resend OTP error:", err);
//       toast.error("Failed to resend OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP with animation
//   const verifyOtp = async () => {
//     if (!otp.trim() || otp.length !== 6) {
//       toast.error('Please enter a valid 6-digit OTP');
      
//       if (otpInputRef.current) {
//         gsap.fromTo(otpInputRef.current,
//           { x: -5 },
//           { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: "power1.inOut" }
//         );
//       }
//       return;
//     }

//     try {
//       setLoading(true);
      
//       // Verify button animation
//       const verifyBtn = document.querySelector('.verify-button');
//       if (verifyBtn) {
//         gsap.to(verifyBtn, {
//           scale: 0.98,
//           duration: 0.1,
//           ease: "power2.out"
//         });
//       }

//       if (!confirmation) throw new Error('No confirmation result. Please send OTP first.');
//       const result = await confirmation.confirm(otp);
//       const user = result.user;

//       // Send to backend
//       const res = await fetch('/api/users/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone: user.phoneNumber, uid: user.uid }),
//       });
      
//       const data = await res.json();
//       if (res.ok && data.success) {
//         // Store visitor mobile after OTP verification
//         try {
//           await fetch('/api/visitors/store-mobile', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//               phone: user.phoneNumber, 
//               source: 'buy_now',
//               userId: data.userId,
//             }),
//           });
//         } catch (visitorError) {
//           console.error('Error storing visitor:', visitorError);
//         }

//         // Success animation
//         if (verifyBtn) {
//           gsap.to(verifyBtn, {
//             backgroundColor: "#10B981",
//             scale: 1.1,
//             duration: 0.3,
//             onComplete: () => {
//               toast.success('Login successful!');
//               if (onSuccess) onSuccess(user);
              
//               // Modal exit animation
//               gsap.to(modalRef.current, {
//                 opacity: 0,
//                 scale: 0.9,
//                 y: 30,
//                 duration: 0.4,
//                 onComplete: () => {
//                   if (onClose) onClose();
//                 }
//               });
//             }
//           });
//         }
//       } else {
//         throw new Error(data?.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error('OTP verify error:', err);
//       toast.error('Invalid OTP. Please try again.');
      
//       // Error animation
//       if (formRef.current) {
//         gsap.fromTo(formRef.current,
//           { x: -5 },
//           { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: "power1.inOut" }
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle back to phone input
//   const handleBackToPhone = () => {
//     gsap.to(formRef.current, {
//       opacity: 0,
//       y: 20,
//       duration: 0.3,
//       onComplete: () => {
//         setShowOtpFields(false);
//         setOtp('');
//         gsap.fromTo(formRef.current,
//           { opacity: 0, y: -20 },
//           { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
//         );
//       }
//     });
//   };

//   // Handle close with animation
//   const handleClose = () => {
//     gsap.to(modalRef.current, {
//       opacity: 0,
//       scale: 0.9,
//       y: 30,
//       duration: 0.4,
//       onComplete: () => {
//         if (onClose) onClose();
//       }
//     });
//   };

//   return (
//     <div className="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div 
//         ref={modalRef}
//         className="relative w-full max-w-md"
//       >
//         {/* Decorative top border */}
//         <div className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        
//         <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden border border-gray-200/50">
//           {/* Header */}
//           <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-800">Phone Verification</h3>
//                   <p className="text-sm text-gray-600">Secure login with OTP</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleClose}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//               >
//                 <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Form */}
//           <div ref={formRef} className="p-6">
//             {!showOtpFields ? (
//               // Phone Input Step
//               <div className="space-y-6">
//                 <div className="text-center mb-4">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
//                     <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <p className="text-gray-600">Enter your phone number to receive a verification code</p>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mobile Number *
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500 text-sm font-medium">+91</span>
//                       <div className="w-px h-6 bg-gray-300 ml-3"></div>
//                     </div>
//                     <input
//                       ref={phoneInputRef}
//                       type="tel"
//                       value={phone}
//                       onChange={handlePhoneChange}
//                       placeholder="98765 43210"
//                       className="w-full pl-16 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-lg font-medium"
//                       maxLength="10"
//                       disabled={loading}
//                       inputMode="numeric"
//                     />
//                     {phone.length > 0 && (
//                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                         <div className={`w-6 h-6 rounded-full flex items-center justify-center ${phone.length === 10 ? 'bg-green-100' : 'bg-red-100'}`}>
//                           <svg className={`w-4 h-4 ${phone.length === 10 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             {phone.length === 10 ? (
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                             ) : (
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             )}
//                           </svg>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number without country code</p>
//                 </div>

//                 <button
//                   ref={buttonRef}
//                   onClick={sendOtp}
//                   disabled={loading || phone.length !== 10}
//                   className={`w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
//                     loading || phone.length !== 10
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
//                   }`}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Sending OTP...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                       </svg>
//                       Send Verification Code
//                     </>
//                   )}
//                 </button>

//                 <div className="text-center">
//                   <p className="text-sm text-gray-600">
//                     By continuing, you agree to our{' '}
//                     <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Terms</a> and{' '}
//                     <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               // OTP Verification Step
//               <div className="space-y-6">
//                 <div className="text-center mb-4">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
//                     <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                     </svg>
//                   </div>
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2">Enter Verification Code</h4>
//                   <p className="text-gray-600">
//                     We sent a 6-digit code to <span className="font-semibold text-gray-800">+91 {phone}</span>
//                   </p>
//                   <button
//                     onClick={handleBackToPhone}
//                     className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                     </svg>
//                     Change phone number
//                   </button>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     6-digit Verification Code *
//                   </label>
//                   <div className="relative">
//                     <input
//                       ref={otpInputRef}
//                       type="tel"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                       placeholder="Enter 6-digit code"
//                       className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-center text-2xl font-bold tracking-widest"
//                       maxLength="6"
//                       disabled={loading}
//                       inputMode="numeric"
//                     />
//                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                       <div className="flex items-center gap-1">
//                         {[...Array(6)].map((_, i) => (
//                           <div
//                             key={i}
//                             className={`w-1.5 h-1.5 rounded-full ${i < otp.length ? 'bg-blue-600' : 'bg-gray-300'}`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between text-sm">
//                   <button
//                     onClick={handleResendOtp}
//                     disabled={resendTimer > 0 || loading}
//                     className={`resend-button py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
//                       resendTimer > 0 || loading
//                         ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
//                   </button>
                  
//                   {resendTimer > 0 && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-600 font-medium">Code sent</span>
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   onClick={verifyOtp}
//                   disabled={loading || otp.length !== 6}
//                   className="verify-button w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Verifying...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                       </svg>
//                       Verify & Continue
//                     </>
//                   )}
//                 </button>

//                 <div className="text-center pt-4 border-t border-gray-200">
//                   <p className="text-sm text-gray-600">
//                     Didn't receive the code?{' '}
//                     <button
//                       onClick={handleResendOtp}
//                       disabled={resendTimer > 0}
//                       className="text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       Resend via SMS
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* reCAPTCHA Container */}
//             <div id="recaptcha-container" className="hidden" />
//           </div>
//         </div>

//         {/* Security Badge */}
//         <div className="mt-4 text-center">
//           <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-full border border-gray-200">
//             <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span className="text-xs text-gray-600 font-medium">100% Secure • No spam</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from 'react';
import { getFirebaseAuth } from '../lib/firebaseClient';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function PhoneOtpLogin({ onSuccess, onClose }) {
  const auth = getFirebaseAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!auth) {
      toast.error('Firebase not initialized. Please refresh the page.');
    }

    // Resend timer logic
    if (otpSent && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [auth, otpSent, resendTimer]);

  // Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (typeof window === "undefined") return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return window.recaptchaVerifier;
  };

  // Phone number validation
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  const formattedPhone = `+91${phone}`;

  // Send OTP
  const sendOtp = async () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const recaptcha = setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
      
      setConfirmation(confirmationResult);
      setOtpSent(true);
      setResendTimer(30);
      
      toast.success(`OTP sent to +91 ${phone}`);
    } catch (err) {
      console.error("OTP send error:", err);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    try {
      setLoading(true);
      const recaptcha = setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
      
      setConfirmation(confirmationResult);
      setResendTimer(30);
      toast.success(`OTP resent to +91 ${phone}`);
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      if (!confirmation) throw new Error('No confirmation result. Please send OTP first.');
      const result = await confirmation.confirm(otp);
      const user = result.user;

      // Send to backend
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phoneNumber, uid: user.uid, guestId: (typeof window !== 'undefined' ? localStorage.getItem('guestId') : null) }),
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Login successful!');
        // Persist verified phone locally so checkout can use it
        try {
          if (user && user.phoneNumber) localStorage.setItem('userPhone', user.phoneNumber);
        } catch (e) {
          /* ignore */
        }
        // Persist JWT in localStorage so client-side `getUserFromToken` works
        try {
          if (data.token) localStorage.setItem('token', data.token);
        } catch (e) {
          /* ignore */
        }

        if (onSuccess) onSuccess(user);
        if (onClose) onClose();
      } else {
        throw new Error(data?.error || 'Login failed');
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle back to phone input
  const handleBackToPhone = () => {
    setOtpSent(false);
    setOtp('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="relative w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Decorative top border */}
        <div className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-blue-100 shadow-sm">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Phone Verification</h3>
                  <p className="text-sm text-gray-600">Secure login with OTP</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 transition-all duration-300">
            {!otpSent ? (
              // Phone Input Step
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Enter your phone number to receive a verification code</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm font-medium">+91</span>
                      <div className="w-px h-6 bg-gray-300 ml-3"></div>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="98765 43210"
                      className="w-full pl-16 pr-4 py-3.5 border border-gray-300 rounded-xl focus:scale-105 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-lg font-medium"
                      maxLength="10"
                      disabled={loading}
                      inputMode="numeric"
                    />
                    {phone.length > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${phone.length === 10 ? 'bg-green-100' : 'bg-red-100'}`}>
                          <svg className={`w-4 h-4 ${phone.length === 10 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {phone.length === 10 ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            )}
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number without country code</p>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading || phone.length !== 10}
                  className={`w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 ${
                    loading || phone.length !== 10
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Verification Code
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Terms</a> and{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
                  </p>
                </div>
              </div>
            ) : (
              // OTP Verification Step
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Enter Verification Code</h4>
                  <p className="text-gray-600">
                    We sent a 6-digit code to <span className="font-semibold text-gray-800">+91 {phone}</span>
                  </p>
                  <button
                    onClick={handleBackToPhone}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Change phone number
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6-digit Verification Code *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:scale-105 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 text-center text-2xl font-bold tracking-widest"
                      maxLength="6"
                      disabled={loading}
                      inputMode="numeric"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="flex items-center gap-1">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < otp.length ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                      resendTimer > 0 || loading
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                  
                  {resendTimer > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">Code sent</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Verify & Continue
                    </>
                  )}
                </button>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:scale-105 transition-transform"
                    >
                      Resend via SMS
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* reCAPTCHA Container */}
            <div id="recaptcha-container" className="hidden" />
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-full border border-gray-200">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-600 font-medium">100% Secure • No spam</span>
          </div>
        </div>
      </div>
    </div>
  );
}