import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCarouselStructure, generateImages } from '../services/api';

const FormPage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState('vibrant');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const palettes = {
    vibrant: { name: 'Vibrant', bg: '#FF6B6B', text: '#FFF' },
    minimal: { name: 'Minimal', bg: '#F5F5F5', text: '#333' },
    ocean: { name: 'Ocean', bg: '#0284C7', text: '#FFF' },
    sunset: { name: 'Sunset', bg: '#F97316', text: '#FFF' },
    forest: { name: 'Forest', bg: '#16A34A', text: '#FFF' },
  };

  const tones = [
    { value: 'professional', icon: '💼', label: 'Professional' },
    { value: 'casual', icon: '😊', label: 'Casual' },
    { value: 'creative', icon: '🎨', label: 'Creative' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!prompt.trim()) {
      setError('Please share your idea first');
      return;
    }

    setLoading(true);

    try {
      const structureRes = await generateCarouselStructure(prompt, tone, '1:1');
      const carouselStructure = structureRes.data;

      const imagesRes = await generateImages(carouselStructure);

      const carousel = {
        ...carouselStructure,
        slides: carouselStructure.slides.map((slide, idx) => ({
          ...slide,
          imageUrl: imagesRes.data.images[idx]?.imageUrl,
          imageError: imagesRes.data.images[idx]?.error,
        })),
      };

      localStorage.setItem('carousel', JSON.stringify(carousel));
      localStorage.setItem('palette', palette);
      localStorage.setItem('tone', tone);

      navigate('/viewer');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate carousel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Turn Ideas into Impact
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-2">Create stunning AI-powered social media carousels in seconds</p>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <span>✨</span>
            <p>Powered by AI • Instant Results • 5 Beautiful Slides</p>
            <span>✨</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Prompt Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💭</span>
                </div>
                <label className="block text-lg font-semibold text-white">Your Idea</label>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to create? E.g., A carousel about productivity tips for remote workers, benefits of meditation, marketing strategies, etc."
                className="w-full h-28 p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 resize-none transition"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-slate-400">Be specific about the topic or theme you want to explore</p>
            </div>

            {/* Tone Selector */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎭</span>
                </div>
                <label className="block text-lg font-semibold text-white">Tone & Style</label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition duration-200 ${
                      tone === t.value
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{t.icon}</div>
                    <p className="font-semibold text-white text-sm">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎨</span>
                </div>
                <label className="block text-lg font-semibold text-white">Color Palette</label>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(palettes).map(([key, pal]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPalette(key)}
                    disabled={loading}
                    className={`h-16 rounded-xl border-2 transition duration-200 transform hover:scale-105 ${
                      palette === key ? 'border-cyan-300 ring-2 ring-cyan-400/50 scale-105' : 'border-slate-600'
                    }`}
                    style={{ backgroundColor: pal.bg }}
                    title={pal.name}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-200 text-sm flex items-start gap-3">
                <span className="text-lg mt-0.5">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition duration-200 transform ${
                loading
                  ? 'bg-slate-600 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 shadow-lg hover:shadow-cyan-500/50'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating your carousel...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>Generate My Carousel</span>
                  <span>→</span>
                </span>
              )}
            </button>

            {/* Info */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
              <div className="text-center">
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs text-slate-400">30-60 seconds</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🎬</div>
                <p className="text-xs text-slate-400">5 Slides</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📸</div>
                <p className="text-xs text-slate-400">AI Images</p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>Built with ThinkCraft • Transform your ideas into engaging content</p>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
