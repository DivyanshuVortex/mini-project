"use client";

import React, { useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([
    { id: 1, name: "Laptop", category: "Electronics", price: 800, img: "/laptop.png" },
    { id: 2, name: "T-shirt", category: "Clothing", price: 25, img: "/tshirt.png" },
    { id: 3, name: "Coffee Maker", category: "Home", price: 150, img: "/coffeemaker.png" },
    { id: 4, name: "Headphones", category: "Electronics", price: 120, img: "/headphones.png" },
    { id: 5, name: "Shoes", category: "Clothing", price: 60, img: "/shoes.png" },
    { id: 6, name: "Blender", category: "Home", price: 100, img: "/blender.png" },
    { id: 7, name: "Smartphone", category: "Electronics", price: 950, img: "/smartphone.png" },
    { id: 8, name: "Jacket", category: "Clothing", price: 90, img: "/jacket.png" },
    { id: 9, name: "Table Lamp", category: "Home", price: 40, img: "/lamplight.png" },
  ]);

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
                key={item.id}
                className="flex flex-col bg-white p-5 pb-50 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="h-44 bg-gray-100 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                  {item.img ? (
                   <div>temp img</div>
                  ) : (
                    <span className="text-gray-400">Image</span>
                  )}
                </div>
                <h2 className="font-semibold text-lg text-black">{item.name}</h2>
                <p className="text-gray-700 mb-2">{item.category}</p>
                <p className="font-bold text-black text-lg mb-3">${item.price}</p>
                <button
                  className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t p-6 flex flex-col md:flex-row justify-between items-center md:items-end md:gap-6">
            <p className="font-bold text-black text-xl md:text-2xl">Total: ${total}</p>
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
