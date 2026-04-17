import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCarouselStructure, generateImages } from '../services/api';

const FormPage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState('vibrant');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const palettes = {
    vibrant: { name: 'Vibrant', bg: '#FF6B6B', text: '#FFF' },
    minimal: { name: 'Minimal', bg: '#F5F5F5', text: '#333' },
    ocean: { name: 'Ocean', bg: '#0284C7', text: '#FFF' },
    sunset: { name: 'Sunset', bg: '#F97316', text: '#FFF' },
    forest: { name: 'Forest', bg: '#16A34A', text: '#FFF' },
  };

  const tones = ['professional', 'casual', 'creative'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Generate carousel structure
      console.log('📝 Generating carousel structure...');
      const structureRes = await generateCarouselStructure(prompt, tone, '1:1');
      const carouselStructure = structureRes.data;

      // Step 2: Generate images
      console.log('🖼️ Generating images...');
      const imagesRes = await generateImages(carouselStructure);

      // Combine structure with images
      const carousel = {
        ...carouselStructure,
        slides: carouselStructure.slides.map((slide, idx) => ({
          ...slide,
          imageUrl: imagesRes.data.images[idx]?.imageUrl,
          imageError: imagesRes.data.images[idx]?.error,
        })),
      };

      // Save to localStorage and navigate
      localStorage.setItem('carousel', JSON.stringify(carousel));
      localStorage.setItem('palette', palette);
      localStorage.setItem('tone', tone);

      console.log('✅ Carousel generated successfully!');
      navigate('/viewer');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate carousel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-primary-900 mb-2 text-center">
          ✨ Carousel Creator
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Turn your idea into a beautiful social media carousel
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Carousel for parents about why kids forget what they learn..."
              className="w-full h-24 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
              disabled={loading}
            />
          </div>

          {/* Palette Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Color Palette
            </label>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(palettes).map(([key, pal]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPalette(key)}
                  className={`w-full h-12 rounded-lg border-2 transition ${
                    palette === key ? 'border-primary-500 scale-105' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: pal.bg }}
                  title={pal.name}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
              disabled={loading}
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating carousel...
              </span>
            ) : (
              'Generate Carousel'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-8">
          🚀 This may take 30-60 seconds. Generating content and images...
        </p>
      </div>
    </div>
  );
};

export default FormPage;
