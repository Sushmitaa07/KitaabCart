import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const featuredBooks = [
    {
      title: "Atomic Habits",
      description: "A proven framework for building better habits by James Clear.",
      image: "/atomichabits.webp",
      price: "$12.99",
    },
    {
      title: "Sapiens",
      description: "Yuval Noah Harari's groundbreaking narrative of human history.",
      image: "/Sapiens__A_Brief_History_of_Humankind.jpg",
      price: "$15.99",
    },
    {
      title: "The Alchemist",
      description: "A philosophical story about pursuing your dreams by Paulo Coelho.",
      image: "/alchemist.jpeg",
      price: "$10.49",
    },
    {
      title: "1984",
      description: "George Orwell’s chilling dystopian classic about surveillance and control.",
      image: "/eight-four.jpg",
      price: "$9.99",
    },

    
    {
      title: "The Subtle Art of Not Giving a F*ck",
      image: "\subtle_art.jpeg",
      price: "$11.99"
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      image: "\hpotter.jpg",
      price: "$13.49"
    },
    {
      title: "The Psychology of Money",
      image: "\psychology-of-money.jpg",
      price: "$14.25"
    },
    {
      title: "To Kill a Mockingbird",
      image: "\mocking.jpg",
      price: "$9.59"
    },
    {
      title: "The Hobbit",
      image: "\hbbit.jpg",
      price: "$12.30"
    },
    {
      title: "Thinking, Fast and Slow",
      image: "\thinking_fast.webp",
      price: "$13.00"
    },
    {
      title: "Educated",
      image: "\edu.webp",
      price: "$11.75"
    },
    {
      title: "Rich Dad Poor Dad",
      image: "\rich.jpg",
      price: "$10.90"
    },
    {
      title: "Ikigai",
      image: "\ikigai.webp",
      price: "$8.99"
    },
    {
      title: "The Power of Now",
      image: "\power.jpg",
      price: "$9.89"
    },
  ];



  return (
    <div className="min-h-screen bg-gray-900 text-white" style={{ width: "100vw", overflowX: "hidden" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">KitaabCart</h1>
          <img src="\src\logo_no_background.png" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        </div>
        <input
          type="text"
          placeholder="Search for the book you want and read it now..."
          className="w-1/2 px-4 py-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none"
        />
        <div className="flex items-center space-x-4">
          <button onClick={() => alert("No notifications")} className="bg-gray-700 p-2 rounded">Notifications</button>
          <button onClick={() => navigate("/register")} className="bg-gray-700 p-2 rounded">Register</button>
          <button onClick={() => navigate("/login")} className="bg-gray-700 p-2 rounded">Login</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Featured Books</h2>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {featuredBooks.map((book, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded shadow flex flex-col items-center">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-bold mb-1 text-center">{book.title}</h2>
              <p className="text-sm text-gray-400 mb-2 text-center">{book.description}</p>
              <p className="text-base font-semibold mb-2">{book.price}</p>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm">
                Add to Cart
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
