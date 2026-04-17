import React, { useState, useImperativeHandle, forwardRef } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { useTheme } from '../context/ThemeContext';

const CarouselViewer = forwardRef(({ carousel, palette, customColor, selectedFormat }, ref) => {
  const { isDark, theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const paletteColors = {
    vibrant: { bg: '#FF6B6B', text: '#FFF', secondary: '#FFD93D' },
    minimal: { bg: '#F5F5F5', text: '#333', secondary: '#0284C7' },
    ocean: { bg: '#0284C7', text: '#FFF', secondary: '#00D9FF' },
    sunset: { bg: '#F97316', text: '#FFF', secondary: '#FFD700' },
    forest: { bg: '#16A34A', text: '#FFF', secondary: '#FFD700' },
    slate: { bg: '#475569', text: '#FFF', secondary: '#00D9FF' },
    sage: { bg: '#78716C', text: '#FFF', secondary: '#FFD93D' },
    stone: { bg: '#78716C', text: '#FFF', secondary: '#FFD93D' },
    mauve: { bg: '#6B5B7A', text: '#FFF', secondary: '#FFD93D' },
    charcoal: { bg: '#36393F', text: '#FFF', secondary: '#00D9FF' },
  };

  // Use customColor if provided, otherwise fall back to palette
  const bgColor = customColor || paletteColors[palette]?.bg || paletteColors.vibrant.bg;
  
  // Use customColor directly for text if provided, otherwise use palette text color
  let textColor;
  if (customColor) {
    textColor = customColor;
  } else {
    textColor = paletteColors[palette]?.text || '#FFF';
  }
  
  const secondaryColor = customColor || paletteColors[palette]?.secondary || '#FFD93D';
  
  const colors = {
    bg: bgColor,
    text: textColor,
    secondary: secondaryColor
  };
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
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: null,
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

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const timestamp = Date.now();

      for (let i = 0; i < slides.length; i++) {
        // Temporarily switch to each slide
        setCurrentSlide(i);
        
        // Wait for React to render the new slide
        await new Promise(resolve => setTimeout(resolve, 100));

        const element = document.getElementById('carousel-container');
        const canvas = await html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          backgroundColor: null,
        });

        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        // Add to zip with slide number
        zip.file(`slide-${i + 1}.png`, blob);
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `thinkcraft-carousel-${selectedFormat}-${timestamp}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      // Return to first slide
      setCurrentSlide(0);
    } catch (error) {
      console.error('Error downloading carousel:', error);
      alert('Failed to download carousel. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Expose downloadAll method via ref
  useImperativeHandle(ref, () => ({
    downloadAll: handleDownloadAll
  }));

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
          className={`${getContainerClass()} rounded-2xl shadow-2xl overflow-hidden relative`}
        >
          {/* Background Image */}
          <div
            className="w-full h-full absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: currentSlideData?.imageUrl
                ? `url('${currentSlideData.imageUrl}')`
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Light Shadow Overlay for Text Readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
            }}
          />

          {/* Text Content */}
          <div className="w-full h-full flex flex-col items-center justify-center p-6 relative z-10">
            <div className="w-full text-center space-y-4 flex flex-col items-center">
              <h2
                className="text-4xl font-bold leading-tight drop-shadow-lg w-full text-center"
                style={{ color: colors.text }}
              >
                {currentSlideData?.headline}
              </h2>
              <p
                className="text-lg leading-relaxed drop-shadow-md opacity-95 w-full text-center"
                style={{ color: colors.text }}
              >
                {currentSlideData?.body}
              </p>
            </div>
          </div>

          {/* Slide Number Badge */}
          <div
            data-html2canvas-ignore="true"
            className="absolute top-4 right-4 px-3 py-1 rounded-full font-semibold z-20 text-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              color: '#000000',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.4)',
            }}
          >
            {currentSlide + 1}/{totalSlides}
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div
        data-html2canvas-ignore="true"
        className={`border ${theme.colors.border} rounded-xl p-6 space-y-6 transition-colors duration-300 ${isDark ? 'bg-slate-900/40' : 'bg-gray-100'}`}
      >
        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`p-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 ${isDark ? 'bg-slate-800/60 hover:bg-slate-700/60' : 'bg-gray-300 hover:bg-gray-400'}`}
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
                      ? 'bg-slate-700/60 hover:bg-slate-600/60 w-3 h-3'
                      : 'bg-gray-400 hover:bg-gray-500 w-3 h-3'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className={`p-3 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition duration-200 ${isDark ? 'bg-slate-800/60 hover:bg-slate-700/60' : 'bg-gray-300 hover:bg-gray-400'}`}
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
});

CarouselViewer.displayName = 'CarouselViewer';

export default CarouselViewer;
