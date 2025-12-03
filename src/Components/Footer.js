const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Company Info - Full width on mobile */}
          <div className="space-y-4 text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🌿</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                AyurVeda Store
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
              Your trusted source for authentic Ayurvedic medicines and wellness products.
              Ancient wisdom meets modern care for holistic health solutions.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4 pt-2">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '📷', label: 'Instagram' },
                { icon: '🐦', label: 'Twitter' },
                { icon: '💼', label: 'LinkedIn' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links and Contact Info in same row on mobile */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:col-span-2 lg:col-span-2">
            {/* Quick Links */}
            <div className="space-y-4 text-center sm:text-left">
              <h4 className="text-lg font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>⚡</span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { icon: '🏠', label: 'Home', href: '/' },
                  { icon: '🛍️', label: 'Products', href: '/Products' },
                  { icon: '📦', label: 'Product Packs', href: '/ProductPacks' },
                  { icon: 'ℹ️', label: 'About Us', href: '/about' },
                  { icon: '📞', label: 'Contact', href: '/contact' }
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center justify-center sm:justify-start space-x-2 text-gray-300 hover:text-green-400 transition-all duration-300 transform hover:translate-x-1 group py-1"
                    >
                      <span className="text-base group-hover:scale-110 transition-transform">{link.icon}</span>
                      <span className="text-sm">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 text-center sm:text-left">
              <h4 className="text-lg font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>📞</span>
                Contact Info
              </h4>
              <div className="space-y-4">
                {[
                  {
                    icon: '📍',
                    title: 'Address',
                    content: '123 Ayurveda Street, Wellness City, India',
                    bg: 'from-purple-500 to-pink-500'
                  },
                  {
                    icon: '📞',
                    title: 'Phone',
                    content: '+91 98765 43210',
                    bg: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: '✉️',
                    title: 'Email',
                    content: 'support@ayurvedastore.com',
                    bg: 'from-green-500 to-emerald-500'
                  },
                  {
                    icon: '🕒',
                    title: 'Hours',
                    content: 'Mon-Sat: 9AM-9PM',
                    bg: 'from-orange-500 to-red-500'
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start space-x-2 group">
                    <div className={`w-7 h-7 bg-gradient-to-r ${contact.bg} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md mt-0.5`}>
                      <span className="text-white text-xs">{contact.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs font-medium leading-tight">{contact.title}</p>
                      <p className="text-gray-400 text-xs leading-tight break-words">
                        {contact.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available On Platforms - Full width on mobile, then normal */}
          <div className="space-y-4 text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🛒</span>
              Also Available On
            </h4>
            <p className="text-gray-300 text-sm">
              Find our products on leading e-commerce platforms
            </p>
            <div className="space-y-3">
              {/* Amazon */}
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl transition-all duration-300 transform hover:scale-105 group shadow-lg"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-orange-600 font-bold text-lg">🛒</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Amazon</p>
                  <p className="text-orange-100 text-xs">Prime Delivery</p>
                </div>
                <span className="text-white text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>

              {/* Flipkart */}
              <a
                href="https://www.flipkart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl transition-all duration-300 transform hover:scale-105 group shadow-lg"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-blue-600 font-bold text-lg">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Flipkart</p>
                  <p className="text-blue-100 text-xs">SuperCoin Benefits</p>
                </div>
                <span className="text-white text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>

              {/* Other Platforms */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '🛍️', label: 'Myntra', bg: 'from-pink-500 to-rose-500' },
                  { icon: '🏪', label: 'BigBasket', bg: 'from-green-500 to-emerald-500' }
                ].map((platform, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`flex items-center justify-center space-x-1 p-2 bg-gradient-to-r ${platform.bg} hover:shadow-lg rounded-lg transition-all duration-300 transform hover:scale-105 text-xs font-medium text-white`}
                  >
                    <span className="text-sm">{platform.icon}</span>
                    <span className="text-xs">{platform.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          {/* Trust Badges - Mobile Optimized */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { icon: '🔒', text: 'Secure Payments' },
              { icon: '🚚', text: 'Free Shipping ₹499+' },
              { icon: '⭐', text: '4.8/5 Rating' },
              { icon: '💊', text: '100% Authentic' }
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-300"
              >
                <span className="text-sm">{badge.icon}</span>
                <span className="hidden xs:inline">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 text-sm text-gray-400">
            {['Privacy Policy', 'Terms of Service', 'Shipping Info', 'Returns', 'FAQ'].map((link, index) => (
              <a
                key={index}
                href="#"
                className="hover:text-green-400 transition-colors duration-200 py-1 text-xs sm:text-sm"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <span className="text-gray-400 text-sm">We Accept:</span>
            <div className="flex space-x-2">
              {['💳', '📱', '🏦', '🔗'].map((method, index) => (
                <div key={index} className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-sm">{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span>© 2025 AyurVeda Store. All rights reserved.</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>for holistic wellness</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button - Mobile Only */}
<div className="fixed bottom-6 right-6 z-50 sm:hidden">
  <a
    href="https://wa.me/918308083842"
    target="_blank"
    rel="noopener noreferrer"
    className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 animate-bounce"
    aria-label="Chat on WhatsApp"
  >
    <svg
      className="w-8 h-8 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {/* WhatsApp official logo path */}
      <path d="M12.032 2c-5.509 0-9.974 4.486-9.974 10.019 0 2.037.6 3.991 1.741 5.657L2 22l4.204-1.101c1.665.913 3.581 1.444 5.609 1.444 5.509 0 9.974-4.486 9.974-10.019S17.541 2 12.032 2zm5.15 14.295c-.252.688-1.404 1.287-1.95 1.311-.426.018-.96.007-1.398-.222-.359-.185-.805-.435-1.398-.735-2.503-1.074-4.137-3.607-4.264-3.771-.127-.164-1.053-1.407-1.053-2.675 0-1.268.638-1.893.868-2.163.229-.27.495-.337.66-.337.164 0 .33 0 .475.008.143.006.33-.07.515.495.185.565.632 1.955.688 2.097.056.143.094.309.019.474-.075.164-.112.247-.224.38-.112.133-.235.297-.336.396-.112.112-.229.247-.098.478.132.23.594.997 1.274 1.613.873.787 1.614 1.048 1.855 1.157.24.11.384.094.525-.056.141-.15.604-.66.765-.887.161-.228.322-.19.537-.113.214.077 1.36.641 1.594.757.234.116.39.174.447.273.056.099.056.564-.197 1.252z"/>
    </svg>
  </a>
</div>
    </footer>
  );
};

export default Footer;