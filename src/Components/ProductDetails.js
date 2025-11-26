const ProductDetails = ({ product }) => {
  return (
    <div className="mt-12 space-y-8">
      
      {/* About This Product */}
      <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Product</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Safed Musali</strong> is a powerful Ayurvedic herb known for its incredible health benefits. 
            Our product is sourced directly from organic farms in the Himalayas and processed using traditional methods 
            to preserve its natural potency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">100% Natural & Organic</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">No Artificial Additives</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">GMP Certified Facility</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">Lab Tested for Purity</span>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Use</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Dosage Instructions</h3>
              <p className="text-gray-600">
                Take 1-2 teaspoons (5-10g) of Safed Musali powder twice daily, preferably with milk or warm water.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Best Time to Consume</h3>
              <p className="text-gray-600">
                Take in the morning on empty stomach and in the evening before dinner for best results.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Duration</h3>
              <p className="text-gray-600">
                Continue for 2-3 months for optimal benefits. Consult your healthcare provider for long-term use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Benefits */}
      <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-xl">⚖️</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Weight Management</h3>
            <p className="text-gray-600 text-sm">Helps in natural weight loss by boosting metabolism</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">💪</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Energy Boost</h3>
            <p className="text-gray-600 text-sm">Increases stamina and reduces fatigue naturally</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">🛡️</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Immunity</h3>
            <p className="text-gray-600 text-sm">Strengthens immune system and overall health</p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Trust Our Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-2xl">🏆</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Quality Certified</h3>
            <p className="text-gray-600 text-sm">GMP & ISO Certified manufacturing</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-2xl">🌿</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">100% Natural</h3>
            <p className="text-gray-600 text-sm">No chemicals or preservatives</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-2xl">🔬</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Lab Tested</h3>
            <p className="text-gray-600 text-sm">Third-party laboratory tested</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-2xl">👍</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">10,000+ Happy Customers</h3>
            <p className="text-gray-600 text-sm">Trusted by thousands worldwide</p>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <span className="ml-2 text-sm text-gray-600">5.0</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              "Amazing results! Lost 8kg in 2 months naturally. Highly recommended!"
            </p>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                <span className="text-gray-600 text-sm">R</span>
              </div>
              <span className="text-gray-800 font-medium text-sm">Rahul Sharma</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {'★'.repeat(4)}
                {'☆'.repeat(1)}
              </div>
              <span className="ml-2 text-sm text-gray-600">4.0</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              "Good product for energy. Feeling more active throughout the day."
            </p>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                <span className="text-gray-600 text-sm">P</span>
              </div>
              <span className="text-gray-800 font-medium text-sm">Priya Patel</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <span className="ml-2 text-sm text-gray-600">5.0</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              "Authentic Ayurvedic product. Can feel the difference in immunity."
            </p>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                <span className="text-gray-600 text-sm">A</span>
              </div>
              <span className="text-gray-800 font-medium text-sm">Amit Verma</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">How soon can I see results?</h3>
            <p className="text-gray-600 text-sm">
              Most users report feeling increased energy within 2-3 weeks. For weight loss, visible results typically appear after 4-6 weeks of consistent use.
            </p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Are there any side effects?</h3>
            <p className="text-gray-600 text-sm">
              Safed Musali is generally safe with no known side effects when taken as directed. However, consult your doctor if you have any medical conditions.
            </p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Can pregnant women use this?</h3>
            <p className="text-gray-600 text-sm">
              We recommend pregnant or breastfeeding women to consult their healthcare provider before using any herbal supplements.
            </p>
          </div>
          <div className="pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">How should I store this product?</h3>
            <p className="text-gray-600 text-sm">
              Store in a cool, dry place away from direct sunlight. Keep the container tightly closed after each use.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;