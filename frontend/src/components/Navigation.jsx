import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navigation = () => {
  const { isAuthenticated, isAdmin, user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-4xl transform group-hover:rotate-12 transition-transform duration-300">
              🍬
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-100 group-hover:text-white transition-colors">
                Sweet Shop
              </h1>
              <p className="text-xs text-amber-200">
                Traditional Indian Delights
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive("/")
                  ? "bg-white text-amber-900 shadow-lg"
                  : "hover:bg-white/20"
              }`}
            >
              🏠 Home
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-2 border-white ${
                    isActive("/login")
                      ? "bg-white text-amber-900"
                      : "hover:bg-white hover:text-amber-900"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-white text-amber-900 ${
                    isActive("/register")
                      ? "shadow-lg scale-105"
                      : "hover:shadow-lg hover:scale-105"
                  }`}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.username}</p>
                    <p className="text-xs text-amber-200">
                      {isAdmin ? "👑 Admin" : "🛍️ Customer"}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      isActive("/admin")
                        ? "bg-amber-400 text-amber-900 shadow-lg"
                        : "bg-white/20 hover:bg-amber-400 hover:text-amber-900"
                    }`}
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition-all duration-300 hover:shadow-lg"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white transform transition-all ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-white transition-all ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-white transform transition-all ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                isActive("/") ? "bg-white text-amber-900" : "hover:bg-white/20"
              }`}
            >
              🏠 Home
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-semibold border-2 border-white hover:bg-white hover:text-amber-900 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-semibold bg-white text-amber-900 hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="px-4 py-3 bg-white/20 rounded-lg">
                  <p className="font-semibold">{user?.username}</p>
                  <p className="text-xs text-amber-200">
                    {isAdmin ? "👑 Admin" : "🛍️ Customer"}
                  </p>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-semibold ${
                      isActive("/admin")
                        ? "bg-amber-400 text-amber-900"
                        : "bg-white/20"
                    }`}
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700"
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>
    </nav>
  );
};

export default Navigation;
