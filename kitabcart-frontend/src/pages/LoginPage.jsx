import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await authService.login(formData.email, formData.password);
      setMessage('Login successful!');

      // Dispatch events to notify other components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('userStateChanged'));
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content Frame */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#cdcdcd'}}>
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-12">
              <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Sign in to your account to continue
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {message && (
                    <div className={`p-3 rounded-lg text-sm ${
                      message.includes('successful') 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-gray-600 focus:ring-gray-400 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition duration-200">
                        Forgot password?
                      </a>
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
                          Signing In...
                        </span>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link to="/signup" className="font-medium text-gray-800 hover:text-gray-900 transition duration-200">
                        Create one here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Beautiful Book Stack Vector */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-12">
              <div className="max-w-lg w-full">
                {/* Book Stack SVG Vector */}
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-auto max-w-md mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background Circle */}
                  <circle cx="250" cy="250" r="200" fill="url(#gradient1)" opacity="0.1" />
                  
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#6B7280', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#374151', stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#9CA3AF', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#6B7280', stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#D1D5DB', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#9CA3AF', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  
                  {/* Book Stack */}
                  {/* Book 1 - Bottom */}
                  <rect x="100" y="360" width="300" height="50" rx="6" fill="url(#gradient1)" />
                  <rect x="110" y="370" width="280" height="30" rx="4" fill="url(#gradient2)" />
                  <text x="250" y="390" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                    Classic Literature
                  </text>
                  
                  {/* Book 2 */}
                  <rect x="90" y="300" width="320" height="55" rx="6" fill="url(#gradient2)" />
                  <rect x="100" y="310" width="300" height="35" rx="4" fill="url(#gradient3)" />
                  <text x="250" y="333" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
                    Modern Fiction
                  </text>
                  
                  {/* Book 3 */}
                  <rect x="110" y="240" width="280" height="52" rx="6" fill="url(#gradient3)" />
                  <rect x="120" y="250" width="260" height="32" rx="4" fill="#F3F4F6" />
                  <text x="250" y="271" textAnchor="middle" fill="#374151" fontSize="13" fontWeight="bold">
                    Science & Technology
                  </text>
                  
                  {/* Book 4 */}
                  <rect x="120" y="185" width="260" height="48" rx="6" fill="#E5E7EB" />
                  <rect x="130" y="195" width="240" height="28" rx="4" fill="#F9FAFB" />
                  <text x="250" y="214" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">
                    Philosophy & Ethics
                  </text>
                  
                  {/* Book 5 - Top */}
                  <rect x="130" y="135" width="240" height="45" rx="6" fill="#F3F4F6" />
                  <rect x="140" y="145" width="220" height="25" rx="4" fill="#FFFFFF" />
                  <text x="250" y="162" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="bold">
                    Poetry & Arts
                  </text>
                  
                  {/* Decorative Elements */}
                  <circle cx="420" cy="120" r="4" fill="#D1D5DB" opacity="0.6" />
                  <circle cx="80" cy="180" r="3" fill="#D1D5DB" opacity="0.4" />
                  <circle cx="410" cy="300" r="3.5" fill="#D1D5DB" opacity="0.5" />
                  <circle cx="60" cy="320" r="2.5" fill="#D1D5DB" opacity="0.3" />
                  
                  {/* Reading Glasses on Top */}
                  <ellipse cx="220" cy="110" rx="25" ry="10" fill="none" stroke="#6B7280" strokeWidth="3" />
                  <ellipse cx="280" cy="110" rx="25" ry="10" fill="none" stroke="#6B7280" strokeWidth="3" />
                  <line x1="245" y1="110" x2="255" y2="110" stroke="#6B7280" strokeWidth="3" />
                  <line x1="195" y1="110" x2="180" y2="105" stroke="#6B7280" strokeWidth="3" />
                  <line x1="305" y1="110" x2="320" y2="105" stroke="#6B7280" strokeWidth="3" />
                  
                  {/* Floating Book Pages */}
                  <path d="M350 160 Q360 150 370 160 Q365 170 350 160" fill="#F3F4F6" opacity="0.7" />
                  <path d="M380 200 Q390 190 400 200 Q395 210 380 200" fill="#E5E7EB" opacity="0.8" />
                  <path d="M140 100 Q150 90 160 100 Q155 110 140 100" fill="#D1D5DB" opacity="0.6" />
                </svg>

                {/* Text Content */}
                <div className="text-center mt-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Gateway to Knowledge
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover thousands of books across all genres. From timeless classics to contemporary bestsellers, 
                    find your next great read with KitabCart.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">10K+</div>
                    <div className="text-sm text-gray-600">Books</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">5K+</div>
                    <div className="text-sm text-gray-600">Readers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">99%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}