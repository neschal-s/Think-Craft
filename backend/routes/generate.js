import express from 'express';
import { generateCarouselStructure, adaptCarouselFormat } from '../utils/llm.js';
import { generateMultipleImages } from '../utils/replicate.js';
import { generateMockCarouselStructure, generateMockAdaptedStructure } from '../utils/mock.js';

const router = express.Router();

// Check if we should use mock mode
const USE_MOCK = !process.env.OPENROUTER_API_KEY || !process.env.REPLICATE_API_KEY || process.env.MOCK_MODE === 'true';

if (USE_MOCK) {
  console.warn('⚠️  Using MOCK mode - API keys not configured. Set OPENROUTER_API_KEY and REPLICATE_API_KEY to use real APIs.');
} else {
  console.log('✅ Real APIs configured - carousel generation will use OpenRouter + Replicate');
}

// Generate placeholder image URLs
const generatePlaceholderImageUrl = (slideNumber, imagePrompt, format = '1:1') => {
  const dimensions = {
    '1:1': '600x600',
    '9:16': '360x640',
    '16:9': '1280x720',
  };
  const dim = dimensions[format] || dimensions['1:1'];
  return `https://picsum.photos/${dim}?random=${slideNumber}&t=${Date.now()}`;
};

/**
 * POST /api/generate/carousel-structure
 * Generate 5-slide carousel structure for 1:1 format
 */
router.post('/carousel-structure', async (req, res, next) => {
  try {
    const { prompt, tone, format = '1:1' } = req.body;

    if (!prompt || !tone) {
      return res.status(400).json({ error: 'Missing prompt or tone' });
    }

    console.log(`[LLM] Generating carousel structure for prompt: "${prompt}", tone: ${tone}, format: ${format}`);

    let carouselStructure;
    if (USE_MOCK) {
      console.log('[MOCK] Using mock carousel structure');
      carouselStructure = generateMockCarouselStructure(prompt, tone, format);
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500));
    } else {
      carouselStructure = await generateCarouselStructure(prompt, tone, format);
    }

    console.log(`[LLM] Generated ${carouselStructure.slides.length} slides`);

    res.json(carouselStructure);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/generate/images
 * Generate images for each slide in carousel
 */
router.post('/images', async (req, res, next) => {
  try {
    const { carouselStructure } = req.body;

    if (!carouselStructure || !carouselStructure.slides) {
      return res.status(400).json({ error: 'Missing carouselStructure' });
    }

    console.log(`[Replicate] Generating ${carouselStructure.slides.length} images...`);

    let images;
    if (USE_MOCK) {
      console.log('[MOCK] Using placeholder images');
      images = carouselStructure.slides.map((slide) => ({
        slideNumber: slide.slideNumber,
        imageUrl: generatePlaceholderImageUrl(slide.slideNumber, slide.imagePrompt, carouselStructure.format),
      }));
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1500));
    } else {
      images = await generateMultipleImages(carouselStructure);
    }

    console.log(`[Replicate] Generated ${images.length} images`);

    res.json({ images, carouselStructure });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/generate/adapt-format
 * Adapt carousel copy and images for different format
 */
router.post('/adapt-format', async (req, res, next) => {
  try {
    const { carouselStructure, targetFormat, tone } = req.body;

    if (!carouselStructure || !targetFormat || !tone) {
      return res.status(400).json({ error: 'Missing carouselStructure, targetFormat, or tone' });
    }

    console.log(`[LLM] Adapting carousel from ${carouselStructure.format} to ${targetFormat}`);

    let adaptedStructure;
    if (USE_MOCK) {
      console.log('[MOCK] Using mock adapted structure');
      adaptedStructure = generateMockAdaptedStructure(carouselStructure, targetFormat, tone);
      await new Promise(r => setTimeout(r, 500));
    } else {
      adaptedStructure = await adaptCarouselFormat(carouselStructure, targetFormat, tone);
    }

    console.log(`[Replicate] Generating images for ${targetFormat} format...`);

    let images;
    if (USE_MOCK) {
      console.log('[MOCK] Using placeholder images for adapted format');
      images = adaptedStructure.slides.map((slide) => ({
        slideNumber: slide.slideNumber,
        imageUrl: generatePlaceholderImageUrl(slide.slideNumber, slide.imagePrompt, targetFormat),
      }));
      await new Promise(r => setTimeout(r, 1500));
    } else {
      images = await generateMultipleImages(adaptedStructure);
    }

    console.log(`[Replicate] Generated ${images.length} images for ${targetFormat}`);

    res.json({ images, carouselStructure: adaptedStructure });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/generate/regenerate-image
 * Regenerate single slide image
 */
router.post('/regenerate-image', async (req, res, next) => {
  try {
    const { imagePrompt, format = '1:1', slideNumber } = req.body;

    if (!imagePrompt) {
      return res.status(400).json({ error: 'Missing imagePrompt' });
    }

    console.log(`[Replicate] Regenerating image for slide ${slideNumber}...`);

    let imageUrl;
    if (USE_MOCK) {
      console.log('[MOCK] Using placeholder image');
      imageUrl = generatePlaceholderImageUrl(slideNumber, imagePrompt, format);
      await new Promise(r => setTimeout(r, 1000));
    } else {
      const { generateImage } = await import('../utils/replicate.js');
      imageUrl = await generateImage(imagePrompt, format);
    }

    res.json({ slideNumber, imageUrl });
  } catch (error) {
    next(error);
  }
});

export default router;
