import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

const RecommendationCard = ({ item }) => {
  return (
    <div className="group bg-background-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary-700">
          Match: {item.matchScore}
        </div>
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-accent-500 bg-accent-50 px-2 py-0.5 rounded-full inline-block mb-2">
            {item.reason}
          </span>
          <h3 className="font-semibold text-text-900 group-hover:text-primary-700 transition-colors line-clamp-1">
            {item.title}
          </h3>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg text-text-800">{item.price}</span>
          <button className="p-2 bg-text-900 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
