import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCarouselStructure, generateImages } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const FormPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState('slate');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const palettes = {
    slate: { name: 'Slate', bg: '#475569', text: '#FFF' },
    sage: { name: 'Sage', bg: '#78716C', text: '#FFF' },
    stone: { name: 'Stone', bg: '#78716C', text: '#FFF' },
    mauve: { name: 'Mauve', bg: '#6B5B7A', text: '#FFF' },
    charcoal: { name: 'Charcoal', bg: '#36393F', text: '#FFF' },
  };

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'creative', label: 'Creative' },
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

  const getButtonStyle = (selected) => {
    if (isDark) {
      return selected
        ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500';
    } else {
      return selected
        ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-200'
        : 'border-gray-300 bg-gray-50 hover:border-gray-400';
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 py-12 transition-colors duration-300 ${theme.colors.bg.primary}`}>
      <div className="w-full max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            <span className={`bg-gradient-to-r ${theme.colors.gradient} bg-clip-text text-transparent`}>
              Create Stunning Carousels
            </span>
          </h1>
          <p className={`text-xl ${theme.colors.text.secondary} mb-3`}>Powered by AI • 5 Beautiful Slides • Instant Results</p>
          <p className={`${theme.colors.text.tertiary} text-sm`}>Transform your ideas into engaging social media content in 30-60 seconds</p>
        </div>

        {/* Main Card */}
        <div className={`${theme.colors.bg.card} rounded-2xl border ${theme.colors.border} p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Prompt Section */}
            <div>
              <label className={`block text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Your Idea</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to create? E.g., A carousel about productivity tips for remote workers, benefits of meditation, marketing strategies, etc."
                className={`w-full h-28 p-4 rounded-xl resize-none transition focus:outline-none focus:ring-2 ${isDark 
                  ? 'bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20'
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                disabled={loading}
              />
              <p className={`mt-2 text-sm ${theme.colors.text.tertiary}`}>Be specific about the topic or theme you want to explore</p>
            </div>

            {/* Tone Selector */}
            <div>
              <label className={`block text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Tone & Style</label>
              <div className="grid grid-cols-3 gap-3">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition duration-200 ${getButtonStyle(tone === t.value)} ${theme.colors.text.primary}`}
                  >
                    <p className="font-semibold text-sm">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className={`block text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Color Palette</label>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(palettes).map(([key, pal]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPalette(key)}
                    disabled={loading}
                    className={`h-16 rounded-xl border-2 transition duration-200 transform hover:scale-105 ${
                      palette === key 
                        ? isDark 
                          ? 'border-cyan-300 ring-2 ring-cyan-400/50 scale-105'
                          : 'border-blue-600 ring-2 ring-blue-300 scale-105'
                        : isDark
                          ? 'border-slate-600'
                          : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: pal.bg }}
                    title={pal.name}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-4 rounded-xl text-sm ${isDark 
                ? 'bg-red-900/30 border border-red-700 text-red-200'
                : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 transform ${
                loading
                  ? isDark 
                    ? 'bg-slate-600 cursor-not-allowed opacity-70'
                    : 'bg-gray-400 cursor-not-allowed opacity-70'
                  : isDark
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 active:scale-95 shadow-lg hover:shadow-cyan-500/50'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 active:scale-95 shadow-lg hover:shadow-blue-400/50'
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
                <span>Generate My Carousel</span>
              )}
            </button>

            {/* Info */}
            <div className={`grid grid-cols-3 gap-4 pt-4 border-t ${theme.colors.border}`}>
              <div className="text-center">
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>30-60s</p>
                <p className={`text-xs ${theme.colors.text.tertiary}`}>Generation Time</p>
              </div>
              <div className="text-center">
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>5 Slides</p>
                <p className={`text-xs ${theme.colors.text.tertiary}`}>Per Carousel</p>
              </div>
              <div className="text-center">
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>AI Powered</p>
                <p className={`text-xs ${theme.colors.text.tertiary}`}>Smart Images</p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={`text-center mt-12 ${theme.colors.text.tertiary} text-sm`}>
          <p>Transform your ideas into engaging content with ThinkCraft</p>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
