"use client";

import React from "react";
import Link from "next/link";


const NavBar = () => {


  return (
    <header className="flex items-center justify-between bg-indigo-600 text-white px-6 py-4 shadow">
      <h1 className="text-2xl font-bold">MyShop</h1>

      <div className="flex items-center space-x-3">
        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-100 transition">
          <Link href={"/signin"}>Signin</Link>
        </button>

        <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium shadow hover:bg-yellow-500 transition">
          <Link href={"/signup"}>Signup</Link>
        </button>

        {/* Cart Button */}
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-600 transition flex items-center gap-2">
          <Link href={"/cart"}>Cart</Link>
          <span className="bg-white text-green-500 px-2 py-0.5 rounded-full font-semibold text-sm">
            
          </span>
        </button>
      </div>
    </header>
  );
};

export default NavBar;
