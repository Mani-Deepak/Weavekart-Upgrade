import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PlaceholderPage = ({ title, icon: Icon }) => {
  const location = useLocation();
  const pageName = title || location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.slice(2);

  // Random fashion image based on page name length to keep it consistent per page but varied across pages
  const images = [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1920', // Shopping / General
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920', // Clothing rack
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920', // Coat
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1920', // Fashion model
  ];

  const imageIndex = pageName.length % images.length;
  const selectedImage = images[imageIndex];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Text Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-white text-center z-10">
          <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 text-primary-600 shadow-sm transform -rotate-6">
             {Icon ? <Icon className="w-12 h-12" /> : <span className="text-4xl">✨</span>}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-text-900 mb-6 font-serif tracking-tight">
            {pageName}
          </h1>
          
          <div className="w-16 h-1 bg-primary-500 rounded-full mb-8"></div>

          <p className="text-lg text-text-500 max-w-md mx-auto mb-10 leading-relaxed">
            We are crafting an exceptional <strong>{pageName}</strong> experience for you. 
            This feature is currently under development and will be launching soon.
          </p>
          
          <Link 
            to="/products" // Changed from /home to /products to keep user in shopping flow
            className="px-8 py-3 bg-text-900 text-white rounded-full font-medium hover:bg-text-800 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            Explore Collection
          </Link>
      </div>

      {/* Image Section */}
      <div className="hidden lg:block flex-1 relative bg-secondary-100">
         <img 
            src={selectedImage} 
            alt="Fashion Placeholder" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
         />
         <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5"></div>
      </div>

    </div>
  );
};

export default PlaceholderPage;
