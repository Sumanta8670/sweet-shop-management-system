import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { handleRegister, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    // Validation
    if (userData.password !== userData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    if (userData.password.length < 6) {
      alert("❌ Password must be at least 6 characters long!");
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registrationData } = userData;
    await handleRegister(registrationData);
  };

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setUserData({ ...userData, password: newPassword });
    calculatePasswordStrength(newPassword);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Registration Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200 order-2 lg:order-1">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-4xl font-bold text-purple-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Join our sweet community today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-shake">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Registration Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <span>👤</span>
                Username
              </label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                placeholder="Choose a username"
                minLength="3"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 3 characters</p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <span>📧</span>
                Email Address
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                placeholder="your.email@example.com"
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
                  value={userData.password}
                  onChange={handlePasswordChange}
                  className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg pr-12"
                  placeholder="Create a strong password"
                  minLength="6"
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

              {/* Password Strength Indicator */}
              {userData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 font-semibold">
                      Password Strength:
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        passwordStrength <= 25
                          ? "text-red-600"
                          : passwordStrength <= 50
                          ? "text-orange-600"
                          : passwordStrength <= 75
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <span>🔐</span>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={userData.confirmPassword}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-6 py-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg pr-12"
                  placeholder="Re-enter your password"
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {userData.confirmPassword && (
                <div className="mt-1 flex items-center gap-2">
                  {userData.password === userData.confirmPassword ? (
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      ✅ Passwords match
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      ❌ Passwords don't match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-5 h-5 rounded border-2 border-purple-400 text-purple-600 focus:ring-purple-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>🎉</span>
                  Create My Account
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span className="mr-2">🔑</span>
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="order-1 lg:order-2">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-8xl mb-6 animate-bounce">🍰</div>
            <h2 className="text-5xl font-bold mb-4">Join Sweet Shop!</h2>
            <p className="text-xl text-purple-100 mb-8">
              Create your account and get access to exclusive benefits
            </p>
            <div className="space-y-4">
              {[
                { icon: "🎁", text: "Welcome Bonus on First Order" },
                { icon: "🏆", text: "Loyalty Rewards Program" },
                { icon: "⚡", text: "Priority Customer Support" },
                { icon: "💌", text: "Exclusive Deals & Offers" },
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
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/30">
              <p className="text-lg font-bold mb-2">🌟 Special Offer!</p>
              <p className="text-purple-100">
                Get 20% OFF on your first order when you register today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
