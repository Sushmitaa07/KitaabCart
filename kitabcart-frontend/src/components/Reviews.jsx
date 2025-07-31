import React, { useState, useEffect } from 'react';

const Reviews = () => {
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'KitabCart has transformed my reading experience. The selection is amazing and delivery is always on time!',
      rating: 5,
      role: 'Book Enthusiast'
    },
    {
      name: 'Ahmed Hassan',
      text: 'Best online bookstore I have ever used. Great prices and excellent customer service.',
      rating: 5,
      role: 'Regular Customer'
    },
    {
      name: 'Priya Sharma',
      text: 'Love the user-friendly interface and the quick delivery. Highly recommended!',
      rating: 5,
      role: 'Avid Reader'
    }
  ];

  return (
    <section 
      id="reviews" 
      className="py-20 bg-white"
      data-animate
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.reviews ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Real reviews from real book lovers</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`bg-gray-50 p-8 rounded-xl transition-all duration-700 hover:shadow-lg transform hover:-translate-y-1 ${
                isVisible.reviews 
                  ? 'opacity-100 translate-x-0' 
                  : `opacity-0 ${index % 2 === 0 ? 'translate-x-10' : '-translate-x-10'}`
              }`}
              style={{
                transitionDelay: isVisible.reviews ? `${index * 200}ms` : '0ms'
              }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Review Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">2,847</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-sm text-gray-600">Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
