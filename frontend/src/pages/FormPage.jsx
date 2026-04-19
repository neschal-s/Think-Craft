import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCarouselStructure, generateImages } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { SelectionButton, ColorPaletteButton, FullWidthButton } from '../styles/ModernButtons';
import FactPopup from '../components/FactPopup';

const FormPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState('ocean');
  const [customColor, setCustomColor] = useState('#1e40af');
  const [tone, setTone] = useState('professional');
  const [slideCount, setSlideCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const words = ['Carousels', 'Stories', 'Posts'];

  // Typewriter effect
  useEffect(() => {
    const currentWord = words[wordIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentWord.length) {
          setDisplayedText(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Finished typing, start deleting after 2 seconds
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setDisplayedText(currentWord.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setCharIndex(0);
        }
      }
    }, isDeleting ? 80 : 100); // Faster deletion, slower typing

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, words]);

  const palettes = {
    ocean: { name: 'Ocean Blue', bg: '#1e40af', text: '#FFF' },
    emerald: { name: 'Emerald Green', bg: '#047857', text: '#FFF' },
    purple: { name: 'Deep Purple', bg: '#7c3aed', text: '#FFF' },
    coral: { name: 'Coral Red', bg: '#dc2626', text: '#FFF' },
    amber: { name: 'Amber Gold', bg: '#d97706', text: '#FFF' },
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
      const structureRes = await generateCarouselStructure(prompt, tone, '1:1', slideCount);
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
      localStorage.setItem('prompt', prompt);

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
          <h1 className="font-['Orbitron'] text-6xl md:text-7xl font-black mb-6 leading-tight tracking-wider">
            <span className={`font-['Orbitron'] bg-gradient-to-r ${theme.colors.gradient} bg-clip-text text-transparent`}>
              Create Stunning{' '}
              <span className="font-['Orbitron'] inline-block min-w-[400px] md:min-w-[500px] text-center">
                {displayedText}
                <span className="animate-pulse">|</span>
              </span>
            </span>
          </h1>
          <p className={`font-['Inter'] text-lg md:text-xl ${theme.colors.text.secondary} mb-3 font-medium`}>Powered by AI • {slideCount} Beautiful Slides • Instant Results</p>
          <p className={`font-['Inter'] ${theme.colors.text.tertiary} text-sm font-normal leading-relaxed`}>Transform your ideas into engaging social media content in 30-60 seconds</p>
        </div>

        {/* Main Card */}
        <div className={`${theme.colors.bg.card} rounded-2xl border ${theme.colors.border} p-8 backdrop-blur-sm transition-colors duration-300 ${isDark ? 'shadow-2xl' : 'shadow-lg'}`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Prompt Section */}
            <div>
              <label className={`block font-['Inter'] text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Your Idea</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to create? E.g., A carousel about productivity tips for remote workers, benefits of meditation, marketing strategies, etc."
                className={`w-full h-28 p-4 rounded-xl resize-none transition focus:outline-none focus:ring-2 font-['Inter'] ${isDark 
                  ? 'bg-[#1a1d25] border border-[#2a2d35] text-white placeholder-[#8a8d93] focus:border-[#0055ff] focus:ring-[#0055ff]/20'
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0055ff] focus:ring-[#0055ff]/20'
                }`}
                disabled={loading}
              />
              <p className={`mt-2 font-['Inter'] text-sm ${theme.colors.text.tertiary}`}>Be specific about the topic or theme you want to explore</p>
            </div>

            {/* Tone Selector */}
            <div>
              <label className={`block font-['Inter'] text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Tone & Style</label>
              <div className="grid grid-cols-3 gap-3">
                {tones.map((t) => (
                  <SelectionButton
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    disabled={loading}
                    $isDark={isDark}
                    $isSelected={tone === t.value}
                  >
                    <p className="font-semibold text-sm">{t.label}</p>
                  </SelectionButton>
                ))}
              </div>
            </div>

            {/* Slide Count Selector */}
            <div>
              <label className={`block font-['Inter'] text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Number of Slides</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={slideCount}
                    onChange={(e) => setSlideCount(parseInt(e.target.value))}
                    disabled={loading}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#0055ff]`}
                    style={{
                      background: isDark ? '#2a2d35' : '#e5e7eb',
                    }}
                  />
                </div>
                <div className={`px-4 py-2 rounded-lg font-['Inter'] font-bold text-lg ${
                  isDark 
                    ? 'bg-[#1a1d25] border border-[#0055ff]/30 text-[#0088ff]' 
                    : 'bg-blue-50 border border-[#0055ff]/30 text-[#0055ff]'
                }`}>
                  {slideCount}
                </div>
              </div>
              <p className={`mt-2 font-['Inter'] text-sm ${theme.colors.text.tertiary}`}>Choose between 1 and 12 slides for your carousel</p>
            </div>

            {/* Color Palette */}
            <div>
              <label className={`block font-['Inter'] text-lg font-semibold ${theme.colors.text.primary} mb-4`}>Color Palette</label>
              
              {/* Preset Colors */}
              <div className="mb-6">
                <p className={`font-['Inter'] text-sm ${theme.colors.text.secondary} mb-3`}>Quick Presets</p>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(palettes).map(([key, pal]) => (
                    <ColorPaletteButton
                      key={key}
                      onClick={() => {
                        setPalette(key);
                        setCustomColor(pal.bg);
                      }}
                      disabled={loading}
                      $isDark={isDark}
                      className={palette === key ? 'selected' : ''}
                      style={{ backgroundColor: pal.bg }}
                      title={pal.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Picker */}
              <div>
                <p className={`font-['Inter'] text-sm ${theme.colors.text.secondary} mb-3`}>Or Choose Any Color</p>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setPalette('custom');
                    }}
                    disabled={loading}
                    className="w-20 h-16 rounded-xl border-2 border-[#0055ff] cursor-pointer"
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
                      className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none focus:ring-2 font-['Inter'] ${isDark 
                        ? 'bg-[#1a1d25] border-[#2a2d35] text-white placeholder-[#8a8d93] focus:border-[#0055ff] focus:ring-[#0055ff]/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0055ff] focus:ring-[#0055ff]/20'
                      }`}
                    />
                  </div>
                </div>
                <p className={`font-['Inter'] text-xs ${theme.colors.text.tertiary} mt-2`}>You can paste hex codes like #FF5733 or use the color picker</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`p-4 rounded-xl text-sm font-['Inter'] ${isDark 
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
              $isDark={isDark}
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
            <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${theme.colors.border}`}>
              <div className="text-center">
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>30-60s</p>
                <p className={`text-xs ${theme.colors.text.tertiary}`}>Generation Time</p>
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

        {/* Fact Popup */}
        <FactPopup />
      </div>
    </div>
  );
};

export default FormPage;
