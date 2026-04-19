import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselViewer from '../components/CarouselViewer';
import FormatSelector from '../components/FormatSelector';
import EditingModal from '../components/EditingModal';
import DownloadOptions from '../components/DownloadOptions';
import TonePromptAdjustment from '../components/TonePromptAdjustment';
import { useTheme } from '../context/ThemeContext';
import { SecondaryButton, PrimaryButton } from '../styles/ModernButtons';
import { downloadSlideAsPNG, downloadAllSlidesAsPNG, downloadCarouselAsPDF, downloadCarouselAsPPT } from '../utils/downloadUtils';

const ViewerPage = () => {
  const navigate = useNavigate();
  const { isDark, theme } = useTheme();
  const carouselRef = useRef(null);
  const [carousel, setCarousel] = useState(null);
  const [palette, setPalette] = useState('slate');
  const [customColor, setCustomColor] = useState('#475569');
  const [tone, setTone] = useState('professional');
  const [selectedFormat, setSelectedFormat] = useState('1:1');
  const [originalPrompt, setOriginalPrompt] = useState('');
  
  // UI State
  const [editMode, setEditMode] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showToneAdjustment, setShowToneAdjustment] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState(0);
  
  // Font State
  const [headingFont, setHeadingFont] = useState('Orbitron');
  const [bodyFont, setBodyFont] = useState('Inter');
  
  // Edit State
  const [editingHeadline, setEditingHeadline] = useState('');
  const [editingBody, setEditingBody] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

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
    setPalette(savedPalette || 'slate');
    setCustomColor(savedCustomColor || '#475569');
    setTone(savedTone || 'professional');
    setOriginalPrompt(savedPrompt || '');
  }, [navigate]);

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  const handleEditSlide = () => {
    if (!carousel || carousel.slides.length === 0) return;
    const slide = carousel.slides[0];
    setEditingHeadline(slide.headline);
    setEditingBody(slide.body);
    setEditMode(true);
  };

  const handleSaveSlideEdit = () => {
    if (!carousel) return;

    const updatedCarousel = { ...carousel };
    updatedCarousel.slides[editingSlideIndex] = {
      ...updatedCarousel.slides[editingSlideIndex],
      headline: editingHeadline,
      body: editingBody,
    };

    setCarousel(updatedCarousel);
    localStorage.setItem('carousel', JSON.stringify(updatedCarousel));
    setEditMode(false);
  };

  const handleCloseEditModal = () => {
    setEditMode(false);
  };

  const handleFontChange = (type, font) => {
    if (type === 'heading') {
      setHeadingFont(font);
    } else {
      setBodyFont(font);
    }
  };

  const handleDownloadPNG = async () => {
    if (carouselRef.current && carouselRef.current.downloadAll) {
      await downloadAllSlidesAsPNG(carousel);
    }
    setShowDownloadMenu(false);
  };

  const handleDownloadPDF = async () => {
    try {
      await downloadCarouselAsPDF(carousel, headingFont, bodyFont);
      setShowDownloadMenu(false);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF. Make sure jsPDF is installed.');
    }
  };

  const handleDownloadPPT = async () => {
    try {
      await downloadCarouselAsPPT(carousel, headingFont, bodyFont);
      setShowDownloadMenu(false);
    } catch (error) {
      console.error('PPT download error:', error);
      alert('Failed to download PowerPoint. Make sure pptxgenjs is installed.');
    }
  };

  const handleRegenerateWithChanges = async (newPrompt, newTone) => {
    setIsRegenerating(true);
    try {
      // This would call the backend to regenerate
      // For now, we'll just show a placeholder
      alert('🚀 Regenerating carousel with new prompt and tone...\n\nThis feature requires backend integration.');
      setShowToneAdjustment(false);
      setIsRegenerating(false);
    } catch (error) {
      console.error('Error regenerating:', error);
      alert('Failed to regenerate carousel');
      setIsRegenerating(false);
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
              headingFont={headingFont}
              bodyFont={bodyFont}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
          <SecondaryButton
            onClick={() => navigate('/')}
            $isDark={isDark}
          >
            <span>←</span>
            <span>Create New</span>
          </SecondaryButton>

          <div className="relative">
            <PrimaryButton
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              $isDark={isDark}
            >
              <span>📥 Download</span>
            </PrimaryButton>
            {showDownloadMenu && (
              <div className="absolute top-full mt-2 right-0 z-50">
                <DownloadOptions
                  onDownloadPNG={handleDownloadPNG}
                  onDownloadPDF={handleDownloadPDF}
                  onDownloadPPT={handleDownloadPPT}
                />
              </div>
            )}
          </div>

          <SecondaryButton
            onClick={handleEditSlide}
            $isDark={isDark}
          >
            <span>✏️ Edit Slide</span>
          </SecondaryButton>

          <SecondaryButton
            onClick={() => setShowToneAdjustment(!showToneAdjustment)}
            $isDark={isDark}
          >
            <span>🔄 Adjust Tone</span>
          </SecondaryButton>

          {/* Tone Adjustment Panel */}
          {showToneAdjustment && (
            <div className="mb-8 w-full">
              <TonePromptAdjustment
                currentPrompt={originalPrompt}
                currentTone={tone}
                onRegenerateWithChanges={handleRegenerateWithChanges}
                onCancel={() => setShowToneAdjustment(false)}
                isLoading={isRegenerating}
              />
            </div>
          )}
        </div>

        {/* Editing Modal */}
        <EditingModal
          isOpen={editMode}
          onClose={handleCloseEditModal}
          currentSlide={carousel?.slides[editingSlideIndex] || carousel?.slides[0]}
          slides={carousel?.slides || []}
          headingFont={headingFont}
          bodyFont={bodyFont}
          editingHeadline={editingHeadline}
          editingBody={editingBody}
          onHeadlineChange={setEditingHeadline}
          onBodyChange={setEditingBody}
          onFontChange={handleFontChange}
          onSave={handleSaveSlideEdit}
          selectedFormat={selectedFormat}
        />

        {/* Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>✏️ Edit Slide</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Customize text, fonts, and more in real-time with live preview</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>🔄 Tone</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Adjust tone or prompt and regenerate carousel instantly</p>
          </div>
          <div className={`${theme.colors.bg.secondary} border ${theme.colors.border} rounded-xl p-6 text-center hover:border-opacity-100 transition-colors duration-300 ${isDark ? 'hover:border-slate-700' : 'hover:border-gray-400'}`}>
            <h3 className={`font-semibold mb-2 text-lg ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>📥 Download</h3>
            <p className={`${theme.colors.text.tertiary} text-sm`}>Export as PNG, PDF, or PowerPoint for any use case</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
