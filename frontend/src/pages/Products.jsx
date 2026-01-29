import React from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

import { products } from '../data/mockData';

const Products = () => {

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                 <h1 className="text-2xl font-bold text-text-900">New Arrivals</h1>
                 <p className="text-text-500">Explore the latest trends in fashion</p>
            </div>
            
            <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                     <Filter className="w-4 h-4" /> Filter
                 </button>
                 <div className="relative">
                     <button className="flex items-center gap-2 px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                         Sort by: Recommended <ChevronDown className="w-4 h-4" />
                     </button>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    </div>
  );
};

export default Products;
