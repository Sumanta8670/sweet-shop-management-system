import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await handleLogin(credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-12 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-8xl mb-6 animate-bounce">🍬</div>
            <h2 className="text-5xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-xl text-amber-100 mb-8">
              Sign in to explore our delicious collection of traditional Indian
              sweets
            </p>
            <div className="space-y-4">
              {[
                { icon: "✨", text: "Premium Quality Sweets" },
                { icon: "🚚", text: "Fast & Safe Delivery" },
                { icon: "💝", text: "Special Gift Packaging" },
                { icon: "🎉", text: "Exclusive Offers" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white/20 p-4 rounded-xl backdrop-blur-sm"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-lg font-semibold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-amber-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-4xl font-bold text-amber-900 mb-2">Login</h2>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-shake">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Login Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <span>👤</span>
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full px-6 py-4 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <span>🔒</span>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-amber-400 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-gray-700 font-semibold">Remember me</span>
              </label>
              <a
                href="#"
                className="text-amber-600 font-semibold hover:text-amber-800 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Login to Sweet Shop
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">
                OR
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Don't have an account yet?</p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="mr-2">✨</span>
              Create New Account
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <p className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span>ℹ️</span>
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-blue-800">
              <p>
                <strong>Admin:</strong> admin / admin123
              </p>
              <p>
                <strong>User:</strong> user / user123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
