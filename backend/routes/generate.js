import express from 'express';
import { generateCarouselStructure, adaptCarouselFormat } from '../utils/llm.js';
import { generateMultipleImages } from '../utils/replicate.js';

const router = express.Router();

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

    const carouselStructure = await generateCarouselStructure(prompt, tone, format);

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

    const images = await generateMultipleImages(carouselStructure);

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

    const adaptedStructure = await adaptCarouselFormat(carouselStructure, targetFormat, tone);

    console.log(`[Replicate] Generating images for ${targetFormat} format...`);

    const images = await generateMultipleImages(adaptedStructure);

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

    const { generateImage } = await import('../utils/replicate.js');
    const imageUrl = await generateImage(imagePrompt, format);

    res.json({ slideNumber, imageUrl });
  } catch (error) {
    next(error);
  }
});

export default router;
