import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselViewer from '../components/CarouselViewer';
import FormatSelector from '../components/FormatSelector';
import { useTheme } from '../context/ThemeContext';

const ViewerPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const [carousel, setCarousel] = useState(null);
  const [palette, setPalette] = useState('slate');
  const [customColor, setCustomColor] = useState('#475569');
  const [tone, setTone] = useState('professional');
  const [selectedFormat, setSelectedFormat] = useState('1:1');
  const [formatCarousels, setFormatCarousels] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('carousel');
    const savedPalette = localStorage.getItem('palette');
    const savedCustomColor = localStorage.getItem('customColor');
    const savedTone = localStorage.getItem('tone');

    if (!saved) {
      navigate('/');
      return;
    }

    const parsedCarousel = JSON.parse(saved);
    setCarousel(parsedCarousel);
    setPalette(savedPalette || 'slate');
    setCustomColor(savedCustomColor || '#475569');
    setTone(savedTone || 'professional');

    setFormatCarousels({ '1:1': parsedCarousel });
  }, [navigate]);

  const handleFormatChange = async (format) => {
    if (formatCarousels[format]) {
      setSelectedFormat(format);
      return;
    }

    setLoading(true);
    try {
      const { adaptFormat } = await import('../services/api');
      const result = await adaptFormat(carousel, format, tone);

      const newCarousel = {
        ...result.data.carouselStructure,
        slides: result.data.carouselStructure.slides.map((slide, idx) => ({
          ...slide,
          imageUrl: result.data.images[idx]?.imageUrl,
          imageError: result.data.images[idx]?.error,
        })),
      };

      setFormatCarousels((prev) => ({
        ...prev,
        [format]: newCarousel,
      }));

      setSelectedFormat(format);
    } catch (error) {
      console.error('Error adapting format:', error);
      alert('Failed to adapt carousel for ' + format);
    } finally {
      setLoading(false);
    }
  };

  if (!carousel) {
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 bg-transparent`}>
        <div className="text-center">
          <div className={`animate-spin h-12 w-12 border-4 rounded-full mx-auto mb-4 ${isDark ? 'border-cyan-400 border-t-transparent' : 'border-blue-600 border-t-transparent'}`}></div>
          <p className={theme.colors.text.tertiary}>Loading your carousel...</p>
        </div>
      </div>
    );
  }

  const currentCarousel = formatCarousels[selectedFormat] || carousel;

  return (
    <div className={`min-h-screen py-12 px-4 transition-colors duration-300 bg-transparent`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold mb-4">
            <span className={`bg-gradient-to-r ${theme.colors.gradient} bg-clip-text text-transparent`}>
              Your Carousel
            </span>
          </h1>
          <p className={`text-lg ${theme.colors.text.tertiary}`}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone • {selectedFormat} Format • Ready to Download
          </p>
        </div>

        {/* Format Selector */}
        <div className="mb-12">
          <FormatSelector
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatChange}
            loading={loading}
          />
        </div>

        {/* Carousel Viewer */}
        <div className="mb-12">
          <div className={`${theme.colors.bg.card} rounded-2xl border ${theme.colors.border} p-8 shadow-2xl transition-colors duration-300`}>
            <CarouselViewer
              carousel={currentCarousel}
              palette={palette}
              customColor={customColor}
              selectedFormat={selectedFormat}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className={`px-8 py-3 rounded-xl font-semibold transition duration-200 border flex items-center gap-2 ${
              isDark
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border-slate-600'
                : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-900 border-gray-300'
            }`}
          >
            <span>←</span>
            <span>Create New</span>
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('carousel-container');
              const btn = element.parentElement.querySelector('[data-download-btn]');
              if (btn) btn.click();
            }}
            className={`px-8 py-3 rounded-xl font-semibold transition duration-200 shadow-lg text-white flex items-center gap-2 ${
              isDark
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/50'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-400/50'
            }`}
          >
            <span>Download Carousel</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-600' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Customize</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Edit and refine each slide to match your message perfectly</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-600' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Adapt</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Switch between formats for different social media platforms</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-600' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Export</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Download individual slides or the entire carousel as PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
