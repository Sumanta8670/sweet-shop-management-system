import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              🍬 Sweet Shop
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Experience the authentic taste of traditional Indian sweets,
              crafted with love and the finest ingredients.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all transform hover:scale-110"
              >
                <span className="text-xl">📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all transform hover:scale-110"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all transform hover:scale-110"
              >
                <span className="text-xl">📷</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all transform hover:scale-110"
              >
                <span className="text-xl">📱</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-amber-200">Quick Links</h4>
            <ul className="space-y-2">
              {[
                "Home",
                "About Us",
                "Our Sweets",
                "Special Offers",
                "Contact",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-amber-100 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-amber-200">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {[
                "Track Order",
                "Return Policy",
                "Privacy Policy",
                "Terms & Conditions",
                "FAQ",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-amber-100 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-amber-200">Contact Us</h4>
            <div className="space-y-3 text-amber-100 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">📍</span>
                <p>123 Sweet Street, Bhubaneswar, Odisha, India</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📞</span>
                <p>+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">✉️</span>
                <p>info@sweetshop.com</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🕐</span>
                <p>Mon-Sun: 9AM - 9PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties Banner */}
        <div className="mt-8 pt-8 border-t border-amber-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
              <div className="text-3xl mb-2">🥇</div>
              <div className="text-sm font-semibold text-amber-200">
                Premium Quality
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
              <div className="text-3xl mb-2">🚚</div>
              <div className="text-sm font-semibold text-amber-200">
                Fast Delivery
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
              <div className="text-3xl mb-2">🌿</div>
              <div className="text-sm font-semibold text-amber-200">
                100% Natural
              </div>
            </div>
            <div className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
              <div className="text-3xl mb-2">💝</div>
              <div className="text-sm font-semibold text-amber-200">
                Gift Packaging
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/30 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-100 text-sm">
            © {currentYear} Sweet Shop Management System. Made with ❤️ in India.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
