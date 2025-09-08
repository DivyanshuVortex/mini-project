"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:4000/api";

const Page = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", category: "", price: "" });
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterPrice, setFilterPrice] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>("default");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (updateId) {
      await fetch(`${API_URL}/products/${updateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      setUpdateId(null);
    } else {
      await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prod: payload }),
      });
    }
    setForm({ name: "", category: "", price: "" });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleEdit = (p: any) => {
    setForm({ name: p.name, category: p.category, price: String(p.price) });
    setUpdateId(p.id);
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products
    .filter((p) => {
      const categoryMatch =
        filterCategory === "All" || p.category === filterCategory;
      const priceMatch = filterPrice === 0 || p.price <= filterPrice;
      return categoryMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold">Product Manager</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Go to Home
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {updateId ? "Update Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-3 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-3 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-3 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow sm:col-span-3"
          >
            {updateId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-wrap gap-6 items-center">
        <div>
          <label className="block font-medium mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg p-2 shadow-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Max Price: {filterPrice}
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="50"
            value={filterPrice}
            onChange={(e) => setFilterPrice(Number(e.target.value))}
            className="w-64 accent-blue-600"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Sort By Price</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-lg p-2 shadow-sm"
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        <button
          onClick={() => {
            setFilterCategory("All");
            setFilterPrice(0);
            setSortOrder("default");
          }}
          className="ml-auto bg-gray-200 hover:bg-gray-300 text-black px-5 py-2 rounded-lg shadow"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="mt-2 text-lg font-semibold text-blue-700">
                  ₹{p.price}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
