import axios from 'axios';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_KEY;
const REPLICATE_API_URL = 'https://api.replicate.com/v1';

export const generateImage = async (imagePrompt, format = '1:1') => {
  try {
    // Add format context to prompt for better image generation
    const formatContext = {
      '1:1': '(square 1:1)',
      '9:16': '(vertical 9:16, tall)',
      '16:9': '(horizontal 16:9, wide)',
    };

    const enhancedPrompt = `${imagePrompt} ${formatContext[format] || ''}, high quality, professional social media post`;

    // Determine image dimensions based on format
    const dimensions = {
      '1:1': { width: 1024, height: 1024 },
      '9:16': { width: 576, height: 1024 },
      '16:9': { width: 1024, height: 576 },
    };

    const dim = dimensions[format] || dimensions['1:1'];

    // Use Replicate API to generate image with Ideogram-v3-turbo
    const response = await axios.post(
      `${REPLICATE_API_URL}/predictions`,
      {
        version: 'c2a5e02d7e1b43dc93f8f82d5e5d0b5f1e8a4c3d', // ideogram-v3-turbo version (update if needed)
        input: {
          prompt: enhancedPrompt,
          width: dim.width,
          height: dim.height,
        },
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let prediction = response.data;

    // Poll for completion (Replicate uses async processing)
    let attempts = 0;
    const maxAttempts = 120; // 2 minutes max

    while (prediction.status === 'processing' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      attempts++;

      const statusResponse = await axios.get(
        `${REPLICATE_API_URL}/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      prediction = statusResponse.data;
    }

    if (prediction.status === 'succeeded' && prediction.output) {
      // Ideogram returns output as a string URL or array
      const imageUrl = typeof prediction.output === 'string' ? prediction.output : prediction.output[0];
      return imageUrl;
    } else {
      throw new Error(`Image generation failed: ${prediction.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Replicate API error:', error.response?.data || error.message);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};

export const generateMultipleImages = async (carouselStructure) => {
  const images = [];

  for (const slide of carouselStructure.slides) {
    console.log(`Generating image for slide ${slide.slideNumber}...`);
    try {
      const imageUrl = await generateImage(slide.imagePrompt, carouselStructure.format);
      images.push({
        slideNumber: slide.slideNumber,
        imageUrl,
      });
    } catch (error) {
      console.error(`Failed to generate image for slide ${slide.slideNumber}:`, error.message);
      // Use placeholder on error
      images.push({
        slideNumber: slide.slideNumber,
        imageUrl: `https://via.placeholder.com/1200x1200?text=Slide+${slide.slideNumber}`,
        error: error.message,
      });
    }
  }

  return images;
};
