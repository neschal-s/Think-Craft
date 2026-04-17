import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { useTheme } from '../context/ThemeContext';

const CarouselViewer = ({ carousel, palette, selectedFormat }) => {
  const { isDark, theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const paletteColors = {
    vibrant: { bg: '#FF6B6B', text: '#FFF', secondary: '#FFD93D' },
    minimal: { bg: '#F5F5F5', text: '#333', secondary: '#0284C7' },
    ocean: { bg: '#0284C7', text: '#FFF', secondary: '#00D9FF' },
    sunset: { bg: '#F97316', text: '#FFF', secondary: '#FFD700' },
    forest: { bg: '#16A34A', text: '#FFF', secondary: '#FFD700' },
  };

  const colors = paletteColors[palette] || paletteColors.vibrant;
  const slides = carousel.slides || [];
  const totalSlides = slides.length;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('carousel-container');
      const canvas = await html2canvas(element, {
        backgroundColor: colors.bg,
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `thinkcraft-carousel-${selectedFormat}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Error downloading carousel:', error);
      alert('Failed to download carousel');
    } finally {
      setDownloading(false);
    }
  };

  const currentSlideData = slides[currentSlide];

  const getContainerClass = () => {
    switch(selectedFormat) {
      case '1:1':
        return 'w-full max-w-md mx-auto aspect-square';
      case '9:16':
        return 'w-full max-w-xs mx-auto aspect-[9/16]';
      case '16:9':
        return 'w-full max-w-3xl mx-auto aspect-video';
      default:
        return 'w-full max-w-md mx-auto aspect-square';
    }
  };

  return (
    <div className="space-y-8">
      {/* Carousel Display */}
      <div className="flex justify-center">
        <div
          id="carousel-container"
          className={`${getContainerClass()} rounded-2xl shadow-2xl overflow-hidden`}
          style={{ backgroundColor: colors.bg }}
        >
          <div className="w-full h-full flex flex-col">
            {/* Image Section */}
            <div className={`flex-1 overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-200 to-gray-300'}`}>
              {currentSlideData?.imageUrl ? (
                <img
                  src={currentSlideData.imageUrl}
                  alt={`Slide ${currentSlideData.slideNumber}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center opacity-50" style={{ color: colors.text }}>
                    <div className="text-4xl mb-2">📸</div>
                    <span className="text-sm">Image loading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Text Section */}
            <div className="flex-1 p-6 flex flex-col justify-center" style={{ color: colors.text }}>
              <h2 className="text-3xl font-bold mb-3 leading-tight">{currentSlideData?.headline}</h2>
              <p className="text-base leading-relaxed opacity-95">{currentSlideData?.body}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className={`border ${theme.colors.border} rounded-xl p-6 space-y-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`p-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            title="Previous slide"
          >
            <span className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>←</span>
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2 items-center">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition duration-200 ${
                  idx === currentSlide
                    ? isDark
                      ? 'bg-cyan-400 w-8 h-3'
                      : 'bg-blue-600 w-8 h-3'
                    : isDark
                      ? 'bg-slate-600 hover:bg-slate-500 w-3 h-3'
                      : 'bg-gray-400 hover:bg-gray-500 w-3 h-3'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className={`p-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            title="Next slide"
          >
            <span className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>→</span>
          </button>
        </div>

        {/* Slide Counter */}
        <div className="text-center">
          <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
            Slide <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{currentSlide + 1}</span> of{' '}
            <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>{totalSlides}</span>
          </p>
        </div>

        {/* Download Button */}
        <div className="text-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            data-download-btn
            className={`px-8 py-3 rounded-xl font-semibold transition duration-200 transform ${
              downloading
                ? isDark
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                : isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 active:scale-95 shadow-lg hover:shadow-cyan-500/50'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 active:scale-95 shadow-lg hover:shadow-blue-400/50'
            }`}
          >
            {downloading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Downloading...
              </span>
            ) : (
              <span>Download Slide as PNG</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselViewer;
