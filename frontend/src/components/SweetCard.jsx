import React, { useState } from "react";
import useSweetStore from "../store/sweetStore";
import useAuth from "../hooks/useAuth";

const SweetCard = ({ sweet, onEdit }) => {
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const { purchaseSweet, isLoading } = useSweetStore();
  const { isAuthenticated, isAdmin } = useAuth();

  const handlePurchase = async () => {
    try {
      await purchaseSweet(sweet.id, quantity);
      setQuantity(1);
      alert("🎉 Purchase successful! Your order is being processed.");
    } catch (error) {
      alert("❌ Purchase failed: " + error.message);
    }
  };

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  const getCategoryIcon = (category) => {
    const icons = {
      "milk-based": "🥛",
      "syrup-based": "🍯",
      "dry-fruits": "🌰",
      bengali: "🍮",
      default: "🍬",
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-amber-300 transform hover:-translate-y-2">
      {/* Stock Badge */}
      <div className="absolute top-4 right-4 z-10">
        {isOutOfStock ? (
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
            OUT OF STOCK
          </span>
        ) : isLowStock ? (
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            LOW STOCK!
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
            IN STOCK
          </span>
        )}
      </div>

      {/* Sweet Image Placeholder with Icon */}
      <div className="relative h-48 bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-amber-200 opacity-30 pattern-dots"></div>
        <div className="text-8xl transform group-hover:scale-110 transition-transform duration-300 z-10">
          {getCategoryIcon(sweet.category)}
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-amber-300 rounded-full opacity-20 -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-300 rounded-full opacity-20 translate-x-16 translate-y-16"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-300">
            {sweet.category}
          </span>
        </div>

        {/* Sweet Name */}
        <h3 className="text-2xl font-bold text-amber-900 mb-3 group-hover:text-orange-600 transition-colors">
          {sweet.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 h-12 overflow-hidden line-clamp-2 text-sm">
          {sweet.description ||
            "Delicious traditional sweet made with authentic ingredients"}
        </p>

        {/* Price and Stock Info */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-amber-100">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              ₹{sweet.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">per kg</p>
          </div>
          <div className="text-right">
            <p
              className={`text-lg font-bold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              {isOutOfStock ? "0" : sweet.quantity}
            </p>
            <p className="text-xs text-gray-500">available</p>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mb-4">
            <button
              onClick={() => onEdit(sweet)}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>✏️</span>
              Edit Sweet
            </button>
          </div>
        )}

        {/* Customer Purchase Section */}
        {isAuthenticated && !isAdmin && !isOutOfStock && (
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <label className="text-sm font-semibold text-amber-900 whitespace-nowrap">
                Quantity (kg):
              </label>
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(parseInt(e.target.value) || 1, sweet.quantity)
                    )
                  }
                  className="w-16 px-2 py-1 border-2 border-amber-300 rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(sweet.quantity, quantity + 1))
                  }
                  className="w-8 h-8 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-lg border border-amber-300">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-amber-900">
                  Total:
                </span>
                <span className="text-2xl font-bold text-amber-900">
                  ₹{(sweet.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={isLoading || isOutOfStock}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>🛒</span>
                  Add to Cart
                </>
              )}
            </button>
          </div>
        )}

        {/* Login Prompt for Non-Authenticated Users */}
        {!isAuthenticated && !isOutOfStock && (
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg border-2 border-amber-300 text-center">
            <p className="text-amber-900 font-semibold mb-2">
              🔐 Login to Purchase
            </p>
            <p className="text-sm text-gray-600">
              Sign in to add this delicious sweet to your cart
            </p>
          </div>
        )}

        {/* Out of Stock Message */}
        {isOutOfStock && !isAdmin && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700 font-bold">😔 Currently Unavailable</p>
            <p className="text-sm text-red-600 mt-1">We'll restock soon!</p>
          </div>
        )}

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 text-sm text-amber-600 hover:text-amber-800 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {showDetails ? "Hide Details ▲" : "Show Details ▼"}
        </button>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t-2 border-amber-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Product ID:</span>
              <span className="font-semibold text-amber-900">#{sweet.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold text-amber-900">
                {sweet.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shelf Life:</span>
              <span className="font-semibold text-amber-900">7-10 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage:</span>
              <span className="font-semibold text-amber-900">
                Cool & Dry place
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-br-full"></div>
    </div>
  );
};

export default SweetCard;
