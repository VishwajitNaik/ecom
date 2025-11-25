// 'use client';

// import { useState, useEffect } from 'react';
// import Product from '../../Components/Product';
// import Navbar from '../../Components/Navbar';

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch('/api/products')
//       .then(res => res.json())
//       .then(data => setProducts(data))
//       .catch(err => console.error('Error fetching products:', err));
//   }, []);

//   return (
//     <div className="min-h-screen bg-zinc-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8 text-gray-800">
//         <h1 className="text-3xl font-bold mb-8">Our Products</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map(product => (
//             <Product key={product._id} product={product} />
//           ))}
//         </div>
//         {products.length === 0 && (
//           <p className="text-center text-gray-500">No products available.</p>
//         )}
//       </main>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Product from '../../Components/Product';
import Navbar from '../../Components/Navbar';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [productPacks, setProductPacks] = useState([]);
  const [allItems, setAllItems] = useState([]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 text-gray-800">
        <h1 className="text-2xl lg:text-4xl font-bold mb-6 lg:mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Our Products
        </h1>
        
        {/* Mobile: 4 cards per row, Desktop: Single line scroll */}
        <div className="lg:flex lg:overflow-x-auto lg:pb-6 lg:gap-6 lg:scrollbar-hide">
          <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-nowrap">
            {allItems.map((item, index) => (
              <div key={`${item.itemType}-${item._id}`} className="w-full lg:w-auto">
                <Product product={item} index={index} />
              </div>
            ))}
          </div>
        </div>

        {allItems.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-8">No products available.</p>
        )}

        {allItems.length > 4 && (
          <div className="text-center mt-6 lg:mt-8">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white
              px-6 lg:px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700
              transition-all duration-300 transform hover:scale-105 shadow-lg text-sm lg:text-base">
              View All Items ({allItems.length})
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import Product from '../../Components/Product';
// import Navbar from '../../Components/Navbar';

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const containerRef = useRef(null);
//   const productsRef = useRef([]);

//   useEffect(() => {
//     fetch('/api/products')
//       .then(res => res.json())
//       .then(data => {
//         setProducts(data);
//         // Animate after data loads
//         setTimeout(() => {
//           animateProducts();
//         }, 100);
//       })
//       .catch(err => console.error('Error fetching products:', err));
//   }, []);

//   const animateProducts = () => {
//     if (productsRef.current.length === 0) return;

//     const tl = gsap.timeline();
    
//     tl.fromTo(containerRef.current,
//       { opacity: 0, y: 50 },
//       { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
//     )
//     .fromTo(productsRef.current,
//       {
//         opacity: 0,
//         x: 100,
//         scale: 0.8
//       },
//       {
//         opacity: 1,
//         x: 0,
//         scale: 1,
//         duration: 0.8,
//         stagger: 0.15,
//         ease: "back.out(1.7)"
//       },
//       "-=0.5"
//     );
//   };

//   const openProductModal = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
    
//     // Animate modal opening
//     gsap.fromTo(".product-modal",
//       {
//         opacity: 0,
//         scale: 0.8,
//         y: 50
//       },
//       {
//         opacity: 1,
//         scale: 1,
//         y: 0,
//         duration: 0.5,
//         ease: "power2.out"
//       }
//     );
//   };

//   const closeProductModal = () => {
//     // Animate modal closing
//     gsap.to(".product-modal", {
//       opacity: 0,
//       scale: 0.8,
//       y: 50,
//       duration: 0.3,
//       ease: "power2.in",
//       onComplete: () => {
//         setIsModalOpen(false);
//         setSelectedProduct(null);
//       }
//     });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const calculateDaysRemaining = (expireDate) => {
//     const today = new Date();
//     const expiry = new Date(expireDate);
//     const diffTime = expiry - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const addToProductsRef = (el, index) => {
//     if (el && !productsRef.current.includes(el)) {
//       productsRef.current[index] = el;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <Navbar />
      
//       <main ref={containerRef} className="container mx-auto px-4 py-8 text-gray-800" style={{ opacity: 0 }}>
//         <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Our Products
//         </h1>
        
//         {/* Single Line Grid - 4 products */}
//         <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide">
//           {products.slice(0, 4).map((product, index) => (
//             <div
//               key={product._id}
//               ref={(el) => addToProductsRef(el, index)}
//               className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 
//               hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
//               style={{ opacity: 0 }}
//             >
//               <div className="h-48 overflow-hidden">
//                 <img
//                   src={product.image || '/api/placeholder/320/192'}
//                   alt={product.name}
//                   className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
//                 />
//               </div>
              
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
//                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-2xl font-bold text-green-600">${product.price}</span>
//                   {product.discountPrice && (
//                     <span className="text-sm text-red-500 line-through">${product.discountPrice}</span>
//                   )}
//                 </div>

//                 {/* Date Information */}
//                 <div className="space-y-2 mb-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Manufactured:</span>
//                     <span className="text-gray-700 font-medium">
//                       {formatDate(product.manufacturedDate?.$date)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Expires:</span>
//                     <span className="text-gray-700 font-medium">
//                       {formatDate(product.expireDate?.$date)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Days Left:</span>
//                     <span className={`font-bold ${
//                       calculateDaysRemaining(product.expireDate?.$date) > 30 
//                         ? 'text-green-600' 
//                         : calculateDaysRemaining(product.expireDate?.$date) > 7 
//                         ? 'text-orange-500' 
//                         : 'text-red-600'
//                     }`}>
//                       {calculateDaysRemaining(product.expireDate?.$date)} days
//                     </span>
//                   </div>
//                 </div>

//                 {/* Stock Status */}
//                 <div className="flex items-center justify-between mb-4">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     product.stock > 10 
//                       ? 'bg-green-100 text-green-800' 
//                       : product.stock > 0 
//                       ? 'bg-orange-100 text-orange-800' 
//                       : 'bg-red-100 text-red-800'
//                   }`}>
//                     {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
//                   </span>
//                   <span className="text-sm text-gray-500">{product.stock} units</span>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3">
//                   <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg 
//                     hover:bg-blue-700 transition-colors duration-300 font-medium">
//                     Add to Cart
//                   </button>
//                   <button 
//                     onClick={() => openProductModal(product)}
//                     className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg 
//                     hover:bg-gray-300 transition-colors duration-300 font-medium"
//                   >
//                     More Info
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {products.length === 0 && (
//           <p className="text-center text-gray-500 text-lg">No products available.</p>
//         )}

//         {products.length > 4 && (
//           <div className="text-center mt-8">
//             <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
//               px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 
//               transition-all duration-300 transform hover:scale-105 shadow-lg">
//               View All Products ({products.length})
//             </button>
//           </div>
//         )}
//       </main>

//       {/* Product Modal */}
//       {isModalOpen && selectedProduct && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="product-modal bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               {/* Header */}
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
//                 <button 
//                   onClick={closeProductModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-300"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Product Image */}
//               <div className="mb-6">
//                 <img
//                   src={selectedProduct.image || '/api/placeholder/600/400'}
//                   alt={selectedProduct.name}
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//               </div>

//               {/* Product Details */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* Left Column */}
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
//                     <p className="text-gray-600">{selectedProduct.description}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Pricing</h3>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span>Price:</span>
//                         <span className="text-2xl font-bold text-green-600">${selectedProduct.price}</span>
//                       </div>
//                       {selectedProduct.discountPrice && (
//                         <div className="flex justify-between">
//                           <span>Original Price:</span>
//                           <span className="text-lg text-red-500 line-through">${selectedProduct.discountPrice}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Info</h3>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Manufactured:</span>
//                         <span className="font-medium">{formatDate(selectedProduct.manufacturedDate?.$date)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Expires:</span>
//                         <span className="font-medium">{formatDate(selectedProduct.expireDate?.$date)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Days Remaining:</span>
//                         <span className={`font-bold ${
//                           calculateDaysRemaining(selectedProduct.expireDate?.$date) > 30 
//                             ? 'text-green-600' 
//                             : calculateDaysRemaining(selectedProduct.expireDate?.$date) > 7 
//                             ? 'text-orange-500' 
//                             : 'text-red-600'
//                         }`}>
//                           {calculateDaysRemaining(selectedProduct.expireDate?.$date)} days
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Stock:</span>
//                         <span className={`font-medium ${
//                           selectedProduct.stock > 10 
//                             ? 'text-green-600' 
//                             : selectedProduct.stock > 0 
//                             ? 'text-orange-500' 
//                             : 'text-red-600'
//                         }`}>
//                           {selectedProduct.stock} units
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {selectedProduct.category && (
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-2">Category</h3>
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                         {selectedProduct.category}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-4 pt-6 border-t border-gray-200">
//                 <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg 
//                   hover:bg-blue-700 transition-colors duration-300 font-semibold text-lg">
//                   Add to Cart
//                 </button>
//                 <button className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg 
//                   hover:bg-gray-300 transition-colors duration-300 font-semibold text-lg">
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }