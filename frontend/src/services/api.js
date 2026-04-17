import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2-minute timeout for long-running image generation
});

export const generateCarouselStructure = (prompt, tone, format = '1:1') =>
  api.post('/generate/carousel-structure', { prompt, tone, format });

export const generateImages = (carouselStructure) =>
  api.post('/generate/images', { carouselStructure });

export const adaptFormat = (carouselStructure, targetFormat, tone) =>
  api.post('/generate/adapt-format', { carouselStructure, targetFormat, tone });

export const regenerateImage = (imagePrompt, format, slideNumber) =>
  api.post('/generate/regenerate-image', { imagePrompt, format, slideNumber });
