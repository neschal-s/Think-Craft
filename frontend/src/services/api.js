import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://think-craft-bn8e.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2-minute timeout for long-running image generation
});

export const generateCarouselStructure = (prompt, tone, format = '1:1', slideCount = 5) =>
  api.post('/generate/carousel-structure', { prompt, tone, format, slideCount });

export const generateImages = (carouselStructure) =>
  api.post('/generate/images', { carouselStructure });

export const regenerateCarouselWithChanges = (prompt, tone, format = '1:1', slideCount = 5) =>
  api.post('/generate/carousel-structure', { prompt, tone, format, slideCount });

export const adaptFormat = (carouselStructure, targetFormat, tone) =>
  api.post('/generate/adapt-format', { carouselStructure, targetFormat, tone });

export const generateHashtags = (prompt, carouselContent) =>
  api.post('/generate/hashtags', { prompt, carouselContent });

export const generateCaptions = (prompt, carouselContent, style = 'catchy', length = 'medium') =>
  api.post('/generate/captions', { prompt, carouselContent, style, length });

export const regenerateImage = (imagePrompt, format, slideNumber) =>
  api.post('/generate/regenerate-image', { imagePrompt, format, slideNumber });
