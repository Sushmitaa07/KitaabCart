import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">KitabCart</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner in discovering amazing books and building your personal library.
            </p>
            <div className="flex space-x-4">
              <span className="text-2xl cursor-pointer hover:text-gray-300">•</span>
              <span className="text-2xl cursor-pointer hover:text-gray-300">•</span>
              <span className="text-2xl cursor-pointer hover:text-gray-300">•</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#categories" className="text-gray-300 hover:text-white transition-colors">Categories</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Subscribe to get updates on new arrivals and special offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
              />
              <button className="bg-gray-600 px-4 py-2 rounded-r-md hover:bg-gray-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 KitabCart. All rights reserved. Made with care for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
