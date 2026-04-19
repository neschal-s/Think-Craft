import axios from 'axios';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Generate image using Replicate API (FLUX.1-dev model)
const generateImageWithReplicate = async (imagePrompt) => {
  if (!REPLICATE_API_TOKEN) {
    console.log('[Replicate] Missing API token, skipping');
    return null;
  }

  try {
    console.log(`[Replicate] Generating image with FLUX.1-dev...`);
    console.log(`[Replicate] Prompt: "${imagePrompt.substring(0, 80)}..."`);

    // Create prediction
    const predictionRes = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'fed89ec59e5e2e10e2545161a0d76eab5fce10df6a57b19a246f55b58d569f5f',
        input: {
          prompt: imagePrompt,
          aspect_ratio: '1:1',
          num_outputs: 1,
          output_format: 'jpeg',
        },
      },
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const predictionId = predictionRes.data.id;
    console.log(`[Replicate] Prediction ID: ${predictionId}`);

    // Poll for completion (max 60 seconds)
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      const statusRes = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          },
          timeout: 10000,
        }
      );

      if (statusRes.data.status === 'succeeded') {
        const imageUrl = statusRes.data.output?.[0];
        if (imageUrl) {
          console.log(`[Replicate] ✅ Generated image successfully`);
          return imageUrl;
        }
      } else if (statusRes.data.status === 'failed') {
        console.log(`[Replicate] ❌ Generation failed:`, statusRes.data.error);
        return null;
      }

      // Wait before next poll
      await new Promise(r => setTimeout(r, 2000));
      attempts++;
    }

    console.log('[Replicate] Timeout waiting for image generation');
    return null;
  } catch (error) {
    console.log(`[Replicate] Error:`, error.response?.data?.detail || error.message);
    return null;
  }
};

// Fallback to stock photos
const generateImageWithStockPhoto = async (imagePrompt) => {
  try {
    // Extract keywords from prompt
    let keywords = imagePrompt
      .split(',')[0]
      .replace(/[()]/g, '')
      .split(' ')
      .filter(w => w.length > 3)
      .slice(0, 2)
      .join('%20');
    
    if (!keywords || keywords.length < 3) keywords = 'nature';

    // Try Unsplash API first (most reliable)
    try {
      const unsplashRes = await axios.get(
        `https://api.unsplash.com/search/photos?query=${keywords}&per_page=1&orderBy=relevant&client_id=c7JNiQ92vZ9A8o2W5x3L4p6mK9d1fV8t7`,
        { timeout: 8000 }
      );
      
      if (unsplashRes.data?.results?.[0]?.urls?.regular) {
        console.log(`[Images] ✅ Got image from Unsplash`);
        return unsplashRes.data.results[0].urls.regular;
      }
    } catch (e) {
      console.log(`[Images] Unsplash error:`, e.message);
    }

    // Try Pixabay API as backup
    try {
      const pixabayRes = await axios.get(
        `https://pixabay.com/api/?key=44248314-89ceea87f9be5b55c5bd11c80&q=${keywords}&image_type=photo&per_page=1&safesearch=true`,
        { timeout: 8000 }
      );
      
      if (pixabayRes.data?.hits?.[0]?.largeImageURL) {
        console.log(`[Images] ✅ Got image from Pixabay`);
        return pixabayRes.data.hits[0].largeImageURL;
      }
    } catch (e) {
      console.log(`[Images] Pixabay error:`, e.message);
    }

    return null;
  } catch (error) {
    console.error('[StockPhoto] Error:', error.message);
    return null;
  }
};

export const generateImage = async (imagePrompt, format = '1:1') => {
  try {
    console.log(`[Images] Generating image for: "${imagePrompt.substring(0, 50)}..."`);
    
    // Try Replicate API first for AI-generated relevant images
    if (REPLICATE_API_TOKEN) {
      const replicateImage = await generateImageWithReplicate(imagePrompt);
      if (replicateImage) return replicateImage;
    }

    // Fallback to stock photos (Unsplash/Pixabay)
    const stockPhoto = await generateImageWithStockPhoto(imagePrompt);
    if (stockPhoto) return stockPhoto;

    // Last resort: placeholder with correct format
    const dimensions = {
      '1:1': { w: 800, h: 800 },
      '9:16': { w: 480, h: 864 },
      '16:9': { w: 1280, h: 720 },
    };
    const dim = dimensions[format] || dimensions['1:1'];
    const url = `https://picsum.photos/${dim.w}/${dim.h}?random=${Math.random()}`;
    console.log(`[Images] Using picsum.photos fallback: ${url}`);
    return url;

  } catch (error) {
    console.error('[Images] Error:', error.message);
    return `https://picsum.photos/800/800?random=${Math.random()}`;
  }
};

export const generateMultipleImages = async (carouselStructure) => {
  const images = [];

  for (const slide of carouselStructure.slides) {
    console.log(`[Images] Generating image for slide ${slide.slideNumber}...`);
    try {
      const imageUrl = await generateImage(slide.imagePrompt, carouselStructure.format);
      images.push({
        slideNumber: slide.slideNumber,
        imageUrl,
      });
      // Delay between requests
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error(`[Images] Failed for slide ${slide.slideNumber}:`, error.message);
      images.push({
        slideNumber: slide.slideNumber,
        imageUrl: `https://picsum.photos/800/800?random=${Math.random()}`,
      });
    }
  }

  return images;
};
