"use client";

import React, { useState, useEffect } from "react";
const BE = process.env.NEXT_PUBLIC_BE_URL;
const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Load token on client
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Loaded token:", storedToken);
    setToken(storedToken);
  }, []);

  // Fetch cart items
  useEffect(() => {
    if (!token) {
      console.log("No token found, skipping fetchCart");
      return;
    }

    const fetchCart = async () => {
      console.log("Fetching cart items...");
      try {
        const res = await fetch(`${BE}/api/cartitems`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch cart, status: ${res.status}`);
        const data = await res.json();
        console.log("Backend response:", data);

        // Handle backend object structure { id, userId, items: [...] }
        const cartArray = Array.isArray(data.items) ? data.items : [];
        console.log("Cart array:", cartArray);

        const mappedCart = cartArray.map((item: any) => ({
          cartItemId: item.id,           // backend cart item id for delete
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
          price: item.product.price,
          quantity: item.quantity,
          img: item.product.img || "",
        }));

        console.log("Mapped cart:", mappedCart);
        setCart(mappedCart);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const removeFromCart = async (cartItemId: string) => {
    if (!token) {
      console.log("No token, cannot remove item");
      return;
    }

    console.log("Removing cart item:", cartItemId);
    try {
      const res = await fetch(`${BE}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to remove item, status: ${res.status}`);
      console.log("Item removed successfully:", cartItemId);

      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log("Total:", total);

  if (loading) return <p className="text-center mt-10 text-black">Loading cart...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-black text-center">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex flex-col bg-white p-5 pb-50 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="h-44 bg-gray-100 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                  {item.img ? <img src={item.img} alt={item.name} /> : <span className="text-gray-400">Image</span>}
                </div>
                <h2 className="font-semibold text-lg text-black">{item.name}</h2>
                <p className="text-gray-700 mb-1">{item.category}</p>
                <p className="text-gray-700 mb-2">Quantity: {item.quantity}</p>
                <p className="font-bold text-black text-lg mb-3">₹{item.price}</p>
                <button
                  className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t p-6 flex flex-col md:flex-row justify-between items-center md:items-end md:gap-6">
            <p className="font-bold text-black text-xl md:text-2xl">Total: ₹{total}</p>
            <button className="mt-4 md:mt-0 bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition">
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default CartPage;
