import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSweetStore from "../store/sweetStore";
import useAuth from "../hooks/useAuth";

/**
 * Admin Page - Manage sweets
 */
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
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [restockData, setRestockData] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    fetchSweets();
  }, [isAdmin, navigate, fetchSweets]);

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
    } catch (error) {
      alert("Error: " + error.message);
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
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sweet?")) {
      try {
        await deleteSweet(id);
      } catch (error) {
        alert("Delete failed: " + error.message);
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
    } catch (error) {
      alert("Restock failed: " + error.message);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-sweet-600 mb-8">⚙️ Admin Panel</h1>

      {/* Add/Edit Form */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Sweet" : "Add New Sweet"}
        </h2>

        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary mb-4"
          >
            + Add New Sweet
          </button>
        )}

        {isAddingNew && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field h-24"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sweets Table */}
      <div className="card overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{sweet.name}</td>
                <td className="px-4 py-2">{sweet.category}</td>
                <td className="px-4 py-2 text-right">
                  ${sweet.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">{sweet.quantity}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(sweet)}
                    className="btn-secondary text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sweet.id)}
                    className="btn-danger text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Restock Section */}
      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Restock</h2>
        <div className="space-y-2">
          {sweets.map((sweet) => (
            <div
              key={sweet.id}
              className="flex items-center gap-2 p-2 border rounded"
            >
              <span className="flex-1">{sweet.name}</span>
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={restockData[sweet.id] || ""}
                onChange={(e) =>
                  setRestockData({ ...restockData, [sweet.id]: e.target.value })
                }
                className="input-field w-24"
              />
              <button
                onClick={() => handleRestock(sweet.id)}
                className="btn-primary"
                disabled={isLoading}
              >
                Restock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
