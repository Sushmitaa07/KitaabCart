import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual newsletter subscription logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Successfully subscribed to newsletter!');
      setEmail('');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
        <p className="text-gray-300 text-sm">
          Get the latest updates on new books, features, and admin tools delivered to your inbox.
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('Successfully') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
