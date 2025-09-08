"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const BE = process.env.NEXT_PUBLIC_BE_URL ?? "";

interface BackendProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  img?: string | null;
}

interface BackendCartItem {
  id: string; // cart item id
  cartId?: string;
  productId?: string;
  quantity: number;
  product: BackendProduct;
}

interface BackendCartResponse {
  items?: BackendCartItem[];
  // sometimes backend might return the array directly
  // so we'll also handle the case where the response is BackendCartItem[]
}

interface CartItem {
  cartItemId: string;
  id: string; // product id
  name: string;
  category: string;
  price: number;
  quantity: number;
  img?: string | null;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Load token on client
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log("Loaded token:", storedToken);
    setToken(storedToken);
  }, []);

  // Fetch cart items when token available
  useEffect(() => {
    if (!token) {
      console.log("No token found, skipping fetchCart");
      setLoading(false);
      return;
    }
    if (!BE) {
      console.error("Backend URL (NEXT_PUBLIC_BE_URL) is not defined");
      setLoading(false);
      return;
    }

    const fetchCart = async (): Promise<void> => {
      console.log("Fetching cart items...");
      try {
        const res = await fetch(`${BE}/api/cartitems`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch cart, status: ${res.status}`);
        const data = (await res.json()) as BackendCartResponse | BackendCartItem[];
        console.log("Raw backend response:", data);

        // Normalize response: support either { items: [...] } or [...] directly
        const cartArray: BackendCartItem[] = Array.isArray(data)
          ? data
          : Array.isArray((data as BackendCartResponse).items)
          ? (data as BackendCartResponse).items!
          : [];

        console.log("Normalized cart array:", cartArray);

        const mappedCart: CartItem[] = cartArray.map((item) => ({
          cartItemId: item.id,
          id: item.product.id,
          name: item.product.name,
          category: item.product.category,
          price: item.product.price,
          quantity: item.quantity,
          img: item.product.img ?? null,
        }));

        console.log("Mapped cart for frontend:", mappedCart);
        setCart(mappedCart);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const removeFromCart = async (cartItemId: string): Promise<void> => {
    if (!token) {
      console.log("No token, cannot remove item");
      return;
    }
    if (!BE) {
      console.error("Backend URL (NEXT_PUBLIC_BE_URL) is not defined");
      return;
    }

    console.log("Removing cart item:", cartItemId);
    try {
      const res = await fetch(`${BE}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to remove item, status: ${res.status}`);
      console.log("Item removed successfully:", cartItemId);
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    } catch (err) {
      console.error("Error removing cart item:", err);
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
                  <Image
                    src={item.img ?? "/placeholder.png"}
                    alt={item.name}
                    width={176}
                    height={176}
                    style={{ objectFit: "contain" }}
                  />
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
