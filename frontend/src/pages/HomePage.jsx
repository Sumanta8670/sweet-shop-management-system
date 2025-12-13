import React, { useEffect, useState } from "react";
import SweetCard from "../components/SweetCard";
import useSweetStore from "../store/sweetStore";

/**
 * Home Page - Display all sweets and search functionality
 */
const HomePage = () => {
  const { sweets, isLoading, error, fetchSweets, searchSweets } =
    useSweetStore();
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = {};
    if (searchParams.name) params.name = searchParams.name;
    if (searchParams.category) params.category = searchParams.category;
    if (searchParams.minPrice)
      params.minPrice = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice)
      params.maxPrice = parseFloat(searchParams.maxPrice);

    try {
      await searchSweets(params);
    } catch (error) {
      alert("Search failed: " + error.message);
    }
  };

  const handleClearSearch = async () => {
    setSearchParams({ name: "", category: "", minPrice: "", maxPrice: "" });
    await fetchSweets();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-sweet-600 mb-8">
        🍭 Sweets Catalog
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchParams.name}
            onChange={(e) =>
              setSearchParams({ ...searchParams, name: e.target.value })
            }
            className="input-field"
          />
          <input
            type="text"
            placeholder="Category..."
            value={searchParams.category}
            onChange={(e) =>
              setSearchParams({ ...searchParams, category: e.target.value })
            }
            className="input-field"
          />
          <input
            type="number"
            placeholder="Min Price..."
            value={searchParams.minPrice}
            onChange={(e) =>
              setSearchParams({ ...searchParams, minPrice: e.target.value })
            }
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max Price..."
            value={searchParams.maxPrice}
            onChange={(e) =>
              setSearchParams({ ...searchParams, maxPrice: e.target.value })
            }
            className="input-field"
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">
              Search
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading"></div>
        </div>
      ) : sweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No sweets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweets.map((sweet) => (
            <SweetCard key={sweet.id} sweet={sweet} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
