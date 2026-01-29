import React, { useState } from 'react';
import { Heart, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Destructure with defaults to prevent crashes
  const {
    id = '1',
    name = 'Premium Cotton T-Shirt',
    category = 'Casual',
    gender = 'Men',
    rating = 4.6,
    price = 1299,
    originalPrice = 1999,
    discount = 35,
    image = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    sizes = ['S', 'M', 'L', 'XL']
  } = product || {};

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white border-b border-secondary-100 flex items-center justify-center p-4">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-secondary-600 hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick View Overlay (appears on hover) */}
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <div className="flex justify-center">
             <button className="flex items-center gap-2 bg-white text-text-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-primary-50 transition-colors pointer-events-none group-hover:pointer-events-auto">
                <Eye className="w-4 h-4" /> Quick View
             </button>
           </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-1 gap-1">
        
        {/* Category & Gender */}
        <div className="flex items-center justify-between text-xs text-secondary-500 mb-1">
           <span>{gender} • {category}</span>
           <div className="flex items-center gap-1 bg-secondary-50 px-1.5 py-0.5 rounded text-secondary-700 font-medium">
             <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
             <span>{rating}</span>
           </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-text-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-bold text-text-900">₹{price}</span>
          {originalPrice && (
            <>
              <span className="text-sm text-secondary-400 line-through">₹{originalPrice}</span>
              <span className="text-xs font-bold text-orange-500">({discount}% OFF)</span>
            </>
          )}
        </div>

        {/* Sizes (Optional - shown if space/design permits, typically muted) */}
        <div className="mt-3 text-xs text-secondary-500">
           Sizes: <span className="text-secondary-700">{sizes.join(' ')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
