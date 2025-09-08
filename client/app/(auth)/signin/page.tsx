"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BE = process.env.NEXT_PUBLIC_BE_URL;

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
console.log(BE , "BE")
    try {
      const res = await fetch(`${BE}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and userId in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        // Redirect to home page
        router.push("/");
      } else {
        setErrorMessage(data.message || "Signin failed");
      }
    } catch (error) {
      setErrorMessage(`Server error, please try again. ${error}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Sign In
        </h1>

        <form className="space-y-4" onSubmit={handleSignin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="TBSM@example.com"
              className="mt-1 text-black block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 text-black block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Create new account:{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}
