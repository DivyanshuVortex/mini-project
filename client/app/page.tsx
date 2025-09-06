import Link from "next/link";
import NavBar from "./components/NavBar";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
     <NavBar />
      <section className="flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100 text-center p-6">
        <h2 className="text-4xl font-bold mb-3 text-gray-800">
          Welcome to MyShop
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Discover amazing products at unbeatable prices. Shop now and enjoy
          exclusive deals tailored just for you!
        </p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition">
          <Link href={"/lists"}>Start Shopping</Link>
        </button>
      </section>

      
      <footer className="bg-gray-900 text-gray-300 text-center p-4">
        <p>© 2025 MyShop. All rights reserved.</p>
      </footer>
    </main>
  );
}
