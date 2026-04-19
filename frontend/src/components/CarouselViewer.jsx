import React, { useState, useImperativeHandle, forwardRef } from 'react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { useTheme } from '../context/ThemeContext';
import { IconButton, PrimaryButton, SuccessButton, WarningButton, DangerButton, CompactButton, FullWidthSuccessButton } from '../styles/ModernButtons';
import { formatFontForCSS, googleFonts } from '../utils/fontLoader';

const CarouselViewer = forwardRef(({ carousel, palette, customColor, selectedFormat, onRegenerateSlide, headingFont, bodyFont }, ref) => {
  const { isDark, theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [editedSlides, setEditedSlides] = useState({});
  const [regenerating, setRegenerating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // Store per-slide fonts and colors
  const [slideStyles, setSlideStyles] = useState({});

  // Default fonts - using per-slide fonts from slideStyles
  const activeHeadingFont = slideStyles[currentSlide]?.headingFont || headingFont || 'Orbitron';
  const activeBodyFont = slideStyles[currentSlide]?.bodyFont || bodyFont || 'Inter';

  const paletteColors = {
    vibrant: { bg: '#FF6B6B', text: '#FFF', secondary: '#FFD93D' },
    minimal: { bg: '#F5F5F5', text: '#333', secondary: '#0284C7' },
    ocean: { bg: '#1e40af', text: '#FFF', secondary: '#3b82f6' },
    emerald: { bg: '#047857', text: '#FFF', secondary: '#10b981' },
    purple: { bg: '#7c3aed', text: '#FFF', secondary: '#a78bfa' },
    coral: { bg: '#dc2626', text: '#FFF', secondary: '#f87171' },
    amber: { bg: '#d97706', text: '#FFF', secondary: '#fbbf24' },
    sunset: { bg: '#F97316', text: '#FFF', secondary: '#FFD700' },
    forest: { bg: '#16A34A', text: '#FFF', secondary: '#FFD700' },
    slate: { bg: '#475569', text: '#FFF', secondary: '#00D9FF' },
    sage: { bg: '#78716C', text: '#FFF', secondary: '#FFD93D' },
    stone: { bg: '#78716C', text: '#FFF', secondary: '#FFD93D' },
    mauve: { bg: '#6B5B7A', text: '#FFF', secondary: '#FFD93D' },
    charcoal: { bg: '#36393F', text: '#FFF', secondary: '#00D9FF' },
  };

  // Helper function to determine if a color is dark or light
  const getContrastingTextColor = (bgColor) => {
    // Remove # if present
    const color = bgColor.replace('#', '');
    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Calculate brightness using luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // Return white for dark backgrounds, black for light backgrounds
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  // Use customColor if provided, otherwise fall back to palette
  const bgColor = customColor || paletteColors[palette]?.bg || paletteColors.vibrant.bg;
  
  // Use customColor directly for text if provided, otherwise use palette text color
  let textColor;
  if (customColor) {
    textColor = getContrastingTextColor(customColor);
  } else {
    textColor = paletteColors[palette]?.text || '#FFF';
  }
  
  const secondaryColor = customColor || paletteColors[palette]?.secondary || '#FFD93D';
  
  // Get color for current slide - Define early to use below
  const getCurrentSlideColor = () => {
    if (slideStyles[currentSlide]?.textColor) {
      return slideStyles[currentSlide].textColor;
    }
    return customColor || paletteColors[palette]?.bg || paletteColors.vibrant.bg;
  };
  
  // Dynamic color for current slide - use directly as text color, not for contrast calculation
  const currentColor = getCurrentSlideColor();
  const currentTextColor = currentColor;  // Use selected color directly as text color
  const currentSecondaryColor = currentColor;
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

  const handleDownloadSlide = async () => {
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
      link.download = `thinkcraft-slide-${currentSlide + 1}-${selectedFormat}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Error downloading slide:', error);
      alert('Failed to download slide. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSlidePDF = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const element = document.getElementById('carousel-container');
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - (2 * margin);
      const availableHeight = pageHeight - (2 * margin);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;

      let finalWidth = availableWidth;
      let finalHeight = availableWidth / ratio;

      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = availableHeight * ratio;
      }

      const xPosition = (pageWidth - finalWidth) / 2;
      const yPosition = margin + (availableHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight);
      pdf.text(`Slide ${currentSlide + 1}`, margin, pageHeight - 5, { fontSize: 10 });
      pdf.save(`thinkcraft-slide-${currentSlide + 1}.pdf`);
    } catch (error) {
      console.error('Error downloading slide PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllPDF = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - (2 * margin);
      const availableHeight = pageHeight - (2 * margin);

      for (let i = 0; i < slides.length; i++) {
        setCurrentSlide(i);
        await new Promise(resolve => setTimeout(resolve, 100));

        const element = document.getElementById('carousel-container');
        const canvas = await html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;

        let finalWidth = availableWidth;
        let finalHeight = availableWidth / ratio;

        if (finalHeight > availableHeight) {
          finalHeight = availableHeight;
          finalWidth = availableHeight * ratio;
        }

        const xPosition = (pageWidth - finalWidth) / 2;
        const yPosition = margin + (availableHeight - finalHeight) / 2;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight);
        pdf.setFontSize(10);
        pdf.setTextColor(120, 120, 120);
        pdf.text(`Slide ${i + 1} of ${slides.length}`, margin, pageHeight - 5);
      }

      pdf.save('thinkcraft-carousel.pdf');
      setCurrentSlide(0);
    } catch (error) {
      console.error('Error downloading all slides PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSlidePPT = async () => {
    setDownloading(true);
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      const prs = new PptxGenJS();
      prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });

      const element = document.getElementById('carousel-container');
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });

      const newSlide = prs.addSlide();
      const imgData = canvas.toDataURL('image/png');
      newSlide.addImage({
        data: imgData,
        x: 0,
        y: 0,
        w: 10,
        h: 7.5,
      });

      newSlide.addText(`${currentSlide + 1}`, {
        x: 0.5,
        y: 7,
        w: 9,
        h: 0.4,
        fontSize: 10,
        color: '999999',
        align: 'right',
      });

      prs.writeFile({ fileName: `thinkcraft-slide-${currentSlide + 1}.pptx` });
    } catch (error) {
      console.error('Error downloading slide PPT:', error);
      alert('Failed to download PowerPoint. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAllPPT = async () => {
    setDownloading(true);
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      const prs = new PptxGenJS();
      prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });

      for (let i = 0; i < slides.length; i++) {
        setCurrentSlide(i);
        await new Promise(resolve => setTimeout(resolve, 100));

        const element = document.getElementById('carousel-container');
        const canvas = await html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          backgroundColor: null,
        });

        const newSlide = prs.addSlide();
        const imgData = canvas.toDataURL('image/png');
        newSlide.addImage({
          data: imgData,
          x: 0,
          y: 0,
          w: 10,
          h: 7.5,
        });

        newSlide.addText(`${i + 1}`, {
          x: 0.5,
          y: 7,
          w: 9,
          h: 0.4,
          fontSize: 10,
          color: '999999',
          align: 'right',
        });
      }

      prs.writeFile({ fileName: 'thinkcraft-carousel.pptx' });
      setCurrentSlide(0);
    } catch (error) {
      console.error('Error downloading all slides PPT:', error);
      alert('Failed to download PowerPoint. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Expose methods and data via ref
  useImperativeHandle(ref, () => ({
    downloadAll: handleDownloadAll,
    downloadSlide: handleDownloadSlide,
    downloadSlidePDF: handleDownloadSlidePDF,
    downloadAllPDF: handleDownloadAllPDF,
    downloadSlidePPT: handleDownloadSlidePPT,
    downloadAllPPT: handleDownloadAllPPT,
    getEditedSlides: () => editedSlides,
    getSlideStyles: () => slideStyles,
    getCurrentSlide: () => currentSlide,
    updateHeadingFont,
    updateBodyFont,
    updateSlideColor,
    getCurrentSlideColor,
    getActiveHeadingFont: () => activeHeadingFont,
    getActiveBodyFont: () => activeBodyFont
  }));

  // Get edited or original slide data
  const getSlideData = (slideIndex) => {
    const edited = editedSlides[slideIndex];
    const original = slides[slideIndex];
    return {
      headline: edited?.headline || original?.headline || '',
      body: edited?.body || original?.body || '',
      imageUrl: edited?.imageUrl || original?.imageUrl || ''
    };
  };

  const currentSlideData = getSlideData(currentSlide);

  // Update edited slide text
  const updateSlideText = (field, value) => {
    setEditedSlides(prev => ({
      ...prev,
      [currentSlide]: {
        ...prev[currentSlide],
        [field]: value
      }
    }));
  };

  // Update slide color
  const updateSlideColor = (color) => {
    setSlideStyles(prev => ({
      ...prev,
      [currentSlide]: {
        ...prev[currentSlide],
        textColor: color
      }
    }));
  };

  // Update slide heading font
  const updateHeadingFont = (font) => {
    setSlideStyles(prev => ({
      ...prev,
      [currentSlide]: {
        ...prev[currentSlide],
        headingFont: font
      }
    }));
  };

  // Update slide body font
  const updateBodyFont = (font) => {
    setSlideStyles(prev => ({
      ...prev,
      [currentSlide]: {
        ...prev[currentSlide],
        bodyFont: font
      }
    }));
  };

  // Regenerate slide content
  const handleRegenerateSlide = async (type) => {
    // type can be 'text', 'image', or 'both'
    if (!onRegenerateSlide) {
      alert('Regeneration not available');
      return;
    }
    
    setRegenerating(true);
    try {
      await onRegenerateSlide(currentSlide, type);
      // Clear edited content for this slide so updated content shows
      if (type === 'text' || type === 'both') {
        setEditedSlides(prev => {
          const updated = { ...prev };
          delete updated[currentSlide];
          return updated;
        });
      }
    } catch (error) {
      console.error('Error regenerating slide:', error);
      alert('Failed to regenerate slide');
    } finally {
      setRegenerating(false);
    }
  };

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
          data-slide-container
          className={`${getContainerClass()} rounded-2xl overflow-hidden relative ${isDark ? 'shadow-2xl' : 'shadow-lg'}`}
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
          <div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10">
            <div className="w-full max-w-xl text-center space-y-4 flex flex-col items-center justify-center">
              {editMode ? (
                <>
                  <textarea
                    value={currentSlideData?.headline || ''}
                    onChange={(e) => updateSlideText('headline', e.target.value)}
                    className="w-full text-2xl font-black leading-tight drop-shadow-lg text-center p-3 rounded bg-black/50 border-2 border-[#0055ff] resize-none"
                    style={{ 
                      color: currentTextColor,
                      fontFamily: formatFontForCSS(activeHeadingFont)
                    }}
                  />
                  <textarea
                    value={currentSlideData?.body || ''}
                    onChange={(e) => updateSlideText('body', e.target.value)}
                    className="w-full text-sm leading-relaxed drop-shadow-md opacity-95 p-3 rounded bg-black/50 border-2 border-[#0055ff] resize-none"
                    style={{ 
                      color: currentTextColor,
                      fontFamily: formatFontForCSS(activeBodyFont)
                    }}
                  />
                </>
              ) : (
                <>
                  <h2
                    className="text-2xl font-black leading-tight drop-shadow-lg w-full text-center tracking-wide"
                    style={{ 
                      color: currentTextColor,
                      fontFamily: formatFontForCSS(activeHeadingFont)
                    }}
                  >
                    {currentSlideData?.headline}
                  </h2>
                  <p
                    className="text-sm leading-relaxed drop-shadow-md opacity-95 w-full text-center font-normal"
                    style={{ 
                      color: currentTextColor,
                      fontFamily: formatFontForCSS(activeBodyFont)
                    }}
                  >
                    {currentSlideData?.body}
                  </p>
                </>
              )}
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
        className={`border ${theme.colors.border} rounded-xl p-6 space-y-6 transition-colors duration-300 ${isDark ? 'bg-slate-900/40' : 'bg-white/70'} backdrop-blur-sm ${isDark ? 'shadow-lg' : 'shadow-md'}`}
      >
        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4">
          <IconButton
            onClick={handlePrev}
            disabled={currentSlide === 0}
            $isDark={isDark}
            title="Previous slide"
          >
            <span className="text-lg">←</span>
          </IconButton>

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

          <IconButton
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            $isDark={isDark}
            title="Next slide"
          >
            <span className="text-lg">→</span>
          </IconButton>
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
          <PrimaryButton
            onClick={handleDownload}
            disabled={downloading}
            $isDark={isDark}
            data-download-btn
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
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
});

CarouselViewer.displayName = 'CarouselViewer';

export default CarouselViewer;
