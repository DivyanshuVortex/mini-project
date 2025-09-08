"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ app router

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and userId to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        // Redirect to home page
        router.push("/");
      } else {
        setMessage(`❌ ${data.message || "Signup failed"}`);
      }
    } catch (error) {
      setMessage(`❌ Server error, please try again. ${error}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Sign Up
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-400 text-black py-2 px-4 rounded-lg font-medium hover:bg-blue-500 transition"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-4 text-red-500">{message}</p>
        )}

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-indigo-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </main>
  );
}
