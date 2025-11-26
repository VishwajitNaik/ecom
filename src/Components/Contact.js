// Components/Contact.jsx
const Contact = () => {
  return (
    <div className="container mx-auto bg-gradient-to-br rounded-3xl shadow-2xl from-blue-600 to-blue-800 text-white py-20 px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-pink-200 text-transparent bg-clip-text">
          Get In Touch
        </h2>
        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Subject</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300"
                placeholder="How can we help you?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
              <textarea 
                rows="5"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 resize-none"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 border-2 border-white"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-4 text-pink-300">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">📧</div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="opacity-90">support@ecomstore.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl">📞</div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="opacity-90">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="opacity-90">123 Commerce Street, Business City, BC 12345</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold mb-4 text-pink-300">Business Hours</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-semibold">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-semibold">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;