import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCarouselStructure, generateImages } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { SelectionButton, ColorPaletteButton, FullWidthButton } from '../styles/ModernButtons';

const FormPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState('slate');
  const [customColor, setCustomColor] = useState('#475569');
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
      localStorage.setItem('customColor', customColor);
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
    <div className={`min-h-screen flex items-center justify-center p-4 py-12 transition-colors duration-300 bg-transparent`}>
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
                  ? 'bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20'
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
                  <SelectionButton
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    disabled={loading}
                    isDark={isDark}
                    isSelected={tone === t.value}
                  >
                    <p className="font-semibold text-sm">{t.label}</p>
                  </SelectionButton>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className={`block text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Color Palette</label>
              
              {/* Preset Colors */}
              <div className="mb-6">
                <p className={`text-sm ${theme.colors.text.secondary} mb-3`}>Quick Presets</p>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(palettes).map(([key, pal]) => (
                    <ColorPaletteButton
                      key={key}
                      onClick={() => {
                        setPalette(key);
                        setCustomColor(pal.bg);
                      }}
                      disabled={loading}
                      isDark={isDark}
                      className={palette === key ? 'selected' : ''}
                      style={{ backgroundColor: pal.bg }}
                      title={pal.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Picker */}
              <div>
                <p className={`text-sm ${theme.colors.text.secondary} mb-3`}>Or Choose Any Color</p>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setPalette('custom');
                    }}
                    disabled={loading}
                    className="w-20 h-16 rounded-xl border-2 border-slate-400 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                          setCustomColor(e.target.value);
                          setPalette('custom');
                        }
                      }}
                      placeholder="#000000"
                      disabled={loading}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 ${isDark 
                        ? 'bg-slate-900/50 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                  </div>
                </div>
                <p className={`text-xs ${theme.colors.text.tertiary} mt-2`}>You can paste hex codes like #FF5733 or use the color picker</p>
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
            <FullWidthButton
              type="submit"
              disabled={loading}
              isDark={isDark}
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
            </FullWidthButton>

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
