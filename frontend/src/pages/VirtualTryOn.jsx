import React, { useState } from 'react';
import { Upload, X, Download, Layers, Move, Loader, BadgeInfo, Wand2 } from 'lucide-react';
import api from '../api/client';

const VirtualTryOn = () => {
  const [userImage, setUserImage] = useState(null);
  const [fileObject, setFileObject] = useState(null);

  // Mode: 'manual' or 'ai'
  const [mode, setMode] = useState('manual');

  // Manual Overlay State
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0.9);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const overlays = [
    { id: 1, name: 'Summer Shirt', src: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=500&bg=transparent', type: 'Top' },
    { id: 2, name: 'Floral Dress', src: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=500&bg=transparent', type: 'Dress' },
    { id: 3, name: 'Denim Jacket', src: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=500&bg=transparent', type: 'Outerwear' },
    { id: 4, name: 'Casual Blazer', src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500&bg=transparent', type: 'Blazer' },
  ];

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileObject(file);
      setUserImage(URL.createObjectURL(file));
      setGeneratedImage(null);
    }
  };

  // Manual Drag Logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  // AI Logic
  const handleAiGenerate = async () => {
    if (!fileObject || !aiPrompt.trim()) return;

    setAiLoading(true);
    try {
      const response = await api.generateTryOn(fileObject, aiPrompt);
      if (response && response.image_url) {
        const fullUrl = api.getGeneratedImageUrl(response.image_url);
        setGeneratedImage(fullUrl);
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Failed to generate outfit. Backend likely unavailable or missing GPU.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-900 font-serif">Virtual Try-On</h1>
            <p className="text-text-500 mt-2">Experience style with Manual Overlays or AI Generation.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'manual' ? 'bg-primary-600 text-white' : 'bg-white text-text-600 border'}`}
            >
              Manual Overlay
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${mode === 'ai' ? 'bg-accent-600 text-white' : 'bg-white text-text-600 border'}`}
            >
              <Wand2 className="w-4 h-4" /> AI Generator
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Canvas */}
          <div className="w-full lg:w-2/3">
            <div
              className="bg-background-50 rounded-2xl border border-secondary-200 shadow-sm overflow-hidden h-[600px] relative flex items-center justify-center select-none"
              onMouseMove={mode === 'manual' ? handleMouseMove : undefined}
              onMouseUp={mode === 'manual' ? handleMouseUp : undefined}
              onMouseLeave={mode === 'manual' ? handleMouseUp : undefined}
            >
              {!userImage ? (
                <label className="cursor-pointer flex flex-col items-center p-12 text-center hover:bg-secondary-100 transition-colors rounded-xl border-2 border-dashed border-secondary-300">
                  <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-10 h-10" />
                  </div>
                  <span className="text-xl font-semibold text-text-800">Upload Your Photo</span>
                </label>
              ) : (
                <>
                  {/* Base Image */}
                  <img src={userImage} alt="User" className="absolute w-full h-full object-contain pointer-events-none" />

                  {/* Manual Overlay Layer */}
                  {mode === 'manual' && selectedOverlay && (
                    <div
                      className="absolute cursor-move"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        opacity: opacity,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                      }}
                      onMouseDown={handleMouseDown}
                    >
                      <img src={selectedOverlay.src} alt="Outfit" className="w-64 pointer-events-none drop-shadow-2xl" />
                    </div>
                  )}

                  {/* AI Result Layer (Overlays on top if present) */}
                  {mode === 'ai' && generatedImage && (
                    <img src={generatedImage} alt="Generated" className="absolute w-full h-full object-contain z-10 bg-white" />
                  )}

                  {/* Reset Button */}
                  <button
                    onClick={() => { setUserImage(null); setGeneratedImage(null); setFileObject(null); }}
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow hover:bg-white text-red-500 z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}

              {aiLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="flex flex-col items-center animate-pulse">
                    <Wand2 className="w-12 h-12 text-accent-600 mb-4" />
                    <span className="text-xl font-bold text-accent-800">Designing your outfit...</span>
                    <span className="text-sm text-text-500 mt-2">This may take up to 30 seconds</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">

            {mode === 'manual' ? (
              <>
                {/* Manual Controls */}
                <div className="bg-white p-6 rounded-2xl border border-secondary-200">
                  <h3 className="font-bold text-text-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary-500" /> Select Outfit
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {overlays.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setSelectedOverlay(item); setPosition({ x: 0, y: 0 }); }}
                        className={`p-2 rounded-xl border ${selectedOverlay?.id === item.id ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'}`}
                      >
                        <div className="aspect-[3/4] bg-gray-100 rounded mb-2 overflow-hidden">
                          <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm block text-center font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedOverlay && (
                  <div className="bg-white p-6 rounded-2xl border border-secondary-200">
                    <h3 className="font-bold mb-4">Adjustments</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm block mb-1">Scale</label>
                        <input type="range" min="0.5" max="2" step="0.1" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <label className="text-sm block mb-1">Opacity</label>
                        <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* AI Controls */}
                <div className="bg-white p-6 rounded-2xl border border-accent-200 shadow-sm">
                  <h3 className="font-bold text-text-900 mb-4 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-accent-500" /> AI Style Generator
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-700 mb-2">Describe the outfit</label>
                      <textarea
                        className="w-full p-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 min-h-[100px]"
                        placeholder="E.g. A flowing red silk evening gown with golden embroidery, cinematic lighting..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleAiGenerate}
                      disabled={!userImage || !aiPrompt || aiLoading}
                      className="w-full py-3 bg-gradient-to-r from-accent-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {aiLoading ? 'Generating...' : 'Generate Look'}
                    </button>

                    {!userImage && (
                      <p className="text-xs text-red-500 text-center">Please upload an image first</p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
                  <p><strong>Note:</strong> AI generation requires a GPU backend. Generation takes ~10-20 seconds.</p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;
