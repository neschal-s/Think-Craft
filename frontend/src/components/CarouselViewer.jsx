import React, { useState } from 'react';
import html2canvas from 'html2canvas';

const CarouselViewer = ({ carousel, palette, selectedFormat }) => {
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
      link.download = `carousel-${selectedFormat}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Error downloading carousel:', error);
      alert('Failed to download carousel');
    } finally {
      setDownloading(false);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="space-y-8">
      {/* Carousel Display */}
      <div
        id="carousel-container"
        className={`rounded-2xl shadow-2xl overflow-hidden ${
          selectedFormat === '1:1'
            ? 'w-full max-w-md mx-auto aspect-square'
            : selectedFormat === '9:16'
            ? 'w-full max-w-xs mx-auto aspect-video'
            : 'w-full max-w-2xl mx-auto aspect-video'
        }`}
        style={{ backgroundColor: colors.bg }}
      >
        <div className="w-full h-full flex flex-col">
          {/* Image Section */}
          <div className="flex-1 overflow-hidden bg-gray-200">
            {currentSlideData?.imageUrl ? (
              <img
                src={currentSlideData.imageUrl}
                alt={`Slide ${currentSlideData.slideNumber}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Loading image...</span>
              </div>
            )}
          </div>

          {/* Text Section */}
          <div className="flex-1 p-6 flex flex-col justify-center" style={{ color: colors.text }}>
            <h2 className="text-2xl font-bold mb-3">{currentSlideData?.headline}</h2>
            <p className="text-base leading-relaxed">{currentSlideData?.body}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === currentSlide ? 'bg-primary-500 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>

      {/* Slide Counter */}
      <div className="text-center text-gray-600">
        Slide {currentSlide + 1} of {totalSlides}
      </div>

      {/* Download Button */}
      <div className="text-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
            downloading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-secondary-500 hover:bg-secondary-600 active:scale-95'
          }`}
        >
          {downloading ? 'Downloading...' : '⬇️ Download as PNG'}
        </button>
      </div>
    </div>
  );
};

export default CarouselViewer;
