
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import Product from '../../Components/Product';
// import Navbar from '../../Components/Navbar';

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [productPacks, setProductPacks] = useState([]);
//   const [allItems, setAllItems] = useState([]);
//   const containerRef = useRef(null);
//   const productsScrollRef = useRef(null);
//   const packsScrollRef = useRef(null);
//   const hasAnimatedRef = useRef(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [productsRes, packsRes] = await Promise.all([
//           fetch('/api/products'),
//           fetch('/api/productPacks')
//         ]);

//         const productsData = await productsRes.json();
//         const packsData = await packsRes.json();

//         setProducts(productsData);
//         setProductPacks(packsData);

//         // Combine and mark types
//         const combined = [
//           ...productsData.map(p => ({ ...p, itemType: 'product' })),
//           ...packsData.map(p => ({ ...p, itemType: 'productPack' }))
//         ];
//         setAllItems(combined);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!containerRef.current || hasAnimatedRef.current || products.length === 0) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !hasAnimatedRef.current) {
//             const tl = gsap.timeline();

//             // Section titles animation
//             tl.fromTo('.section-title',
//               {
//                 y: 50,
//                 opacity: 0
//               },
//               {
//                 y: 0,
//                 opacity: 1,
//                 duration: 0.8,
//                 stagger: 0.3,
//                 ease: "back.out(1.8)"
//               }
//             );

//             // Product cards animation
//             tl.fromTo('.product-card',
//               {
//                 y: 100,
//                 opacity: 0,
//                 scale: 0.8
//               },
//               {
//                 y: 0,
//                 opacity: 1,
//                 scale: 1,
//                 duration: 0.6,
//                 stagger: 0.1,
//                 ease: "back.out(1.5)"
//               },
//               "-=0.4"
//             );

//             hasAnimatedRef.current = true;
//             observer.unobserve(entry.target);
//           }
//         });
//       },
//       {
//         threshold: 0.1,
//         rootMargin: '-50px 0px'
//       }
//     );

//     observer.observe(containerRef.current);

//     return () => {
//       observer.disconnect();
//     };
//   }, [products.length]);

//   // Slider navigation functions
//   const scrollLeft = (scrollRef) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = (scrollRef) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div ref={containerRef} className="min-h-screen bg-gradient-to-br -mt-5 pt-5 from-blue-50 to-indigo-100">
//       <Navbar />
      
//       <main className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 text-gray-800">
//         <h1 className="text-2xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Our Products
//         </h1>
        
//         {/* Products Section */}
//         {products.length > 0 && (
//           <section className="mb-12 lg:mb-16">
//             <h2 className="section-title text-xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800 text-center">
//               Individual Products
//             </h2>
            
//             <div className="relative">
//               {/* Desktop: Horizontal Scroll with Slider */}
//               <div className="hidden lg:block relative">
//                 <div 
//                   ref={productsScrollRef}
//                   className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide scroll-smooth"
//                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//                 >
//                   {products.map((product, index) => (
//                     <div key={`product-${product._id}`} className="flex-shrink-0 product-card">
//                       <Product product={{...product, itemType: 'product'}} index={index} />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Slider Navigation Arrows */}
//                 {products.length > 3 && (
//                   <>
//                     <button 
//                       onClick={() => scrollLeft(productsScrollRef)}
//                       className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
//                     >
//                       <span className="text-gray-600 font-bold text-lg">‹</span>
//                     </button>
//                     <button 
//                       onClick={() => scrollRight(productsScrollRef)}
//                       className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
//                     >
//                       <span className="text-gray-600 font-bold text-lg">›</span>
//                     </button>
//                   </>
//                 )}
//               </div>

//               {/* Mobile: Grid Layout */}
//               <div className="lg:hidden grid grid-cols-2 gap-3">
//                 {products.map((product, index) => (
//                   <div key={`product-${product._id}`} className="w-full product-card">
//                     <Product product={{...product, itemType: 'product'}} index={index} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Product Packs Section */}
//         {productPacks.length > 0 && (
//           <section className="mb-12 lg:mb-16">
//             <h2 className="section-title text-xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800 text-center">
//               Product Packs & Bundles
//             </h2>
            
//             <div className="relative">
//               {/* Desktop: Horizontal Scroll with Slider */}
//               <div className="hidden lg:block relative">
//                 <div 
//                   ref={packsScrollRef}
//                   className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide scroll-smooth"
//                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//                 >
//                   {productPacks.map((pack, index) => (
//                     <div key={`pack-${pack._id}`} className="flex-shrink-0 product-card">
//                       <Product product={{...pack, itemType: 'productPack'}} index={index} />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Slider Navigation Arrows */}
//                 {productPacks.length > 3 && (
//                   <>
//                     <button 
//                       onClick={() => scrollLeft(packsScrollRef)}
//                       className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
//                     >
//                       <span className="text-gray-600 font-bold text-lg">‹</span>
//                     </button>
//                     <button 
//                       onClick={() => scrollRight(packsScrollRef)}
//                       className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
//                     >
//                       <span className="text-gray-600 font-bold text-lg">›</span>
//                     </button>
//                   </>
//                 )}
//               </div>

//               {/* Mobile: Grid Layout */}
//               <div className="lg:hidden grid grid-cols-2 gap-3">
//                 {productPacks.map((pack, index) => (
//                   <div key={`pack-${pack._id}`} className="w-full product-card">
//                     <Product product={{...pack, itemType: 'productPack'}} index={index} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Empty State */}
//         {allItems.length === 0 && (
//           <div className="text-center py-12">
//             <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-4xl">📦</span>
//             </div>
//             <p className="text-gray-500 text-lg">No products available at the moment.</p>
//             <p className="text-gray-400 text-sm mt-2">Check back later for new arrivals!</p>
//           </div>
//         )}

//         {/* View All Button */}
//         {allItems.length > 0 && (
//           <div className="text-center mt-8 lg:mt-12">
//             <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white
//               px-8 lg:px-12 py-3 lg:py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700
//               transition-all duration-300 transform hover:scale-105 shadow-lg text-base lg:text-lg">
//               View All Items ({allItems.length})
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Product from '../../Components/Product';
import Navbar from '../../Components/Navbar';
import CheckoutModal from '../../Components/CheckoutModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [productPacks, setProductPacks] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const containerRef = useRef(null);
  const productsScrollRef = useRef(null);
  const packsScrollRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, packsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/productPacks')
        ]);

        const productsData = await productsRes.json();
        const packsData = await packsRes.json();

        setProducts(productsData);
        setProductPacks(packsData);

        // Combine and mark types
        const combined = [
          ...productsData.map(p => ({ ...p, itemType: 'product' })),
          ...packsData.map(p => ({ ...p, itemType: 'productPack' }))
        ];
        setAllItems(combined);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current || products.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            const tl = gsap.timeline();

            // Section titles animation
            tl.fromTo('.section-title',
              {
                y: 50,
                opacity: 0
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.3,
                ease: "back.out(1.8)"
              }
            );

            // Product cards animation
            tl.fromTo('.product-card',
              {
                y: 100,
                opacity: 0,
                scale: 0.8
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.5)"
              },
              "-=0.4"
            );

            hasAnimatedRef.current = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [products.length]);

  // Handle Buy Now from any product
  const handleBuyNow = (product, quantity) => {
    setSelectedProduct(product);
    setSelectedQuantity(quantity);
    setShowCheckout(true);
  };

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    setSelectedProduct(null);
    setSelectedQuantity(1);
  };

  // Slider navigation functions
  const scrollLeft = (scrollRef) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (scrollRef) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br -mt-5 pt-5 from-slate-300 to-indigo-100">
      <Navbar />
      
      <main className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 text-gray-800">
        <h1 className="text-2xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Our Products
        </h1>
        
        {/* Products Section */}
        {products.length > 0 && (
          <section className="mb-12 lg:mb-16">
            <h2 className="section-title text-xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800 ">
              Individual Products
            </h2>
            
            <div className="relative">
              {/* Desktop: Horizontal Scroll with Slider */}
              <div className="hidden lg:block relative">
                <div 
                  ref={productsScrollRef}
                  className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {products.map((product, index) => (
                    <div key={`product-${product._id}`} className="flex-shrink-0 product-card">
                      <Product 
                        product={{...product, itemType: 'product'}} 
                        index={index}
                        onBuyNow={handleBuyNow}
                      />
                    </div>
                  ))}
                </div>

                {/* Slider Navigation Arrows */}
                {products.length > 3 && (
                  <>
                    <button 
                      onClick={() => scrollLeft(productsScrollRef)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
                    >
                      <span className="text-gray-600 font-bold text-lg">‹</span>
                    </button>
                    <button 
                      onClick={() => scrollRight(productsScrollRef)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
                    >
                      <span className="text-gray-600 font-bold text-lg">›</span>
                    </button>
                  </>
                )}
              </div>

              {/* Mobile: Grid Layout */}
              <div className="lg:hidden grid grid-cols-2 gap-3">
                {products.map((product, index) => (
                  <div key={`product-${product._id}`} className="w-full product-card">
                    <Product 
                      product={{...product, itemType: 'product'}} 
                      index={index}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Product Packs Section */}
        {productPacks.length > 0 && (
          <section className="mb-12 lg:mb-16">
            <h2 className="section-title text-xl lg:text-3xl font-bold mb-6 lg:mb-8 text-gray-800">
              Product Packs & Bundles
            </h2>
            
            <div className="relative">
              {/* Desktop: Horizontal Scroll with Slider */}
              <div className="hidden lg:block relative">
                <div 
                  ref={packsScrollRef}
                  className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {productPacks.map((pack, index) => (
                    <div key={`pack-${pack._id}`} className="flex-shrink-0 product-card">
                      <Product 
                        product={{...pack, itemType: 'productPack'}} 
                        index={index}
                        onBuyNow={handleBuyNow}
                      />
                    </div>
                  ))}
                </div>

                {/* Slider Navigation Arrows */}
                {productPacks.length > 3 && (
                  <>
                    <button 
                      onClick={() => scrollLeft(packsScrollRef)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
                    >
                      <span className="text-gray-600 font-bold text-lg">‹</span>
                    </button>
                    <button 
                      onClick={() => scrollRight(packsScrollRef)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
                    >
                      <span className="text-gray-600 font-bold text-lg">›</span>
                    </button>
                  </>
                )}
              </div>

              {/* Mobile: Grid Layout */}
              <div className="lg:hidden grid grid-cols-2 gap-3">
                {productPacks.map((pack, index) => (
                  <div key={`pack-${pack._id}`} className="w-full product-card">
                    <Product 
                      product={{...pack, itemType: 'productPack'}} 
                      index={index}
                      onBuyNow={handleBuyNow}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {allItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new arrivals!</p>
          </div>
        )}

        {/* View All Button */}
        {allItems.length > 0 && (
          <div className="text-center mt-8 lg:mt-12">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white
              px-8 lg:px-12 py-3 lg:py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700
              transition-all duration-300 transform hover:scale-105 shadow-lg text-base lg:text-lg">
              View All Items ({allItems.length})
            </button>
          </div>
        )}
      </main>

      {/* Single Checkout Modal at Root Level - This will open full screen */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={selectedProduct ? [{ 
          productId: selectedProduct, 
          quantity: selectedQuantity, 
          itemType: selectedProduct.itemType 
        }] : []}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}