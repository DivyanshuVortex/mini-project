"use client";
import { useState } from "react";

const products = [
  { id: 1, name: "Laptop", category: "Electronics", price: 800 },
  { id: 2, name: "Headphones", category: "Electronics", price: 120 },
  { id: 3, name: "Smartphone", category: "Electronics", price: 950 },
  { id: 4, name: "Bluetooth Speaker", category: "Electronics", price: 180 },
  { id: 5, name: "Smartwatch", category: "Electronics", price: 250 },

  { id: 6, name: "T-shirt", category: "Clothing", price: 25 },
  { id: 7, name: "Shoes", category: "Clothing", price: 60 },
  { id: 8, name: "Jeans", category: "Clothing", price: 45 },
  { id: 9, name: "Jacket", category: "Clothing", price: 90 },
  { id: 10, name: "Cap", category: "Clothing", price: 15 },

  { id: 11, name: "Coffee Maker", category: "Home", price: 150 },
  { id: 12, name: "Blender", category: "Home", price: 100 },
  { id: 13, name: "Vacuum Cleaner", category: "Home", price: 220 },
  { id: 14, name: "Microwave", category: "Home", price: 300 },
  { id: 15, name: "Table Lamp", category: "Home", price: 40 },

  { id: 16, name: "Novel", category: "Books", price: 20 },
  { id: 17, name: "Cookbook", category: "Books", price: 35 },
  { id: 18, name: "Science Fiction", category: "Books", price: 25 },
  { id: 19, name: "Biography", category: "Books", price: 30 },
  { id: 20, name: "Children's Book", category: "Books", price: 15 },

  { id: 21, name: "Football", category: "Sports", price: 50 },
  { id: 22, name: "Tennis Racket", category: "Sports", price: 120 },
  { id: 23, name: "Basketball", category: "Sports", price: 40 },
  { id: 24, name: "Yoga Mat", category: "Sports", price: 25 },
  { id: 25, name: "Running Shoes", category: "Sports", price: 95 },

  { id: 26, name: "Lipstick", category: "Beauty", price: 20 },
  { id: 27, name: "Perfume", category: "Beauty", price: 75 },
  { id: 28, name: "Shampoo", category: "Beauty", price: 15 },
  { id: 29, name: "Face Cream", category: "Beauty", price: 30 },
  { id: 30, name: "Nail Polish", category: "Beauty", price: 10 },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortOrder, setSortOrder] = useState("default");

  // Dynamically extract categories
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filtering
  let filteredProducts = products.filter((p) => {
    const byCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const byPrice = p.price <= maxPrice;
    return byCategory && byPrice;
  });

  // Sorting
  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-50 to-indigo-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">🛍️ Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 text-black rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Max Price:</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="cursor-pointer"
          />
          <span className="font-semibold text-indigo-700">${maxPrice}</span>
        </div>

        {/* Sort Filter */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border text-black px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="default">Sort by</option>
          <option value="lowToHigh">Price: Low → High</option>
          <option value="highToLow">Price: High → Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition p-5"
            >
              <div className="h-36 bg-gradient-to-r from-indigo-100 to-purple-100 mb-3 rounded-lg flex items-center justify-center text-gray-500">
                Image
              </div>
              <h2 className="font-semibold text-lg text-gray-800">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="font-bold text-indigo-600 text-lg">
                ${product.price}
              </p>
              <button className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No products found.</p>
        )}
      </div>
    </main>
  );
}
