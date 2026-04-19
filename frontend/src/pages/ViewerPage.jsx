import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselViewer from '../components/CarouselViewer';
import FormatSelector from '../components/FormatSelector';
import { useTheme } from '../context/ThemeContext';
import { SecondaryButton, PrimaryButton } from '../styles/ModernButtons';

const ViewerPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const carouselRef = useRef(null);
  const [carousel, setCarousel] = useState(null);
  const [palette, setPalette] = useState('slate');
  const [customColor, setCustomColor] = useState('#475569');
  const [tone, setTone] = useState('professional');
  const [selectedFormat, setSelectedFormat] = useState('1:1');

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
  }, [navigate]);

  const handleFormatChange = (format) => {
    // Just change the format - content and images stay the same
    // Only the aspect ratio/CSS dimensions change
    setSelectedFormat(format);
  };

  const handleRegenerateSlide = async (slideIndex, type) => {
    // type can be 'text', 'image', or 'both'
    try {
      const endpoint = type === 'image' 
        ? '/api/generate/slide-image'
        : type === 'both'
        ? '/api/generate/slide-full'
        : '/api/generate/slide-text';

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideIndex,
          currentSlide: carousel.slides[slideIndex],
          format: carousel.format || '1:1',
          tone,
          prompt: carousel.prompt || 'Generate educational content'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to regenerate: ${response.statusText}`);
      }

      const updated = await response.json();
      
      // Update carousel with regenerated content
      setCarousel(prev => {
        const newCarousel = { ...prev };
        if (updated.slides && updated.slides[slideIndex]) {
          newCarousel.slides[slideIndex] = {
            ...newCarousel.slides[slideIndex],
            ...updated.slides[slideIndex]
          };
        }
        localStorage.setItem('carousel', JSON.stringify(newCarousel));
        return newCarousel;
      });

      alert(`Slide regenerated successfully!`);
    } catch (error) {
      console.error('Regeneration error:', error);
      throw error;
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

  return (
    <div className={`min-h-screen py-12 px-4 transition-colors duration-300 bg-transparent`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-['Orbitron'] text-6xl font-black mb-4 tracking-wider">
            <span className={`font-['Orbitron'] bg-gradient-to-r ${theme.colors.gradient} bg-clip-text text-transparent`}>
              Your Carousel
            </span>
          </h1>
          <p className={`font-['Inter'] text-lg ${theme.colors.text.tertiary} font-normal`}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone • {selectedFormat} Format • Ready to Download
          </p>
        </div>

        {/* Format Selector */}
        <div className="mb-12">
          <FormatSelector
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatChange}
          />
        </div>

        {/* Carousel Viewer */}
        <div className="mb-12">
          <div className={`${theme.colors.bg.card} rounded-2xl border ${theme.colors.border} p-8 ${isDark ? 'shadow-2xl' : 'shadow-lg'} transition-colors duration-300`}>
            <CarouselViewer
              ref={carouselRef}
              carousel={carousel}
              palette={palette}
              customColor={customColor}
              selectedFormat={selectedFormat}
              onRegenerateSlide={handleRegenerateSlide}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <SecondaryButton
            onClick={() => navigate('/')}
            $isDark={isDark}
          >
            <span>←</span>
            <span>Create New</span>
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              if (carouselRef.current && carouselRef.current.downloadAll) {
                carouselRef.current.downloadAll();
              }
            }}
            $isDark={isDark}
          >
            <span>📥 Download All Slides as ZIP</span>
          </PrimaryButton>
        </div>

        {/* Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Customize</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Edit and refine each slide to match your message perfectly</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Adapt</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Switch between formats for different social media platforms</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Export</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Download individual slides or the entire carousel as PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
