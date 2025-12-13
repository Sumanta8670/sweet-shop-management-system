import React, { useState } from "react";
import useSweetStore from "../store/sweetStore";
import useAuth from "../hooks/useAuth";

/**
 * Sweet Card component for displaying sweet details
 */
const SweetCard = ({ sweet, onEdit }) => {
  const [quantity, setQuantity] = useState(1);
  const { purchaseSweet, isLoading } = useSweetStore();
  const { isAuthenticated, isAdmin } = useAuth();

  const handlePurchase = async () => {
    try {
      await purchaseSweet(sweet.id, quantity);
      setQuantity(1);
      alert("Purchase successful!");
    } catch (error) {
      alert("Purchase failed: " + error.message);
    }
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-sweet-600 mb-2">{sweet.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{sweet.category}</p>
      <p className="text-gray-700 mb-4 h-16 overflow-hidden">
        {sweet.description}
      </p>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-2xl font-bold text-sweet-500">
            ${sweet.price.toFixed(2)}
          </p>
          <p
            className={`text-sm ${
              isOutOfStock ? "text-red-600 font-bold" : "text-green-600"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : `${sweet.quantity} in stock`}
          </p>
        </div>
      </div>

      {isAdmin && (
        <button
          onClick={() => onEdit(sweet)}
          className="btn-secondary w-full mb-2"
        >
          Edit
        </button>
      )}

      {isAuthenticated && !isAdmin && !isOutOfStock && (
        <div className="flex gap-2 items-center mb-2">
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
            className="input-field w-20"
          />
          <button
            onClick={handlePurchase}
            disabled={isLoading || isOutOfStock}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Purchase"}
          </button>
        </div>
      )}

      {!isAuthenticated && !isOutOfStock && (
        <p className="text-gray-600 text-sm">Login to purchase</p>
      )}
    </div>
  );
};

export default SweetCard;
