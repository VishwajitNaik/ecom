// Components/AboutUs.jsx
const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 bg-gradient-to-b from-blue-300 rounded-2xl shadow-2xl shadow-black hover:scale-105 transition-transform duration-300 to-gray-600 py-20 text-center max-w-6xl">
      <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-green-200 text-transparent bg-clip-text">
        About Our Store
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <p className="text-xl md:text-2xl mb-6 leading-relaxed opacity-95">
            Welcome to <span className="font-bold text-yellow-300">Ecom Store</span>, your premier destination for quality products and exceptional service.
          </p>
          <p className="text-lg md:text-xl mb-6 leading-relaxed opacity-90">
            Founded with a vision to revolutionize online shopping, we bring you carefully curated products 
            that combine quality, affordability, and style.
          </p>
          <p className="text-lg md:text-xl leading-relaxed opacity-90">
            Our commitment to customer satisfaction drives everything we do, from product selection 
            to delivery and beyond.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold mb-6 text-yellow-300">Why Choose Us?</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-4">
              <div className="text-2xl">🚀</div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Fast Shipping</h4>
                <p className="opacity-90">Delivery within 2-3 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">⭐</div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Quality Guarantee</h4>
                <p className="opacity-90">30-day money back guarantee</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">🔒</div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Secure Shopping</h4>
                <p className="opacity-90">SSL encrypted secure payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;