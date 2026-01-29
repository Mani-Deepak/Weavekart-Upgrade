import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, MapPin, Ruler, Info, ChevronDown, ChevronUp, ShoppingBag, ArrowRight, Sparkles, Loader } from 'lucide-react';

import { products } from '../data/mockData';

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('Navy');
  const [activeTab, setActiveTab] = useState('fabric'); // Kept for future use if needed

  // Try-On State
  const [tryOnState, setTryOnState] = useState('idle'); // idle, processing, result

  // Find product from shared mock data
  const product = products.find(p => p.id === id) || products[0]; // Fallback to first product if not found

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [openSections, setOpenSections] = useState({
      fabric: true,
      material: false,
      style: false,
      other: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const handleVirtualTryOn = () => {
      setTryOnState('processing');
      // Simulate backend delay
      setTimeout(() => {
          setTryOnState('result');
      }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:px-8 max-w-7xl overflow-x-hidden">
       {/* Main Transition Container with Gap */}
       <div className="flex items-start gap-8 transition-all duration-700 ease-in-out w-full relative">
           
           {/* LEFT SIDE: Product Content (Image + Details) */}
           <div className={`transition-all duration-700 ease-in-out ${tryOnState !== 'idle' ? 'w-1/2' : 'w-full'}`}>
               <div className={`grid gap-12 transition-all duration-700 ${tryOnState !== 'idle' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                    
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className={`aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-secondary-100 shadow-sm relative flex items-center justify-center p-8 transition-all duration-500 ${tryOnState !== 'idle' ? 'shadow-md ring-1 ring-secondary-200' : ''}`}>
                            <img 
                                src={activeImage} 
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                         {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`min-w-[80px] w-20 aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col h-full">
                         {/* Header Info */}
                        <div className="mb-6 border-b border-secondary-200 pb-6">
                            <h1 className="text-3xl font-bold text-text-900 mb-2 leading-tight">{product.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-500 mb-4">
                                <span className="bg-secondary-100 px-2 py-1 rounded text-secondary-700 font-medium">
                                    {product.category} • {product.subCategory}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{product.rating}</span>
                                    <span className="text-secondary-400 font-normal">({product.reviewCount} Reviews)</span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {product.madeIn}
                                </span>
                            </div>

                            <div className="flex items-end gap-3">
                                <span className="text-3xl font-bold text-text-900">₹{product.price}</span>
                                <span className="text-xl text-secondary-400 line-through">₹{product.originalPrice}</span>
                                <span className="text-lg font-bold text-orange-500">{product.discount}% OFF</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-text-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Selectors */}
                        <div className="space-y-6 mb-8">
                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-bold text-text-900 mb-3 uppercase tracking-wide">Select Color</h3>
                                <div className="flex gap-3">
                                    {product.colors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-10 h-10 rounded-full ${color.class} shadow-sm transition-transform hover:scale-105 flex items-center justify-center ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                                            title={color.name}
                                        >
                                            {selectedColor === color.name && <span className="block w-2 h-2 bg-white rounded-full shadow-sm" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-bold text-text-900 uppercase tracking-wide">Select Size</h3>
                                    <button className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1">
                                        <Ruler className="w-3 h-3" /> Size Chart
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size.name}
                                            onClick={() => size.stock > 0 && setSelectedSize(size.name)}
                                            disabled={size.stock === 0}
                                            className={`
                                                min-w-[3rem] px-4 py-2 border rounded-lg font-medium transition-all
                                                ${selectedSize === size.name 
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' 
                                                    : size.stock === 0 
                                                        ? 'border-secondary-100 bg-secondary-50 text-secondary-300 cursor-not-allowed decoration-slice line-through' 
                                                        : 'border-secondary-300 hover:border-primary-300 text-text-700 bg-white'
                                                }
                                            `}
                                        >
                                            {size.name}
                                            {size.stock <= 5 && size.stock > 0 && (
                                                <span className="block text-[10px] text-orange-500 font-normal leading-none mt-0.5">Left: {size.stock}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <ShoppingBag className="w-5 h-5" /> Add to Cart
                            </button>
                            <button 
                                onClick={handleVirtualTryOn}
                                disabled={tryOnState !== 'idle'}
                                className={`
                                    flex-1 border-2 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
                                    ${tryOnState !== 'idle' 
                                        ? 'bg-secondary-100 border-secondary-100 text-secondary-400 cursor-not-allowed scale-95 opacity-50' 
                                        : 'bg-white border-primary-500 text-primary-600 hover:bg-primary-50'
                                    }
                                `}
                            >
                                {tryOnState === 'processing' ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                {tryOnState === 'idle' ? 'Virtual Try-On' : 'Trying On...'}
                            </button>
                            <button className="p-4 rounded-xl border border-secondary-200 text-secondary-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Only show metadata if NOT trying on to save space/reduce scroll? Or keep it? Keeping it for now. */}
                        
                    </div>
               </div>
           </div>

           {/* RIGHT SIDE: Virtual Try-On Result Box */}
           <div className={`transition-all duration-700 ease-in-out relative sticky top-20 ${tryOnState !== 'idle' ? 'w-1/2 opacity-100 h-[calc(100vh-6rem)]' : 'w-0 opacity-0 h-0 overflow-hidden'}`}>
                <div className="h-full bg-white rounded-2xl border border-secondary-200 shadow-xl overflow-hidden relative flex flex-col">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-secondary-200 flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-accent-500" />
                            <h3 className="font-bold text-text-900">Virtual Try-On Result</h3>
                        </div>
                        <button 
                            onClick={() => setTryOnState('idle')}
                            className="p-1.5 rounded-full hover:bg-secondary-100 text-text-500 hover:text-red-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 relative bg-secondary-50 p-8 flex items-center justify-center">
                        {/* Processing State */}
                        {tryOnState === 'processing' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 rounded-full border-4 border-secondary-200"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
                                </div>
                                <h4 className="text-xl font-bold text-text-900 mb-2">Generating Your Look</h4>
                                <p className="text-text-500 max-w-xs mx-auto">Our AI is mapping the outfit to your body measurements for a precise fit...</p>
                            </div>
                        )}

                        {/* Result State */}
                        {tryOnState === 'result' && (
                            <div className="w-full h-full max-h-[600px] animate-fade-in relative group flex items-center justify-center p-4 bg-white rounded-xl shadow-inner border border-secondary-100">
                                <img 
                                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600" 
                                    alt="Virtual Try-On Result" 
                                    className="w-full h-full object-contain"
                                />
                                {/* Overlay Controls */}
                                <div className="absolute bottom-0 inset-x-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-4 z-10">
                                     <button className="px-6 py-2 bg-white text-text-900 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-md">
                                        Save Look
                                     </button>
                                     <button className="px-6 py-2 bg-primary-600 text-white rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary-900/50">
                                        Add to Cart
                                     </button>
                                </div>
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 shadow-sm">
                                    AI Generated
                                </div>
                            </div>
                        )}
                    </div>
                </div>
           </div>

       </div>
    </div>
  );
};

export default ProductDetails;
