import express from 'express';
import { generateCarouselStructure, adaptCarouselFormat } from '../utils/llm.js';
import { generateMultipleImages } from '../utils/replicate.js';
import { generateMockCarouselStructure, generateMockAdaptedStructure } from '../utils/mock.js';

const router = express.Router();

// Check if we should use mock mode
const USE_MOCK = !process.env.OPENROUTER_API_KEY || process.env.MOCK_MODE === 'true';

if (USE_MOCK) {
  console.warn('⚠️  Using MOCK mode - API keys not configured. Set OPENROUTER_API_KEY to use real APIs.');
} else {
  console.log('✅ Real APIs configured - carousel generation will use OpenRouter LLM (arcee-ai/trinity-large-preview:free)');
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
 * Generate carousel structure with dynamic slide count
 */
router.post('/carousel-structure', async (req, res, next) => {
  try {
    const { prompt, tone, format = '1:1', slideCount = 5 } = req.body;

    if (!prompt || !tone) {
      return res.status(400).json({ error: 'Missing prompt or tone' });
    }

    const numSlides = Math.max(3, Math.min(12, parseInt(slideCount) || 5));

    console.log(`[LLM] Generating carousel structure for prompt: "${prompt}", tone: ${tone}, format: ${format}, slides: ${numSlides}`);

    let carouselStructure;
    if (USE_MOCK) {
      console.log('[MOCK] 🎭 Using mock carousel structure');
      carouselStructure = generateMockCarouselStructure(prompt, tone, format, numSlides);
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500));
    } else {
      console.log('[LLM] 🤖 Calling OpenRouter LLM...');
      carouselStructure = await generateCarouselStructure(prompt, tone, format, numSlides);
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
      console.log('[ERROR] Missing carouselStructure in request body');
      return res.status(400).json({ error: 'Missing carouselStructure' });
    }

    console.log(`[Images] Generating ${carouselStructure.slides.length} images for format: ${carouselStructure.format}`);

    let images;
    if (USE_MOCK) {
      console.log('[Images] Using placeholder images (MOCK mode)');
      images = carouselStructure.slides.map((slide) => ({
        slideNumber: slide.slideNumber,
        imageUrl: generatePlaceholderImageUrl(slide.slideNumber, slide.imagePrompt, carouselStructure.format),
      }));
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1500));
    } else {
      console.log('[Images] Calling generateMultipleImages...');
      images = await generateMultipleImages(carouselStructure);
    }

    console.log(`[Images] ✅ Generated ${images.length} images`);

    const response = { 
      images, 
      carouselStructure 
    };
    
    console.log('[Images] Sending response...');
    res.json(response);
  } catch (error) {
    console.error('[ERROR] In /images endpoint:', error.message, error.stack);
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

/**
 * POST /api/generate/slide-text
 * Regenerate only text content for a specific slide
 */
router.post('/slide-text', async (req, res, next) => {
  try {
    const { slideIndex, currentSlide, format, tone, prompt } = req.body;

    if (slideIndex === undefined || !currentSlide || !tone || !prompt) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log(`[LLM] Regenerating text for slide ${slideIndex + 1}...`);

    let updatedSlide;
    if (USE_MOCK) {
      console.log('[MOCK] Using mock text regeneration');
      updatedSlide = {
        ...currentSlide,
        slideNumber: slideIndex + 1,
        headline: `${currentSlide.headline} (Regenerated)`,
        body: 'This content has been regenerated.'
      };
      await new Promise(r => setTimeout(r, 800));
    } else {
      const { generateSlideText } = await import('../utils/llm.js');
      updatedSlide = await generateSlideText(prompt, tone, currentSlide);
    }

    res.json({ slides: { [slideIndex]: updatedSlide } });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/generate/slide-image
 * Regenerate only image for a specific slide
 */
router.post('/slide-image', async (req, res, next) => {
  try {
    const { slideIndex, currentSlide, format } = req.body;

    if (slideIndex === undefined || !currentSlide) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log(`[Replicate] Regenerating image for slide ${slideIndex + 1}...`);

    let imageUrl;
    if (USE_MOCK) {
      console.log('[MOCK] Using placeholder image');
      imageUrl = generatePlaceholderImageUrl(slideIndex + 1, currentSlide.imagePrompt, format || '1:1');
      await new Promise(r => setTimeout(r, 1000));
    } else {
      const { generateImage } = await import('../utils/replicate.js');
      imageUrl = await generateImage(currentSlide.imagePrompt, format || '1:1');
    }

    const updatedSlide = { ...currentSlide, imageUrl };
    console.log(`[Replicate] Generated image URL:`, imageUrl.substring(0, 50) + '...');
    res.json({ slides: { [slideIndex]: updatedSlide } });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/generate/slide-full
 * Regenerate both text and image for a specific slide
 */
router.post('/slide-full', async (req, res, next) => {
  try {
    const { slideIndex, currentSlide, format, tone, prompt } = req.body;

    if (slideIndex === undefined || !currentSlide || !tone || !prompt) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log(`[LLM] Regenerating content and image for slide ${slideIndex + 1}...`);

    let updatedSlide;
    if (USE_MOCK) {
      console.log('[MOCK] Using mock full regeneration');
      const imagePrompt = `Regenerated image for slide ${slideIndex + 1}`;
      updatedSlide = {
        ...currentSlide,
        slideNumber: slideIndex + 1,
        headline: `${currentSlide.headline} (Regenerated)`,
        body: 'This is regenerated content for both text and image.',
        imagePrompt: imagePrompt,
        imageUrl: generatePlaceholderImageUrl(slideIndex + 1, imagePrompt, format || '1:1')
      };
      await new Promise(r => setTimeout(r, 1500));
    } else {
      const { generateSlideText } = await import('../utils/llm.js');
      const { generateImage } = await import('../utils/replicate.js');
      
      const newSlide = await generateSlideText(prompt, tone, currentSlide);
      const imageUrl = await generateImage(newSlide.imagePrompt, format || '1:1');
      updatedSlide = { ...newSlide, imageUrl };
    }

    console.log(`[LLM] Successfully regenerated slide ${slideIndex + 1}`);
    res.json({ slides: { [slideIndex]: updatedSlide } });
  } catch (error) {
    next(error);
  }
});

export default router;
