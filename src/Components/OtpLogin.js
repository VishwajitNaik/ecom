"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { generateAndSaveFCMToken } from "../lib/generateFCMToken";

export default function OtpLogin({ onSuccess, onClose }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const containerRef = useRef(null);
  const otpInputsRef = useRef([]);
  const phoneInputRef = useRef(null);

  // Simple animation functions without gsap
  const animateElement = (element, animationType) => {
    if (!element) return;
    
    switch(animationType) {
      case 'shake':
        element.style.transition = 'transform 0.5s';
        element.style.transform = 'translateX(10px)';
        setTimeout(() => {
          element.style.transform = 'translateX(-10px)';
          setTimeout(() => {
            element.style.transform = 'translateX(0)';
          }, 100);
        }, 100);
        break;
      case 'scale':
        element.style.transition = 'transform 0.2s';
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 200);
        break;
      case 'pulse':
        element.style.transition = 'opacity 0.5s';
        element.style.opacity = '0.5';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 500);
        break;
    }
  };

  // OTP input focus management
  useEffect(() => {
    if (step === 2 && otpInputsRef.current[0]) {
      otpInputsRef.current[0].focus();
    }
  }, [step]);

  // Resend timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error("कृपया वैध मोबाइल नंबर प्रविष्ट करा");
      if (phoneInputRef.current) {
        animateElement(phoneInputRef.current, 'shake');
      }
      return;
    }

    setLoading(true);
    
    if (phoneInputRef.current) {
      animateElement(phoneInputRef.current, 'scale');
    }

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP यशस्वीरित्या पाठवला गेला!");
        setStep(2);
        setResendTimer(30);
      } else {
        toast.error(data.error || "OTP पाठवण्यात अयशस्वी");
      }
    } catch (error) {
      toast.error("OTP पाठवण्यात अयशस्वी");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = code.join("");
    if (otpCode.length !== 6) {
      toast.error("कृपया 6 अंकी OTP प्रविष्ट करा");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, code: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Generate FCM token for admins
        if (data.user && data.user.role === 'admin') {
          generateAndSaveFCMToken();
        }

        // Simple fade out animation
        if (containerRef.current) {
          containerRef.current.style.transition = 'all 0.5s';
          containerRef.current.style.transform = 'scale(1.2)';
          containerRef.current.style.opacity = '0';
          
          setTimeout(() => {
            toast.success("लॉगिन यशस्वी!");
            
            if (onSuccess) {
              onSuccess(data.user);
            } else {
              router.push("/");
            }
          }, 500);
        } else {
          toast.success("लॉगिन यशस्वी!");
          
          if (onSuccess) {
            onSuccess(data.user);
          } else {
            router.push("/");
          }
        }
      } else {
        toast.error(data.error || "अवैध OTP");
        
        // Shake all OTP inputs
        otpInputsRef.current.forEach((input, index) => {
          if (input) {
            setTimeout(() => {
              animateElement(input, 'shake');
            }, index * 50);
          }
        });
      }
    } catch (error) {
      toast.error("OTP सत्यापनात अयशस्वी");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPhone("");
    setCode(["", "", "", "", "", ""]);
    
    if (containerRef.current) {
      animateElement(containerRef.current, 'pulse');
    }
  };

  const handleOtpChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.replace(/\D/g, '').slice(0, 1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Animate the filled digit
    if (value && otpInputsRef.current[index]) {
      animateElement(otpInputsRef.current[index], 'scale');
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      sendOtp();
    }
  };

  const handlePhoneChange = (value) => {
    const formatted = value.replace(/\D/g, '').slice(0, 10);
    setPhone(formatted);
  };

  // SVG Icons
  const PhoneIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const MobileIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const KeyIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );

  const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br text-gray-800 from-blue-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        ref={containerRef}
        className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full relative overflow-hidden"
        style={{ transition: 'all 0.3s ease' }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-pink-200 to-red-200 rounded-full opacity-20 blur-xl"></div>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-300 z-10"
          >
            <CloseIcon />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {step === 1 ? (
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-white">
                    <PhoneIcon />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <div className="text-white text-sm">
                    <CheckIcon />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-white">
                    <LockIcon />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {step === 1 ? "📱 मोबाइल लॉगिन 📱" : "🔐 OTP सत्यापन 🔐"}
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            {step === 1 
              ? "आपल्या मोबाइल नंबरसह लॉगिन करा" 
              : "आपल्या मोबाइलवर पाठवलेला OTP प्रविष्ट करा"}
          </p>
        </div>

        {/* Step 1: Phone Number Input */}
        {step === 1 ? (
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2 text-blue-600"><MobileIcon /></span>
                मोबाइल नंबर
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">+91</span>
                </div>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="९९९९९९९९९९"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-lg font-semibold"
                  disabled={loading}
                  maxLength={10}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {phone.length >= 10 && (
                    <div className="text-green-500">
                      <CheckIcon />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * 10 अंकी मोबाइल नंबर प्रविष्ट करा
              </p>
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || phone.length < 10}
              className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-4 rounded-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                  <span className="ml-2">OTP पाठवत आहे...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-3"><SendIcon /></span>
                  OTP पाठवा
                </div>
              )}
            </button>
          </div>
        ) : (
          /* Step 2: OTP Verification */
          <div className="space-y-6">
            {/* Phone Number Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2"><PhoneIcon /></span>
                  <span className="font-medium text-gray-700">मोबाइल नंबर:</span>
                </div>
                <span className="font-bold text-gray-800">
                  +91 {phone}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                OTP आपल्या मोबाइलवर पाठवला गेला आहे
              </p>
            </div>

            {/* OTP Input - Market Style */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="mr-2 text-purple-600"><KeyIcon /></span>
                6-अंकी OTP प्रविष्ट करा
              </label>
              
              <div className="flex justify-center space-x-2 md:space-x-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => otpInputsRef.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onFocus={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '';
                    }}
                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none shadow-sm transition-all duration-300"
                    disabled={loading}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                ))}
              </div>
              
              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className={`text-sm font-medium ${
                    resendTimer > 0 
                      ? "text-gray-500 cursor-not-allowed" 
                      : "text-blue-600 hover:text-blue-800 transition-colors"
                  }`}
                >
                  {resendTimer > 0 
                    ? `${resendTimer} सेकंदात पुन्हा पाठवा` 
                    : "OTP पुन्हा पाठवा"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={resetForm}
                disabled={loading}
                className="flex items-center justify-center px-4 py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 transform hover:scale-[1.02] transition-all duration-300 shadow hover:shadow-md font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                मागे
              </button>
              
              <button
                onClick={verifyOtp}
                disabled={loading || code.some(d => !d)}
                className="flex items-center justify-center px-4 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">सत्यापन...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    सत्यापित करा
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>पुढे जाऊन, आपण आमच्या सेवा अटी आणि गोपनीयता धोरणाशी सहमत आहात</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className={`w-4 h-2 rounded-full ${step === 1 ? 'bg-pink-500' : 'bg-green-500'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { auth } from "../lib/firebase";
// import { sendOtpFirebase, verifyOtpFirebase } from "../lib/phoneAuth";
// import { generateAndSaveFCMToken } from "../lib/generateFCMToken";

// export default function OtpLogin({ onSuccess, onClose }) {
//   const router = useRouter();

//   const [phone, setPhone] = useState("");
//   const [code, setCode] = useState(["", "", "", "", "", ""]);
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);

//   const otpInputsRef = useRef([]);

//   /* ================== RECAPTCHA ================== */
//   // setupRecaptcha is now handled in phoneAuth.js

//   /* ================== TIMER ================== */
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   /* ================== SEND OTP ================== */
//   const sendOtp = async () => {
//     if (loading) return;

//     if (!phone || phone.length < 10) {
//       toast.error("Valid mobile number required");
//       return;
//     }

//     setLoading(true);

//     try {
//       await sendOtpFirebase(phone);

//       toast.success("OTP sent successfully!");
//       setStep(2);
//       setResendTimer(30);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================== VERIFY OTP ================== */
//   const verifyOtp = async () => {
//     if (loading) return;

//     const otp = code.join("");

//     if (otp.length !== 6) {
//       toast.error("Enter valid 6 digit OTP");
//       return;
//     }

//     setLoading(true);

//     try {
//       const user = await verifyOtpFirebase(otp);

//       // 🔥 Get Firebase token
//       const idToken = await user.getIdToken();

//       // 🔥 Send to backend
//       const res = await fetch("/api/auth/firebase-login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token: idToken }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token);

//         // FCM for admin
//         if (data.user?.role === "admin") {
//           generateAndSaveFCMToken();
//         }

//         toast.success("Login Successful");

//         if (onSuccess) onSuccess(data.user);
//         else router.push("/");
//       } else {
//         toast.error(data.error || "Login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================== OTP INPUT ================== */
//   const handleOtpChange = (index, value) => {
//     const newCode = [...code];
//     newCode[index] = value.replace(/\D/g, "").slice(0, 1);
//     setCode(newCode);

//     if (value && index < 5) {
//       otpInputsRef.current[index + 1]?.focus();
//     }

//     // Auto submit
//     if (newCode.join("").length === 6) {
//       verifyOtp();
//     }
//   };

//   /* ================== UI ================== */
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60">
//       <div className="bg-white p-6 rounded-xl w-full max-w-md">

//         {/* STEP 1 */}
//         {step === 1 && (
//           <>
//             <h2 className="text-xl font-bold mb-4">Login with Phone</h2>

//             <div className="flex items-center border p-3 rounded">
//               <span className="mr-2">+91</span>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) =>
//                   setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
//                 }
//                 className="outline-none w-full"
//                 placeholder="Enter mobile number"
//               />
//             </div>

//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 rounded mt-4"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         )}

//         {/* STEP 2 */}
//         {step === 2 && (
//           <>
//             <h2 className="text-xl font-bold mb-4">Enter OTP</h2>

//             <div className="flex gap-2 justify-center mb-4">
//               {code.map((d, i) => (
//                 <input
//                   key={i}
//                   ref={(el) => (otpInputsRef.current[i] = el)}
//                   value={d}
//                   onChange={(e) => handleOtpChange(i, e.target.value)}
//                   maxLength={1}
//                   className="w-10 h-12 text-center border rounded"
//                 />
//               ))}
//             </div>

//             <button
//               onClick={verifyOtp}
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-3 rounded"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>

//             <button
//               onClick={sendOtp}
//               disabled={resendTimer > 0}
//               className="text-sm mt-3 text-blue-500"
//             >
//               {resendTimer > 0
//                 ? `Resend in ${resendTimer}s`
//                 : "Resend OTP"}
//             </button>
//           </>
//         )}

//         {/* reCAPTCHA */}
//         <div id="recaptcha-container"></div>
//       </div>
//     </div>
//   );
// }