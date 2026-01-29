import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Type, ArrowRight } from 'lucide-react';

const Recommend = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-text-900 mb-4 font-serif">How should we start?</h1>
        <p className="text-xl text-text-500">Choose your preferred way to get personalized style advice.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Option A: Upload */}
        <div 
          onClick={() => navigate('/upload')}
          className="group relative bg-background-50 border border-secondary-200 rounded-2xl p-8 cursor-pointer hover:border-primary-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
              <Camera className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-900 mb-2">Upload a Photo</h2>
            <p className="text-text-500 mb-8">
              Got an item you love but don't know how to style? Upload a picture and let AI build an outfit around it.
            </p>
            <span className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Start Uploading <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Option B: Describe */}
        <div 
          onClick={() => navigate('/describe')}
          className="group relative bg-background-50 border border-secondary-200 rounded-2xl p-8 cursor-pointer hover:border-accent-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-100 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent-100 transition-colors">
              <Type className="w-10 h-10 text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-900 mb-2">Describe Your Needs</h2>
            <p className="text-text-500 mb-8">
              Going to a wedding or a casual brunch? Tell us the occasion, season, and budget, and we'll handle the rest.
            </p>
            <span className="text-accent-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Start Describing <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
