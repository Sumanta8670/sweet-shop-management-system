import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSweetStore from "../store/sweetStore";
import useAuth from "../hooks/useAuth";

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const {
    sweets,
    fetchSweets,
    addSweet,
    updateSweet,
    deleteSweet,
    restockSweet,
    isLoading,
  } = useSweetStore();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [restockData, setRestockData] = useState({});
  const [statistics, setStatistics] = useState({
    totalSweets: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    fetchSweets();
  }, [isAdmin, navigate, fetchSweets]);

  useEffect(() => {
    // Calculate statistics
    const stats = {
      totalSweets: sweets.length,
      totalValue: sweets.reduce(
        (sum, sweet) => sum + sweet.price * sweet.quantity,
        0
      ),
      lowStock: sweets.filter((s) => s.quantity > 0 && s.quantity <= 5).length,
      outOfStock: sweets.filter((s) => s.quantity === 0).length,
    };
    setStatistics(stats);
  }, [sweets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSweet(editingId, {
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
      } else {
        await addSweet({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        });
      }
      resetForm();
      alert("✅ Sweet saved successfully!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const handleEdit = (sweet) => {
    setEditingId(sweet.id);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description,
    });
    setIsAddingNew(true);
    setActiveTab("manage");
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this sweet?")) {
      try {
        await deleteSweet(id);
        alert("✅ Sweet deleted successfully!");
      } catch (error) {
        alert("❌ Delete failed: " + error.message);
      }
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = restockData[sweetId];
    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    try {
      await restockSweet(sweetId, parseInt(quantity));
      setRestockData({ ...restockData, [sweetId]: "" });
      alert("✅ Restocked successfully!");
    } catch (error) {
      alert("❌ Restock failed: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
      description: "",
    });
    setEditingId(null);
    setIsAddingNew(false);
  };

  const categories = [
    "Milk-based",
    "Syrup-based",
    "Dry Fruits",
    "Bengali",
    "Gujarati",
    "South Indian",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
                <span className="text-5xl">⚙️</span>
                Admin Dashboard
              </h1>
              <p className="text-indigo-200 text-lg">
                Manage your sweet shop inventory
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "overview"
                    ? "bg-white text-indigo-900 shadow-lg"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "manage"
                    ? "bg-white text-indigo-900 shadow-lg"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                🛠️ Manage
              </button>
              <button
                onClick={() => setActiveTab("restock")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "restock"
                    ? "bg-white text-indigo-900 shadow-lg"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                📦 Restock
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">🍬</div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm font-semibold">
                      Total Sweets
                    </p>
                    <p className="text-4xl font-bold">
                      {statistics.totalSweets}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-full"></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">💰</div>
                  <div className="text-right">
                    <p className="text-green-100 text-sm font-semibold">
                      Total Value
                    </p>
                    <p className="text-4xl font-bold">
                      ₹{statistics.totalValue.toFixed(0)}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-full"></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">⚠️</div>
                  <div className="text-right">
                    <p className="text-orange-100 text-sm font-semibold">
                      Low Stock
                    </p>
                    <p className="text-4xl font-bold">{statistics.lowStock}</p>
                  </div>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${
                        (statistics.lowStock / statistics.totalSweets) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">🚫</div>
                  <div className="text-right">
                    <p className="text-red-100 text-sm font-semibold">
                      Out of Stock
                    </p>
                    <p className="text-4xl font-bold">
                      {statistics.outOfStock}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${
                        (statistics.outOfStock / statistics.totalSweets) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>📋</span>
                  Current Inventory
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">
                        Sweet Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-indigo-900">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-indigo-900">
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-indigo-900">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-indigo-900">
                        Value
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-indigo-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-indigo-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sweets.map((sweet) => (
                      <tr
                        key={sweet.id}
                        className="hover:bg-indigo-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {sweet.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: #{sweet.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                            {sweet.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          ₹{sweet.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`font-bold ${
                              sweet.quantity === 0
                                ? "text-red-600"
                                : sweet.quantity <= 5
                                ? "text-orange-600"
                                : "text-green-600"
                            }`}
                          >
                            {sweet.quantity} kg
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-indigo-900">
                          ₹{(sweet.price * sweet.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {sweet.quantity === 0 ? (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                              OUT
                            </span>
                          ) : sweet.quantity <= 5 ? (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                              LOW
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(sweet)}
                              className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(sweet.id)}
                              className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === "manage" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-indigo-900 flex items-center gap-2">
                <span className="text-4xl">🛠️</span>
                {editingId ? "Edit Sweet" : "Add New Sweet"}
              </h2>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <span className="text-xl">➕</span>
                  Add New Sweet
                </button>
              )}
            </div>

            {isAddingNew && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                      <span>🏷️</span>
                      Sweet Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g., Gulab Jamun"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                      <span>📁</span>
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                      <span>💰</span>
                      Price (per kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g., 450.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                      <span>📦</span>
                      Quantity (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g., 50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                    <span>📝</span>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32"
                    placeholder="Describe the sweet..."
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "⏳ Saving..."
                      : editingId
                      ? "💾 Update Sweet"
                      : "➕ Create Sweet"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Restock Tab */}
        {activeTab === "restock" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-100">
            <h2 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
              <span className="text-4xl">📦</span>
              Quick Restock
            </h2>
            <div className="space-y-4">
              {sweets.map((sweet) => (
                <div
                  key={sweet.id}
                  className="flex items-center gap-4 p-4 border-2 border-indigo-100 rounded-xl hover:border-indigo-300 transition-all bg-gradient-to-r from-white to-indigo-50"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {sweet.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Current Stock:
                      <span
                        className={`ml-2 font-bold ${
                          sweet.quantity === 0
                            ? "text-red-600"
                            : sweet.quantity <= 5
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {sweet.quantity} kg
                      </span>
                    </p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty to add"
                    value={restockData[sweet.id] || ""}
                    onChange={(e) =>
                      setRestockData({
                        ...restockData,
                        [sweet.id]: e.target.value,
                      })
                    }
                    className="w-32 px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleRestock(sweet.id)}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    📦 Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
