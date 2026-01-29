import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Star } from 'lucide-react';

import { products } from '../data/mockData';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-b2b9b32aflw?auto=format&fit=crop&q=80&w=800' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-background-950/40 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-accent-300" />
            <span className="text-sm font-medium tracking-wide uppercasetext-accent-100">
              AI-Powered Personalization
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif tracking-tight leading-tight">
            Fashion That <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-accent-200">
              Understands You
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-light">
            Discover your perfect look with AIVA's intelligent style recommendations. 
            Upload a photo or describe your occasion to get started.
          </p>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-text-900 font-serif">Curated Categories</h2>
          <button className="text-primary-600 font-medium hover:text-primary-700">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-secondary-200 relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all">
              <img 
                src={cat.image} 
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-white text-2xl font-bold tracking-wide">{cat.name}</span>
                <p className="text-gray-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">Explore Collection</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-secondary-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-900 font-serif mb-4">Trending Now</h2>
            <p className="text-text-500">The most coveted pieces this season</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-4 cursor-pointer"
              >
                <div className="aspect-[3/4] bg-white border border-secondary-100 rounded-lg mb-4 overflow-hidden relative group flex items-center justify-center p-2">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <h3 className="font-semibold text-text-900 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-text-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary-700">₹{product.price}</span>
                  <div className="flex items-center gap-1 text-xs font-medium bg-secondary-50 px-2 py-1 rounded text-secondary-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
