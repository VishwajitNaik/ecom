"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function VisitorForm({ onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [randomProduct, setRandomProduct] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch("/api/coupons/public");
        const data = await response.json();
        if (response.ok) {
          setCoupons(data);
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      }
    };

    const fetchRandomProduct = async () => {
      try {
        const response = await fetch("/api/products");
        const products = await response.json();
        if (response.ok && products && products.length > 0) {
          const randomIndex = Math.floor(Math.random() * products.length);
          setRandomProduct(products[randomIndex]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchCoupons();
    fetchRandomProduct();

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "auto";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  // Handle video autoplay with audio enabled
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && showVideo) {
        try {
          // Set volume to 50% and ensure audio is enabled
          videoRef.current.volume = 0.5;
          videoRef.current.muted = false;
          
          // Important: Remove any muted attribute
          videoRef.current.removeAttribute('muted');
          
          // Try to play the video with audio
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Video playing with audio enabled");
            }).catch((err) => {
              console.log("Autoplay prevented:", err);
              // Show a toast asking user to click to enable audio
              toast.error("Click anywhere to enable audio", {
                duration: 3000,
              });
              
              // Add one-time click handler to enable audio and play
              const enableAudio = () => {
                if (videoRef.current) {
                  videoRef.current.muted = false;
                  videoRef.current.play();
                  toast.success("🔊 Audio enabled!");
                }
                document.removeEventListener('click', enableAudio);
              };
              document.addEventListener('click', enableAudio);
            });
          }
          
          // Hide video after it plays once (when ended)
          videoRef.current.onended = () => {
            setTimeout(() => {
              setShowVideo(false);
            }, 500);
          };
          
        } catch (err) {
          console.error("Video playback error:", err);
        }
      }
    };
    
    if (showVideo) {
      // Small delay to ensure video element is ready
      setTimeout(() => {
        playVideo();
      }, 100);
    }
  }, [showVideo]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      toast.error("कृपया सभी फ़ील्ड भरें");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/visitors/store-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।");
        localStorage.setItem("visitorFormSubmitted", "true");
        onClose();
      } else {
        toast.error(data.error || "सबमिट करने में विफल");
      }
    } catch (error) {
      toast.error("कुछ गलत हो गया");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.setItem("visitorFormCancelled", Date.now().toString());
    onClose();
  };

  const skipVideo = () => {
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[10000] p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md mx-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 my-8"
      >
        
        {/* Video Section - 50% of screen height */}
        {showVideo && (
          <div className="relative bg-black h-[50vh]">
            {/* Video Player */}
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src="/assets/Shuga_amrit.mp4"
                className="w-full h-full object-cover"
                playsInline
                preload="auto"
                autoPlay
                muted={false}
                style={{
                  filter: 'contrast(1.1) brightness(1.05)',
                }}
                onError={(e) => {
                  console.error("Video failed to load:", e);
                  setShowVideo(false);
                }}
              />
              
              {/* Skip Button Only */}
              <div className="absolute inset-0 pointer-events-none">
                <button
                  onClick={skipVideo}
                  className="absolute top-4 right-4 px-4 py-2 bg-black/60 hover:bg-black/80 rounded-lg text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm pointer-events-auto z-20"
                >
                  Skip Video →
                </button>
              </div>

              {/* Audio Indicator */}
              <div className="absolute bottom-4 left-4 pointer-events-auto">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="text-white text-xs flex items-center gap-1">
                    <span className="text-green-400">●</span> Audio Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Section - Always visible */}
        <div className={`transition-all duration-500 ${showVideo ? 'max-h-[50vh] overflow-y-auto' : ''}`}>
          <div className="p-6">
            {!showVideo && (
              <>
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  जल्दी पहुंच ऑफर
                </h2>
                <p className="text-center text-gray-500 text-sm mb-4">
                  हमारे नए कलेक्शन का अनुभव करने वाले पहले व्यक्ति बनें
                </p>
              </>
            )}

            {/* Coupons Section */}
            {coupons.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏷️</span>
                  <p className="text-sm font-semibold text-yellow-800">सक्रिय कूपन कोड:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {coupons.map((coupon) => (
                    <div key={coupon._id} className="group relative">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-lg text-sm font-mono font-bold shadow-md flex items-center gap-1">
                        <span>🎫</span>
                        {coupon.code}
                        <span className="text-xs bg-white/20 px-1 rounded ml-1">
                          {coupon.discountPercentage}% छूट
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features List - Only show when video is hidden */}
            {!showVideo && (
              <div className="flex justify-around mb-5 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-lg">🚀</span>
                  </div>
                  <span className="text-xs text-gray-600">जल्दी पहुंच</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-lg">💰</span>
                  </div>
                  <span className="text-xs text-gray-600">विशेष ऑफर</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-lg">🎁</span>
                  </div>
                  <span className="text-xs text-gray-600">मुफ्त गिफ्ट</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <span>👤</span> पूरा नाम
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border text-gray-800 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="अपना पूरा नाम दर्ज करें"
                  required
                />
              </div>

              {/* Phone Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <span>📱</span> मोबाइल नंबर
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full border text-gray-800 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="10 अंकों का मोबाइल नंबर दर्ज करें"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">हम WhatsApp पर अपडेट भेजेंगे</p>
              </div>

              {/* Address Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <span>📍</span> डिलीवरी पता
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border text-gray-800 border-gray-200 rounded-xl p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="अपना पूरा पता दर्ज करें"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-98"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      सबमिट हो रहा...
                    </div>
                  ) : (
                    "🚀 जल्दी पहुंच पाएं"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  रद्द करें
                </button>
              </div>
            </form>

            {/* Trust Badge */}
            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">🔒 सुरक्षित</span>
                <span>•</span>
                <span className="flex items-center gap-1">✓ कोई स्पैम नहीं</span>
                <span>•</span>
                <span className="flex items-center gap-1">⚡ तुरंत पहुंच</span>
              </div>
            </div>

            {/* Product Section - Below Submit Button */}
            {randomProduct && !showVideo && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🎯</div>
                    <p className="text-sm font-semibold text-blue-800">फीचर्ड प्रोडक्ट</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={randomProduct.images?.[0] || '/placeholder.png'}
                      alt={randomProduct.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Product';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-800">{randomProduct.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{randomProduct.name}</p>
                      <p className="text-xl font-bold text-green-600 mt-2">₹{randomProduct.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoom-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
        
        /* Custom scrollbar for better UX */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c4c4c4;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a3a3a3;
        }
      `}</style>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function VisitorForm({ onClose }) {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [coupons, setCoupons] = useState([]);
//   const [randomProduct, setRandomProduct] = useState(null);

//   useEffect(() => {
//     const fetchCoupons = async () => {
//       try {
//         const response = await fetch("/api/coupons/public");
//         const data = await response.json();
//         if (response.ok) {
//           setCoupons(data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch coupons:", error);
//       }
//     };

//     const fetchRandomProduct = async () => {
//       try {
//         const response = await fetch("/api/products");
//         const products = await response.json();
//         if (response.ok && products && products.length > 0) {
//           const randomIndex = Math.floor(Math.random() * products.length);
//           setRandomProduct(products[randomIndex]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//       }
//     };

//     fetchCoupons();
//     fetchRandomProduct();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !phone || !address) {
//       toast.error("All fields are required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/visitors/store-mobile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, phone, address }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Thank you for your interest! We'll be in touch soon.");
//         localStorage.setItem("visitorFormSubmitted", "true");
//         onClose();
//       } else {
//         toast.error(data.error || "Failed to submit");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     localStorage.setItem("visitorFormCancelled", Date.now().toString());
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-md mx-auto overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
//         {/* Hero Video Section */}
//         <div className="relative h-40 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
//           <video
//             src="/assets/Shuga_amrit.mp4"
//             className="w-full h-full object-cover opacity-80"
//             autoPlay
//             muted
//             loop
//             playsInline
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
//             <div className="text-center">
//               <div className="text-white text-3xl font-bold">🎁</div>
//               <p className="text-white text-sm font-medium">Limited Time Offer</p>
//             </div>
//           </div>
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Content Section */}
//         <div className="p-6">
//           <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//             Early Access Offer
//           </h2>
//           <p className="text-center text-gray-500 text-sm mb-4">
//             Be the first to experience our new collection
//           </p>

//           {/* Coupons Section */}
//           {coupons.length > 0 && (
//             <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-5">
//               <div className="flex items-center gap-2 mb-3">
//                 <span className="text-2xl">🏷️</span>
//                 <p className="text-sm font-semibold text-yellow-800">Active Coupon Codes:</p>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {coupons.map((coupon) => (
//                   <div key={coupon._id} className="group relative">
//                     <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-lg text-sm font-mono font-bold shadow-md flex items-center gap-1">
//                       <span>🎫</span>
//                       {coupon.code}
//                       <span className="text-xs bg-white/20 px-1 rounded ml-1">
//                         {coupon.discountPercentage}% OFF
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Features List */}
//           <div className="flex justify-around mb-5 text-center">
//             <div className="flex flex-col items-center">
//               <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
//                 <span className="text-lg">🚀</span>
//               </div>
//               <span className="text-xs text-gray-600">Early Access</span>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-1">
//                 <span className="text-lg">💰</span>
//               </div>
//               <span className="text-xs text-gray-600">Exclusive Deals</span>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-1">
//                 <span className="text-lg">🎁</span>
//               </div>
//               <span className="text-xs text-gray-600">Free Gifts</span>
//             </div>
//            </div>

//           {/* Random Product Display */}
//           {randomProduct && (
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-5">
//               <div className="flex items-center gap-3">
//                 <div className="text-lg">🎯</div>
//                 <div className="flex-1">
//                   <p className="text-sm font-semibold text-blue-800 mb-1">Featured Product</p>
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={randomProduct.images?.[0] || '/placeholder.png'}
//                       alt={randomProduct.name}
//                       className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//                       onError={(e) => {
//                         e.target.src = '/placeholder.png';
//                       }}
//                     />
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800 truncate">{randomProduct.name}</p>
//                       <p className="text-lg font-bold text-green-600">₹{randomProduct.price}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Name Input */}
//             <div className="relative">
//               <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
//                 <span>👤</span> Full Name
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full border text-gray-800 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                 placeholder="Enter your full name"
//                 required
//               />
//             </div>

//             {/* Phone Input */}
//             <div className="relative">
//               <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
//                 <span>📱</span> Phone Number
//               </label>
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
//                 className="w-full border text-gray-800 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                 placeholder="Enter 10 digit mobile number"
//                 required
//               />
//               <p className="text-xs text-gray-400 mt-1">We'll send updates via WhatsApp</p>
//             </div>

//             {/* Address Input */}
//             <div className="relative">
//               <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
//                 <span>📍</span> Delivery Address
//               </label>
//               <textarea
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="w-full border text-gray-800 border-gray-200 rounded-xl p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                 placeholder="Enter your complete address"
//                 required
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 pt-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-98"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Submitting...
//                   </div>
//                 ) : (
//                   "🚀 Get Early Access"
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>

//           {/* Trust Badge */}
//           <div className="mt-5 pt-4 border-t border-gray-100 text-center">
//             <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
//               <span className="flex items-center gap-1">🔒 Secure</span>
//               <span>•</span>
//               <span className="flex items-center gap-1">✓ No Spam</span>
//               <span>•</span>
//               <span className="flex items-center gap-1">⚡ Instant Access</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//         @keyframes zoom-in {
//           from {
//             transform: scale(0.95);
//             opacity: 0;
//           }
//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
//         .animate-in {
//           animation-duration: 0.3s;
//           animation-fill-mode: both;
//         }
//         .fade-in {
//           animation-name: fade-in;
//         }
//         .zoom-in {
//           animation-name: zoom-in;
//         }
//       `}</style>
//     </div>
//   );
// }

