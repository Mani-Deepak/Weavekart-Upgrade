import React, { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';
import { recommendFromText } from '../services/recommendationService';
import RecommendationCard from '../components/RecommendationCard';

const Describe = () => {
  const [formData, setFormData] = useState({
    occasion: 'Casual',
    season: 'Summer',
    budget: 'Medium ($50-$150)',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass form data to mock service
      const response = await recommendFromText(formData);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text-900 mb-8 font-serif">Describe Your Needs</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Form */}
          <div className="w-full lg:w-1/3">
            <div className="bg-background-50 p-8 rounded-2xl shadow-sm border border-secondary-200 sticky top-24">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">Occasion</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.occasion}
                    onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                  >
                    <option>Casual</option>
                    <option>Work / Office</option>
                    <option>Party / Evening</option>
                    <option>Wedding</option>
                    <option>Vacation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">Season</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.season}
                    onChange={(e) => setFormData({...formData, season: e.target.value})}
                  >
                    <option>Summer</option>
                    <option>Winter</option>
                    <option>Spring</option>
                    <option>Autumn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">Budget</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  >
                    <option>Low (Under $50)</option>
                    <option>Medium ($50-$150)</option>
                    <option>High ($150+)</option>
                    <option>Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-700 mb-2">Specific Requirements</label>
                  <textarea 
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    placeholder="e.g. I need something floral but not too loud, suitable for a garden party."
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" /> Curating Outfit...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Generate Recommendations
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Results */}
          <div className="w-full lg:w-2/3">
             {!results && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-text-400 border-2 border-dashed border-secondary-200 rounded-2xl min-h-[400px]">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p>Fill out the form to get tailored advice</p>
              </div>
            )}

            {results && (
              <div className="animate-fade-in space-y-8">
                <div className="bg-secondary-50 p-6 rounded-xl border border-secondary-200">
                  <h3 className="font-serif text-xl font-bold text-text-900 mb-2">AIVA's Suggestion</h3>
                  <p className="text-text-600 italic">
                    "Based on your request for a <strong>{formData.season} {formData.occasion}</strong> outfit, 
                    we've selected pieces that blend comfort with elegance, staying within your <strong>{formData.budget}</strong> range."
                  </p>
                </div>

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

export default Describe;
