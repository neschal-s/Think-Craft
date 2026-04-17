import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselViewer from '../components/CarouselViewer';
import FormatSelector from '../components/FormatSelector';

const ViewerPage = () => {
  const navigate = useNavigate();
  const [carousel, setCarousel] = useState(null);
  const [palette, setPalette] = useState('vibrant');
  const [tone, setTone] = useState('professional');
  const [selectedFormat, setSelectedFormat] = useState('1:1');
  const [formatCarousels, setFormatCarousels] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('carousel');
    const savedPalette = localStorage.getItem('palette');
    const savedTone = localStorage.getItem('tone');

    if (!saved) {
      navigate('/');
      return;
    }

    const parsedCarousel = JSON.parse(saved);
    setCarousel(parsedCarousel);
    setPalette(savedPalette || 'vibrant');
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your carousel...</p>
        </div>
      </div>
    );
  }

  const currentCarousel = formatCarousels[selectedFormat] || carousel;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Carousel is Ready
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-slate-400">
            <span className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm">
              {tone.charAt(0).toUpperCase()}
            </span>
            <p className="text-sm">
              {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone • {selectedFormat} Format
            </p>
          </div>
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
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 shadow-2xl">
            <CarouselViewer
              carousel={currentCarousel}
              palette={palette}
              selectedFormat={selectedFormat}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-semibold transition duration-200 border border-slate-600 flex items-center gap-2"
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
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition duration-200 shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
          >
            <span>📥</span>
            <span>Download Carousel</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl mb-2">✨</p>
            <p className="text-sm text-slate-400">Tip: Edit slides to customize the message</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl mb-2">🔄</p>
            <p className="text-sm text-slate-400">Tip: Switch formats to adapt for different platforms</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-2xl mb-2">📱</p>
            <p className="text-sm text-slate-400">Tip: Use mobile view for best preview</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
