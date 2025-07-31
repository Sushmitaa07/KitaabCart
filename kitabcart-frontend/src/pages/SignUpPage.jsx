// src/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'buyer', // default role for signup
      };

      await authService.register(userData);

      setMessage('Signup successful! You can now log in.');
      setSuccess(true);

      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Book Reading Illustration */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center p-12">
          <div className="max-w-lg w-full">
            {/* Beautiful Book Vector */}
            <svg
              viewBox="0 0 500 500"
              className="w-full h-auto max-w-md mx-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle */}
              <circle cx="250" cy="250" r="200" fill="#F3F4F6" opacity="0.1" />
              
              {/* Stack of Books */}
              <g transform="translate(100, 150)">
                {/* Book 1 - Large book at bottom */}
                <rect x="0" y="160" width="300" height="40" rx="4" fill="#4B5563" />
                <rect x="10" y="165" width="280" height="30" rx="2" fill="#6B7280" />
                <text x="150" y="185" textAnchor="middle" fill="white" fontSize="14">
                  Adventure Stories
                </text>

                {/* Book 2 */}
                <rect x="20" y="120" width="260" height="35" rx="4" fill="#6B7280" />
                <rect x="25" y="125" width="250" height="25" rx="2" fill="#9CA3AF" />
                <text x="150" y="142" textAnchor="middle" fill="white" fontSize="12">
                  Mystery Tales
                </text>

                {/* Book 3 */}
                <rect x="40" y="85" width="220" height="30" rx="4" fill="#9CA3AF" />
                <rect x="45" y="90" width="210" height="20" rx="2" fill="#D1D5DB" />
                <text x="150" y="104" textAnchor="middle" fill="#4B5563" fontSize="10">
                  Fantasy Worlds
                </text>

                {/* Floating Elements */}
                <g>
                  {/* Magic sparkles */}
                  <circle cx="10" cy="70" r="2" fill="#FCD34D" opacity="0.6" />
                  <circle cx="290" cy="90" r="2" fill="#FCD34D" opacity="0.8" />
                  <circle cx="150" cy="40" r="2" fill="#FCD34D" opacity="0.7" />
                  
                  {/* Flying pages */}
                  <path d="M30,60 Q40,50 50,60 Q45,70 30,60" fill="white" opacity="0.6" />
                  <path d="M260,80 Q270,70 280,80 Q275,90 260,80" fill="white" opacity="0.8" />
                </g>

                {/* Reading Glasses */}
                <g transform="translate(100, 50)">
                  <circle cx="0" cy="0" r="15" fill="none" stroke="#6B7280" strokeWidth="2" />
                  <circle cx="40" cy="0" r="15" fill="none" stroke="#6B7280" strokeWidth="2" />
                  <line x1="15" y1="0" x2="25" y2="0" stroke="#6B7280" strokeWidth="2" />
                  <line x1="-25" y1="0" x2="-15" y2="-5" stroke="#6B7280" strokeWidth="2" />
                </g>

                {/* Floating Books Around */}
                <g opacity="0.7">
                  {/* Small Floating Books */}
                  <rect x="-20" y="-70" width="30" height="20" rx="2" fill="#1F2937" transform="rotate(-15)" />
                  <rect x="190" y="-50" width="25" height="18" rx="2" fill="#4B5563" transform="rotate(20)" />
                  <rect x="210" y="100" width="28" height="22" rx="2" fill="#374151" transform="rotate(-25)" />
                  <rect x="-40" y="130" width="32" height="24" rx="2" fill="#1F2937" transform="rotate(10)" />
                </g>
              </g>

              {/* Knowledge Symbols */}
              <text x="120" y="160" fontSize="20" fill="#9CA3AF" opacity="0.6">💡</text>
              <text x="280" y="180" fontSize="18" fill="#9CA3AF" opacity="0.5">🎓</text>
              <text x="100" y="320" fontSize="16" fill="#9CA3AF" opacity="0.4">✨</text>
              <text x="320" y="320" fontSize="16" fill="#9CA3AF" opacity="0.4">📖</text>
            </svg>

            {/* Text Content */}
            <div className="text-center mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Join Our Reading Community
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create your account and become part of a thriving community of book lovers. 
                Get personalized recommendations, track your reading progress, and discover new favorites.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Personalized book recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Track your reading journey</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Exclusive member discounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Form Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Start your reading journey with us today
              </p>
            </div>

            {/* Form */}
            <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-100">
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  success
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-gray-600 focus:ring-gray-400 border-gray-300 rounded mt-1" 
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-gray-800 hover:text-gray-900 font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-gray-800 hover:text-gray-900 font-medium">
                      Privacy Policy
                    </a>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-gray-800 hover:text-gray-900 transition duration-200">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}