import React from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f7f1e8] min-h-screen text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <div className="flex space-x-6 text-sm font-medium">
          <a href="#">Home</a>
          <a href="#">Store</a>
          <a href="#">About us</a>
          <a href="#">Blog</a>
        </div>
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <span>KitaabCart</span>
          <img src="\src\logo_no_background.png" alt="Logo" className="w-8 h-8" />
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5" />
          <ShoppingCart className="w-5 h-5" />
          <User className="w-5 h-5" />
        </div>
        <div className="flex items-center space-x-4">
  <button onClick={() => alert("No notifications")} 
  className="p-2 rounded border border-black text-black bg-transparent hover:bg-black hover:text-white transition">
    Notifications
  </button>
  <button
    onClick={() => navigate("/register")}
    className="p-2 rounded border border-black text-black bg-transparent hover:bg-black hover:text-white transition"
  >
    Register
  </button>
  <button
    onClick={() => navigate("/login")}
    className="p-2 rounded border border-black text-black bg-transparent hover:bg-black hover:text-white transition"
  >
    Login
  </button>
</div>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 py-16 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Experience our <br /> New Exclusive Books
          </h1>
          <p className="mb-6 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore Ut enim ad.
          </p>
          <button className="bg-[#a58f68] text-white px-4 py-2 rounded hover:bg-[#8b7755]">Shop Now</button>
        </div>
        <div className="relative w-full h-full flex justify-center items-end">
          <div className="relative w-[300px] h-[300px]">
            <img src="\src\girl_reading.jpg" alt="Books Stack" className="absolute bottom-0 left-0 w-[240px] z-0" />
            <img src="\src\stack.jpg" alt="Girl Reading" className="absolute bottom-0 right-0 w-[260px] z-10" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white mx-10 my-10 rounded-xl shadow-md py-6 grid grid-cols-1 md:grid-cols-3 text-center text-sm">
        <div>
          <div className="font-semibold text-lg mb-1">Certified</div>
          <p className="text-gray-500">Available certificates of the authority</p>
        </div>
        <div>
          <div className="font-semibold text-lg mb-1">Secure</div>
          <p className="text-gray-500">Secure certificates of the authority</p>
        </div>
        <div>
          <div className="font-semibold text-lg mb-1">Shipping</div>
          <p className="text-gray-500">Free, fast, and reliable worldwide</p>
        </div>
      </section>

      {/* Popular Books */}
      <section className="px-10 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Our Popular Books</h2>
          <a href="#" className="text-sm underline">See all</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            {
              title: "All Of Twenty Nine",
              price: "$65.99",
              rating: 4,
              image: "/all.jpg",
            },
            {
              title: "Scholar Select",
              price: "$45.99",
              rating: 5,
              image: "/booktwo.jpg",
            },
            {
              title: "A Short History Of English",
              price: "$55.99",
              rating: 4,
              image: "/history.jpg",
            },
            {
              title: "Atomic Habits",
              price: "$39.99",
              rating: 5,
              image: "/atomichabits.webp",
            },
            {
              title: "Sapiens",
              price: "$49.99",
              rating: 5,
              image: "/Sapiens__A_Brief_History_of_Humankind.jpg",
            },
            {
              title: "To Kill a Mockingbird",
              price: "$42.99",
              rating: 4,
              image: "/mocking.jpg",
            },
            {
              title: "The Subtle Art of Not Giving a F*ck",
              price: "$44.99",
              rating: 4,
              image: "/subtle_art.jpeg",
            },
            {
              title: "Ikigai",
              price: "$34.99",
              rating: 5,
              image: "/ikigai.webp",
            },
            {
              title: "The Alchemist",
              price: "$39.99",
              rating: 5,
              image: "/alchemist.jpeg",
            }
          ].map((book, index) => (
            <div key={index} className="bg-[#e5dac6] p-4 rounded-xl shadow-md">
              <img src={book.image} alt={book.title} className="w-full h-56 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">By From Wilde</p>
              <div className="text-yellow-500 my-1">
                {"★".repeat(book.rating)}
                {"☆".repeat(5 - book.rating)}
              </div>
              <p className="text-md font-bold">{book.price}</p>
              <button className="w-full mt-2 border border-gray-400 rounded px-4 py-2 hover:bg-gray-100">
                ADD TO CART +
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}