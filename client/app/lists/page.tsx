"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_BE_URL;


export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortOrder, setSortOrder] = useState("default");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // Fetch products
  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Fetch cart items
  const fetchCartItems = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/cartitems`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (Array.isArray(data.items)) {
        setCartItems(data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [token]);

  // Add to cart
  const handleAddCart = async (product: any) => {
    try {
      const res = await fetch(`${API_URL}/addcart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      // Refresh cart items after adding
      fetchCartItems();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Categories + filters
  const categories = ["All", ...new Set((products || []).map((p) => p.category))];

  let filteredProducts = (products || []).filter((p) => {
    const byCategory = selectedCategory === "All" || p.category === selectedCategory;
    const byPrice = p.price <= maxPrice;
    return byCategory && byPrice;
  });

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">🛍️ ShopEase</h1>
        <div className="flex items-center gap-4">
          <button className="relative font-medium">
            <span><Link href={'/cart'}>Cart : 🛒</Link></span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white rounded-full px-2 py-0.5">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">Products</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-md">
          {/* Category */}
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

          {/* Price */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Max Price:</label>
            <input
              type="range"
              min="0"
              max="100000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="cursor-pointer"
            />
            <span className="font-semibold text-indigo-700">₹{maxPrice}</span>
          </div>

          {/* Sort */}
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

        {/* Products */}
        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border rounded-xl shadow hover:shadow-xl transition p-5"
                >
                  <div className="h-36 bg-gradient-to-r from-indigo-100 to-purple-100 mb-3 rounded-lg flex items-center justify-center text-gray-500">
                    Image
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="font-bold text-indigo-600 text-lg">
                    ₹{product.price}
                  </p>
                  <button
                    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                    onClick={() => handleAddCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No products found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
