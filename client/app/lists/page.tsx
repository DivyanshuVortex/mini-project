"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_BE_URL ?? "";

interface Product {
  id: string;
  name: string;
  category?: string | null;
  price: number;
  img?: string | null;
}

interface BackendCartItem {
  id: string;
  cartId?: string;
  productId?: string;
  quantity: number;
  product: Product;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<BackendCartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.debug("Loaded token from localStorage:", stored);
    setToken(stored);
  }, []);

  // Fetch products (useCallback so it can be referenced safely)
  const fetchProducts = useCallback(async (): Promise<void> => {
    if (!token) {
      console.debug("No token available, skipping fetchProducts");
      return;
    }
    if (!API_URL) {
      console.error("API_URL not defined (NEXT_PUBLIC_BE_URL).");
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.debug("Fetching products from", `${API_URL}/products`);
      const res = await fetch(`${API_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch products (${res.status})`);
      }

      const data = await res.json();
      console.debug("Raw products response:", data);

      if (Array.isArray(data)) {
        setProducts(data as Product[]);
      } else if (Array.isArray((data as { products?: Product[] }).products)) {
        setProducts((data as { products?: Product[] }).products!);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch cart items (useCallback so it can be reused after add-to-cart)
  const fetchCartItems = useCallback(async (): Promise<void> => {
    if (!token) {
      console.debug("No token available, skipping fetchCartItems");
      return;
    }
    if (!API_URL) {
      console.error("API_URL not defined (NEXT_PUBLIC_BE_URL).");
      setCartItems([]);
      return;
    }

    try {
      console.debug("Fetching cart items from", `${API_URL}/cartitems`);
      const res = await fetch(`${API_URL}/api/cartitems`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch cart items (${res.status})`);
      }

      const data = await res.json();
      console.debug("Raw cart response:", data);

      // backend might return { items: [...] } or items array directly
      const items = Array.isArray(data)
        ? (data as BackendCartItem[])
        : Array.isArray((data as { items?: BackendCartItem[] }).items)
        ? (data as { items?: BackendCartItem[] }).items!
        : [];

      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setCartItems([]);
    }
  }, [token]);

  // trigger initial fetches when token changes
  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, [fetchProducts, fetchCartItems]);

  // Add to cart
  const handleAddCart = async (product: Product): Promise<void> => {
    if (!token) {
      console.warn("No token; cannot add to cart");
      return;
    }
    if (!API_URL) {
      console.error("API_URL not defined (NEXT_PUBLIC_BE_URL).");
      return;
    }

    try {
      console.debug("Adding product to cart:", product.id);
      const res = await fetch(`${API_URL}/api/addcart`, {
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

      if (!res.ok) {
        throw new Error(`Failed to add item to cart (${res.status})`);
      }

      // Refresh cart items after successful add
      await fetchCartItems();
      console.debug("Added to cart and refreshed cart items");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Categories + filters (typed)
  const categories: string[] = ["All", ...Array.from(new Set(products.map((p) => p.category ?? "Uncategorized")))];
  let filteredProducts = products.filter((p) => {
    const byCategory = selectedCategory === "All" || (p.category ?? "Uncategorized") === selectedCategory;
    const byPrice = p.price <= maxPrice;
    return byCategory && byPrice;
  });

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity ?? 0), 0);

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">🛍️ ShopEase</h1>
        <div className="flex items-center gap-4">
          <button className="relative font-medium">
            <span>
              <Link href={"/cart"}>Cart : 🛒</Link>
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white rounded-full px-2 py-0.5">
                {cartCount}
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
              min={0}
              max={100000}
              step={10}
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
                <div key={product.id} className="bg-white border rounded-xl shadow hover:shadow-xl transition p-5">
                  <div className="h-36 bg-gradient-to-r from-indigo-100 to-purple-100 mb-3 rounded-lg flex items-center justify-center text-gray-500">
                    Image
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="font-bold text-indigo-600 text-lg">₹{product.price}</p>
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
