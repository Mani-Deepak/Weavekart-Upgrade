import React, { useState } from 'react';
import { Upload as UploadIcon, X, Sparkles, Loader, Check } from 'lucide-react';
import { recommendFromImage } from '../services/recommendationService';
import RecommendationCard from '../components/RecommendationCard';

const Upload = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Form State
  const [season, setSeason] = useState('');
  const [occasion, setOccasion] = useState('');
  const [gender, setGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);

  const seasonOptions = [
    { label: 'Summer ☀️', value: 'Summer' },
    { label: 'Winter ❄️', value: 'Winter' },
    { label: 'Rainy 🌧️', value: 'Rainy' },
    { label: 'Spring 🌸', value: 'Spring' },
    { label: 'All-season', value: 'All-season' }
  ];

  const occasionOptions = ['Casual', 'Formal', 'Office / Work', 'Party', 'Traditional / Festival', 'Wedding'];
  const ageOptions = ['Teen (13–19)', 'Young Adult (20–30)', 'Adult (31–45)', '45+'];
  const styleOptions = ['Classic', 'Minimal', 'Streetwear', 'Modern', 'Ethnic', 'Luxury'];

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setResults(null);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    // Mock passing data
    console.log({ season, occasion, gender, ageGroup, selectedStyles });
    try {
      const response = await recommendFromImage(image);
      setResults(response.data);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-900 mb-8 font-serif">Style from Image</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Input Area */}
          <div className="w-full lg:w-5/12 space-y-8">
            {/* 1. Image Upload */}
            <div className="bg-background-50 p-6 rounded-2xl shadow-sm border border-secondary-200">
              <h2 className="font-bold text-text-900 mb-4">1. Upload Image reference</h2>
              {!image ? (
                <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center hover:bg-secondary-100 transition-colors">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="imageInput" 
                    accept="image/*"
                  />
                  <label htmlFor="imageInput" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-4">
                      <UploadIcon className="w-8 h-8" />
                    </div>
                    <span className="text-text-700 font-medium mb-1">Click to Upload</span>
                    <span className="text-text-400 text-sm">JPG, PNG up to 5MB</span>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden shadow-md group">
                  <img src={image} alt="Preview" className="w-full h-64 object-cover" />
                  <button 
                    onClick={() => { setImage(null); setResults(null); }}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. Preferences Form */}
            <div className="bg-background-50 p-6 rounded-2xl shadow-sm border border-secondary-200 space-y-6">
                <h2 className="font-bold text-text-900 border-b border-secondary-200 pb-2">2. Customize Preferences</h2>
                
                {/* Season & Occasion Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-700 mb-1.5">Season <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select 
                                value={season} 
                                onChange={(e) => setSeason(e.target.value)}
                                className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-secondary-300 bg-white focus:ring-2 focus:ring-primary-500 appearance-none text-text-900 text-sm"
                            >
                                <option value="" disabled>Select Season</option>
                                {seasonOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-400">▼</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-700 mb-1.5">Occasion <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <select 
                                value={occasion} 
                                onChange={(e) => setOccasion(e.target.value)}
                                className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-secondary-300 bg-white focus:ring-2 focus:ring-primary-500 appearance-none text-text-900 text-sm"
                            >
                                <option value="" disabled>Select Occasion</option>
                                {occasionOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-400">▼</div>
                        </div>
                    </div>
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-text-700 mb-2">Gender / Target</label>
                    <div className="flex gap-2">
                        {['Men', 'Women', 'Unisex'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                    gender === g 
                                    ? 'bg-primary-600 text-white shadow-md' 
                                    : 'bg-white border border-secondary-300 text-text-600 hover:bg-secondary-50'
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Age Group */}
                <div>
                     <label className="block text-sm font-medium text-text-700 mb-1.5">Age Group <span className="text-text-400 font-normal text-xs">(Optional)</span></label>
                      <div className="relative">
                        <select 
                            value={ageGroup} 
                            onChange={(e) => setAgeGroup(e.target.value)}
                            className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-secondary-300 bg-white focus:ring-2 focus:ring-primary-500 appearance-none text-text-900 text-sm"
                        >
                            <option value="">Select Age Group</option>
                             {ageOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-400">▼</div>
                    </div>
                </div>

                {/* Style Preferences */}
                <div>
                    <label className="block text-sm font-medium text-text-700 mb-2">Style Preference</label>
                    <div className="flex flex-wrap gap-2">
                        {styleOptions.map((style) => {
                            const isSelected = selectedStyles.includes(style);
                            return (
                                <button
                                    key={style}
                                    onClick={() => toggleStyle(style)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                        isSelected 
                                        ? 'bg-accent-50 border-accent-500 text-accent-700' 
                                        : 'bg-white border-secondary-300 text-text-600 hover:border-primary-300'
                                    }`}
                                >
                                    {style}
                                </button>
                            );
                        })}
                    </div>
                </div>

                 <button
                    onClick={handleGenerate}
                    disabled={!image || loading}
                    className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {loading ? (
                    <>
                        <Loader className="w-5 h-5 animate-spin" /> Analyzing Style...
                    </>
                    ) : (
                    <>
                        <Sparkles className="w-5 h-5" /> Generate Recommendations
                    </>
                    )}
                </button>
            </div>
          </div>

          {/* Right: Results Area */}
          <div className="w-full lg:w-7/12">
            {!results && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-text-400 border-2 border-dashed border-secondary-200 rounded-2xl min-h-[600px] bg-background-50/50">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p>Upload an image and set preferences to see magic happen</p>
              </div>
            )}

            {results && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-text-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-accent-500 rounded-full"></span>
                  We found these matching items:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
