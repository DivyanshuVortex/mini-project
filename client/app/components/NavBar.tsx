"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const NavBar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    window.location.href = "/";
  };
  return (
    <header className="flex items-center justify-between bg-indigo-600 text-white px-6 py-4 shadow">
      <h1 className="text-2xl font-bold">MyShop</h1>

      <div className="flex items-center space-x-3">
        {!token ? (
          <>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-100 transition">
              <Link href={"/signin"}>Signin</Link>
            </button>

            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium shadow hover:bg-yellow-500 transition">
              <Link href={"/signup"}>Signup</Link>
            </button>
          </>
        ) : (
          <>
            <div className="hover:scale-105" onClick={handleLogout}>
              {" "}
              Logout
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-600 transition flex items-center gap-2">
              <Link href={"/cart"}>Cart</Link>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
