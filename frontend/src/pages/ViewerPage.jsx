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

    // Initialize with 1:1 format
    setFormatCarousels({ '1:1': parsedCarousel });
  }, [navigate]);

  const handleFormatChange = async (format) => {
    if (formatCarousels[format]) {
      setSelectedFormat(format);
      return;
    }

    // Generate new format
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const currentCarousel = formatCarousels[selectedFormat] || carousel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-2">
            {currentCarousel.title}
          </h1>
          <p className="text-gray-600">
            Format: {selectedFormat} • Tone: {tone}
          </p>
        </div>

        {/* Format Selector */}
        <FormatSelector
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
          loading={loading}
        />

        {/* Carousel Viewer */}
        <div className="mt-8">
          <CarouselViewer
            carousel={currentCarousel}
            palette={palette}
            selectedFormat={selectedFormat}
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            ← Create New
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
