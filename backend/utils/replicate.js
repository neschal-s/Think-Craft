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

    // Use Replicate API to generate image with FLUX or Stable Diffusion
    const response = await axios.post(
      `${REPLICATE_API_URL}/predictions`,
      {
        version: 'e04e9146e17073cd2c2b566745121dac20e16eaffa50d87521529e232bd4c82b', // flux-pro model
        input: {
          prompt: enhancedPrompt,
          aspect_ratio: format === '1:1' ? '1:1' : format === '9:16' ? '9:16' : '16:9',
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
    while (prediction.status === 'processing') {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

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

    if (prediction.status === 'succeeded' && prediction.output && prediction.output.length > 0) {
      return prediction.output[0]; // Return first/only output image URL
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
