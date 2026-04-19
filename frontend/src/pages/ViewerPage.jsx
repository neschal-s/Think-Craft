import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselViewer from '../components/CarouselViewer';
import FormatSelector from '../components/FormatSelector';
import DownloadOptions from '../components/DownloadOptions';
import DownloadScopeOptions from '../components/DownloadScopeOptions';
import TonePromptAdjustment from '../components/TonePromptAdjustment';
import { useTheme } from '../context/ThemeContext';
import { SecondaryButton, PrimaryButton, SuccessButton, WarningButton, DangerButton, CompactButton } from '../styles/ModernButtons';
import { googleFonts, formatFontForCSS } from '../utils/fontLoader';

const ViewerPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const carouselRef = useRef(null);
  const [carousel, setCarousel] = useState(null);
  const [palette, setPalette] = useState('ocean');
  const [customColor, setCustomColor] = useState('#1e40af');
  const [tone, setTone] = useState('professional');
  const [selectedFormat, setSelectedFormat] = useState('1:1');
  const [originalPrompt, setOriginalPrompt] = useState('');
  
  // UI State
  const [editMode, setEditMode] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloadMode, setDownloadMode] = useState(null); // 'scope' | 'format' | null
  const [downloadScope, setDownloadScope] = useState('all'); // 'current' | 'all'
  const [showToneAdjustment, setShowToneAdjustment] = useState(false);
  
  // Font State
  const [headingFont, setHeadingFont] = useState('Orbitron');
  const [bodyFont, setBodyFont] = useState('Inter');

  useEffect(() => {
    const saved = localStorage.getItem('carousel');
    const savedPalette = localStorage.getItem('palette');
    const savedCustomColor = localStorage.getItem('customColor');
    const savedTone = localStorage.getItem('tone');
    const savedPrompt = localStorage.getItem('prompt');

    if (!saved) {
      navigate('/');
      return;
    }

    const parsedCarousel = JSON.parse(saved);
    setCarousel(parsedCarousel);
    setPalette(savedPalette || 'ocean');
    setCustomColor(savedCustomColor || '#1e40af');
    setTone(savedTone || 'professional');
    setOriginalPrompt(savedPrompt || '');
  }, [navigate]);

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  const handleFontChange = (type, font) => {
    if (type === 'heading') {
      setHeadingFont(font);
    } else {
      setBodyFont(font);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      if (downloadScope === 'current') {
        if (carouselRef.current && carouselRef.current.downloadSlide) {
          await carouselRef.current.downloadSlide();
        }
      } else {
        if (carouselRef.current && carouselRef.current.downloadAll) {
          await carouselRef.current.downloadAll();
        }
      }
    } catch (error) {
      console.error('PNG download error:', error);
      alert('Failed to download PNG. Please try again.');
    } finally {
      setShowDownloadMenu(false);
      setDownloadMode(null);
      setDownloadScope('all');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (downloadScope === 'current') {
        if (carouselRef.current && carouselRef.current.downloadSlidePDF) {
          await carouselRef.current.downloadSlidePDF();
        }
      } else {
        if (carouselRef.current && carouselRef.current.downloadAllPDF) {
          await carouselRef.current.downloadAllPDF();
        }
      }
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setShowDownloadMenu(false);
      setDownloadMode(null);
      setDownloadScope('all');
    }
  };

  const handleDownloadPPT = async () => {
    try {
      if (downloadScope === 'current') {
        if (carouselRef.current && carouselRef.current.downloadSlidePPT) {
          await carouselRef.current.downloadSlidePPT();
        }
      } else {
        if (carouselRef.current && carouselRef.current.downloadAllPPT) {
          await carouselRef.current.downloadAllPPT();
        }
      }
    } catch (error) {
      console.error('PPT download error:', error);
      alert('Failed to download PowerPoint. Please try again.');
    } finally {
      setShowDownloadMenu(false);
      setDownloadMode(null);
      setDownloadScope('all');
    }
  };

  const handleDownloadMenuClick = () => {
    setShowDownloadMenu(!showDownloadMenu);
    if (showDownloadMenu) {
      setDownloadMode(null);
      setDownloadScope('all');
    } else {
      setDownloadMode('scope');
    }
  };

  const handleScopeSelection = (scope) => {
    setDownloadScope(scope);
    setDownloadMode('format');
  };

  const handleBackToScope = () => {
    setDownloadMode('scope');
  };

  const handleRegenerateWithChanges = async (newPrompt, newTone) => {
    try {
      // This would call the backend to regenerate
      // For now, we'll just show a placeholder
      alert('🚀 Regenerating carousel with new prompt and tone...\n\nThis feature requires backend integration.');
      setShowToneAdjustment(false);
    } catch (error) {
      console.error('Error regenerating:', error);
      alert('Failed to regenerate carousel');
    }
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
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 bg-transparent`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-['Orbitron'] text-4xl md:text-5xl font-black mb-2 tracking-wider">
            <span className={`font-['Orbitron'] bg-gradient-to-r ${theme.colors.gradient} bg-clip-text text-transparent`}>
              Your Carousel
            </span>
          </h1>
          <p className={`font-['Inter'] text-sm md:text-base ${theme.colors.text.tertiary} font-normal`}>
            {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone • {selectedFormat} Format • Ready to Download
          </p>
        </div>

        {/* Split Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left Column - Carousel Viewer (2/3 width) */}
          <div className="lg:col-span-2">
            <div className={`${theme.colors.bg.card} rounded-2xl border ${theme.colors.border} p-6 ${isDark ? 'shadow-2xl' : 'shadow-lg'} transition-colors duration-300 sticky top-24`}>
              <CarouselViewer
                ref={carouselRef}
                carousel={carousel}
                palette={palette}
                customColor={customColor}
                selectedFormat={selectedFormat}
                onRegenerateSlide={handleRegenerateSlide}
                headingFont={headingFont}
                bodyFont={bodyFont}
              />
            </div>
          </div>

          {/* Right Column - Editing Options (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {!editMode ? (
                <>
                  {/* Format Selector */}
                  <div className={`${theme.colors.bg.card} rounded-2xl border ${theme.colors.border} p-6 ${isDark ? 'shadow-2xl' : 'shadow-lg'} transition-colors duration-300`}>
                    <h3 className={`font-['Inter'] font-bold text-sm mb-4 ${theme.colors.text.primary}`}>Choose Your Format</h3>
                    <FormatSelector
                      selectedFormat={selectedFormat}
                      onFormatChange={handleFormatChange}
                    />
                  </div>

                  {/* Edit Slide Button */}
                  <SecondaryButton
                    onClick={() => setEditMode(true)}
                    $isDark={isDark}
                    style={{ width: '100%' }}
                  >
                    <span>Edit Slide</span>
                  </SecondaryButton>

                  {/* Adjust Tone Button */}
                  <SecondaryButton
                    onClick={() => setShowToneAdjustment(!showToneAdjustment)}
                    $isDark={isDark}
                    style={{ width: '100%' }}
                  >
                    <span>Adjust Tone</span>
                  </SecondaryButton>

                  {/* Tone Adjustment Panel */}
                  {showToneAdjustment && (
                    <div className={`${theme.colors.bg.secondary} rounded-xl border ${theme.colors.border} p-4`}>
                      <TonePromptAdjustment
                        currentPrompt={originalPrompt}
                        currentTone={tone}
                        onRegenerateWithChanges={handleRegenerateWithChanges}
                        onCancel={() => setShowToneAdjustment(false)}
                        isLoading={false}
                      />
                    </div>
                  )}

                  {/* Download Menu - Main Button */}
                  <div className="relative">
                    <PrimaryButton
                      onClick={handleDownloadMenuClick}
                      $isDark={isDark}
                      style={{ width: '100%' }}
                    >
                      <span>Download</span>
                    </PrimaryButton>
                    {showDownloadMenu && (
                      <div className="absolute top-full mt-2 right-0 z-50">
                        {downloadMode === 'scope' && (
                          <DownloadScopeOptions
                            onSelectSlide={() => handleScopeSelection('current')}
                            onSelectAll={() => handleScopeSelection('all')}
                            onBack={() => {
                              setShowDownloadMenu(false);
                              setDownloadMode(null);
                            }}
                          />
                        )}
                        {downloadMode === 'format' && (
                          <DownloadOptions
                            onDownloadPNG={handleDownloadPNG}
                            onDownloadPDF={handleDownloadPDF}
                            onDownloadPPT={handleDownloadPPT}
                            onBack={handleBackToScope}
                            hasBack={true}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Create New Button */}
                  <SecondaryButton
                    onClick={() => navigate('/')}
                    $isDark={isDark}
                    style={{ width: '100%' }}
                  >
                    <span>Create New</span>
                  </SecondaryButton>
                </>
              ) : (
                /* Edit Mode Controls */
                <div className={`space-y-4 p-4 rounded-lg border ${theme.colors.border} ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                  <h3 className={`font-semibold text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                    Edit Slide {carouselRef.current?.getCurrentSlide?.() + 1 || 1}
                  </h3>

                  {/* Font Selectors */}
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Heading Font
                      </label>
                      <select
                        value={carouselRef.current?.getActiveHeadingFont?.() || 'Orbitron'}
                        onChange={(e) => carouselRef.current?.updateHeadingFont?.(e.target.value)}
                        className={`w-full p-2 rounded border text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        style={{ fontFamily: formatFontForCSS(carouselRef.current?.getActiveHeadingFont?.() || 'Orbitron') }}
                      >
                        {googleFonts.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Body Font
                      </label>
                      <select
                        value={carouselRef.current?.getActiveBodyFont?.() || 'Inter'}
                        onChange={(e) => carouselRef.current?.updateBodyFont?.(e.target.value)}
                        className={`w-full p-2 rounded border text-sm ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        style={{ fontFamily: formatFontForCSS(carouselRef.current?.getActiveBodyFont?.() || 'Inter') }}
                      >
                        {googleFonts.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Text Color Picker */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Text Color
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={carouselRef.current?.getCurrentSlideColor?.() || '#ffffff'}
                        onChange={(e) => carouselRef.current?.updateSlideColor?.(e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer border-2 border-gray-400"
                      />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {carouselRef.current?.getCurrentSlideColor?.() || '#ffffff'}
                      </span>
                      <CompactButton
                        onClick={() => {
                          carouselRef.current?.updateSlideColor?.(customColor || '#ffffff');
                        }}
                        $isDark={isDark}
                      >
                        Reset
                      </CompactButton>
                    </div>
                  </div>

                  {/* Regenerate Content */}
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      🔄 Regenerate
                    </label>
                    <div className="flex flex-col gap-2">
                      <WarningButton
                        onClick={() => handleRegenerateSlide(carouselRef.current?.getCurrentSlide?.() || 0, 'text')}
                        $isDark={isDark}
                        style={{ fontSize: '12px', padding: '8px' }}
                      >
                        🔄 Text
                      </WarningButton>
                      <WarningButton
                        onClick={() => handleRegenerateSlide(carouselRef.current?.getCurrentSlide?.() || 0, 'image')}
                        $isDark={isDark}
                        style={{ fontSize: '12px', padding: '8px' }}
                      >
                        🖼️ Image
                      </WarningButton>
                      <DangerButton
                        onClick={() => handleRegenerateSlide(carouselRef.current?.getCurrentSlide?.() || 0, 'both')}
                        $isDark={isDark}
                        style={{ fontSize: '12px', padding: '8px' }}
                      >
                        🔄 Both
                      </DangerButton>
                    </div>
                  </div>

                  {/* Close Edit Mode */}
                  <SuccessButton
                    onClick={() => setEditMode(false)}
                    $isDark={isDark}
                    style={{ width: '100%' }}
                  >
                    ✓ Done Editing
                  </SuccessButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Edit Slide</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Customize text, fonts, and more in real-time with live preview</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>🔄 Tone</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Adjust tone or prompt and regenerate carousel instantly</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>Download</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Export as PNG, PDF, or PowerPoint for any use case</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
