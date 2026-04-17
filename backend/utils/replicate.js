import axios from 'axios';

export const generateImage = async (imagePrompt, format = '1:1') => {
  try {
    console.log(`[Images] Generating image for: "${imagePrompt.substring(0, 50)}..."`);
    
    // Extract keywords from prompt
    let keywords = imagePrompt
      .split(',')[0]
      .replace(/[()]/g, '')
      .split(' ')
      .filter(w => w.length > 3)
      .slice(0, 2)
      .join('%20');
    
    if (!keywords || keywords.length < 3) keywords = 'business';
    
    // Get image dimensions based on format
    const dimensions = {
      '1:1': { w: '800', h: '800' },
      '9:16': { w: '480', h: '864' },
      '16:9': { w: '1280', h: '720' },
    };
    
    const dim = dimensions[format] || dimensions['1:1'];
    
    // Try multiple free image APIs
    
    // Try Pixabay API (free, no complex auth)
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
    
    // Try Unsplash API (free tier available)
    try {
      const unsplashRes = await axios.get(
        `https://api.unsplash.com/search/photos?query=${keywords}&per_page=1&client_id=c7JNiQ92vZ9A8o2W5x3L4p6mK9d1fV8t7`,
        { timeout: 8000 }
      );
      
      if (unsplashRes.data?.results?.[0]?.urls?.regular) {
        console.log(`[Images] ✅ Got image from Unsplash`);
        return unsplashRes.data.results[0].urls.regular;
      }
    } catch (e) {
      console.log(`[Images] Unsplash error:`, e.message);
    }
    
    // Fallback to picsum.photos (works without auth, always available)
    console.log(`[Images] Using picsum.photos fallback`);
    const randomSeed = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/${dim.w}/${dim.h}?random=${randomSeed}`;
    
  } catch (error) {
    console.error('[Images] Error:', error.message);
    return `https://picsum.photos/800/800?random=${Math.random()}`;
  }
};

export const generateMultipleImages = async (carouselStructure) => {
  const images = [];

  for (const slide of carouselStructure.slides) {
    console.log(`[Unsplash] Generating image for slide ${slide.slideNumber}...`);
    try {
      const imageUrl = await generateImage(slide.imagePrompt, carouselStructure.format);
      images.push({
        slideNumber: slide.slideNumber,
        imageUrl,
      });
      // Small delay between requests to be respectful to API
      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error(`[Unsplash] Failed to generate image for slide ${slide.slideNumber}:`, error.message);
      // Use a nice fallback image
      images.push({
        slideNumber: slide.slideNumber,
        imageUrl: `https://images.unsplash.com/photo-1516321318423-f06f70504c11?w=1200&q=80`,
      });
    }
  }

  return images;
};
