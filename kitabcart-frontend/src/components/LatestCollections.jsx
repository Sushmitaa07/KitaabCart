import React, { useState, useEffect } from 'react';

const LatestCollections = () => {
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

  const latestCollections = [
    {
      id: 1,
      title: "New Arrivals 2025",
      bookCount: "150+ Books",
      image: "https://i.pinimg.com/1200x/f7/f7/00/f7f700826f57bbf9f725288a4b442c5e.jpg",
      description: "Discover the latest books that just hit our shelves"
    },
    {
      id: 2,
      title: "Award Winners",
      bookCount: "85+ Books",
      image: "https://i.pinimg.com/736x/1e/b8/4e/1eb84e1c3d38e1706806278297216d76.jpg",
      description: "Celebrate excellence with award-winning literature"
    },
    {
      id: 3,
      title: "Trending Now",
      bookCount: "120+ Books",
      image: "https://i.pinimg.com/1200x/13/e5/d3/13e5d39632910da4d364f9c50859f041.jpg",
      description: "What everyone is talking about right now"
    }
  ];

  return (
    <section 
      id="latest-collections" 
      className="py-20 bg-gray-100"
      data-animate
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible['latest-collections'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Collections</h2>
          <p className="text-xl text-gray-600">Discover our newest and most exciting book collections</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {latestCollections.map((collection, index) => (
            <div 
              key={collection.id} 
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 overflow-hidden ${
                isVisible['latest-collections'] 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-75'
              }`}
              style={{
                transitionDelay: isVisible['latest-collections'] ? `${index * 200}ms` : '0ms'
              }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {collection.bookCount}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                  {collection.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{collection.description}</p>
                <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCollections;
