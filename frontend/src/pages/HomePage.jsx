import React, { useEffect, useState } from "react";
import SweetCard from "../components/SweetCard";
import useSweetStore from "../store/sweetStore";

const HomePage = () => {
  const { sweets, isLoading, error, fetchSweets, searchSweets } =
    useSweetStore();
  const [searchParams, setSearchParams] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [activeCategory, setActiveCategory] = useState("all");

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
    setActiveCategory("all");
    await fetchSweets();
  };

  const categories = [
    { name: "All", value: "all", icon: "🍰" },
    { name: "Milk-based", value: "milk-based", icon: "🥛" },
    { name: "Syrup-based", value: "syrup-based", icon: "🍯" },
    { name: "Dry Fruits", value: "dry-fruits", icon: "🌰" },
    { name: "Bengali", value: "bengali", icon: "🍮" },
  ];

  const handleCategoryClick = async (category) => {
    setActiveCategory(category);
    if (category === "all") {
      await fetchSweets();
    } else {
      await searchSweets({ category });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-bounce text-6xl mb-4">🍬</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-200">
            Welcome to Sweet Shop
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 font-light">
            Experience the Authentic Taste of Traditional Indian Sweets
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <span>✨</span>
              <span>100% Pure & Natural</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <span>🏆</span>
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <span>🚚</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 text-center">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === cat.value
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                    : "bg-white text-amber-900 hover:shadow-md border-2 border-amber-200"
                }`}
              >
                <span className="text-2xl mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Search */}
        <form
          onSubmit={handleSearch}
          className="mb-8 bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-200"
        >
          <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Advanced Search
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="🔎 Search by name..."
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams({ ...searchParams, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="📁 Category..."
              value={searchParams.category}
              onChange={(e) =>
                setSearchParams({ ...searchParams, category: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <input
              type="number"
              placeholder="💰 Min Price..."
              value={searchParams.minPrice}
              onChange={(e) =>
                setSearchParams({ ...searchParams, minPrice: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <input
              type="number"
              placeholder="💰 Max Price..."
              value={searchParams.maxPrice}
              onChange={(e) =>
                setSearchParams({ ...searchParams, maxPrice: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {/* Results Count */}
        {!isLoading && sweets.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-lg text-amber-900">
              <span className="font-bold text-2xl">{sweets.length}</span>{" "}
              delicious sweets found 🎉
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md">
            <span className="text-xl mr-2">⚠️</span>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="relative">
              <div className="w-20 h-20 border-8 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                🍬
              </div>
            </div>
            <p className="mt-4 text-amber-900 font-semibold">
              Loading delicious sweets...
            </p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-600 text-xl font-semibold mb-2">
              No sweets found
            </p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map((sweet) => (
              <SweetCard key={sweet.id} sweet={sweet} />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
            Why Choose Us? ✨
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🥇",
                title: "Premium Quality",
                desc: "Only the finest ingredients",
              },
              {
                icon: "👨‍🍳",
                title: "Expert Chefs",
                desc: "Traditional recipes perfected",
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Fresh sweets at your doorstep",
              },
              {
                icon: "💝",
                title: "Gift Packaging",
                desc: "Perfect for every occasion",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
