// Mock LLM responses - generate engaging, prompt-relevant carousel structures
export const generateMockCarouselStructure = (prompt, tone, format = '1:1') => {
  // Create compelling, narrative-driven carousel content based on user prompt
  const toneDescriptor = {
    professional: 'professional, expert-level, business-focused',
    casual: 'friendly, conversational, relatable, easy-to-understand',
    creative: 'creative, artistic, inspiring, thought-provoking',
    informative: 'informative, educational, clear, progressive learning',
  };

  const toneKey = tone.toLowerCase() === 'professional' ? 'professional' 
                : tone.toLowerCase() === 'casual' ? 'casual' 
                : tone.toLowerCase() === 'creative' ? 'creative'
                : 'informative';

  const descriptor = toneDescriptor[toneKey] || toneDescriptor.informative;

  // Create a compelling narrative arc: Hook → Context → Deep Dive → Application → Action
  const slides = [
    {
      slideNumber: 1,
      headline: `The ${prompt} Effect You Didn't Know About`,
      body: `Most people misunderstand ${prompt}. You're about to discover what actually works—backed by real-world results and proven methodology.`,
      imagePrompt: `Compelling visual introduction to ${prompt}, ${descriptor} style, attention-grabbing, for ${format}`,
    },
    {
      slideNumber: 2,
      headline: `Why ${prompt} Matters (More Than You Think)`,
      body: `${prompt} isn't just a buzzword. It directly impacts your success, efficiency, and results. Here's the surprising truth most people miss.`,
      imagePrompt: `Impact visualization showing ${prompt} benefits, ${descriptor} design, compelling data or scene`,
    },
    {
      slideNumber: 3,
      headline: `The Hidden Mechanics of ${prompt}`,
      body: `Understanding HOW ${prompt} works changes everything. From fundamentals to advanced concepts, we break down what separates experts from amateurs.`,
      imagePrompt: `Deep dive explanation: ${prompt} mechanics, ${descriptor} educational illustration, clear and detailed`,
    },
    {
      slideNumber: 4,
      headline: `${prompt} in Real Life: Proven Strategies`,
      body: `Theory is nice. Results matter. Here are battle-tested strategies and real-world applications that deliver measurable outcomes with ${prompt}.`,
      imagePrompt: `Real-world application: ${prompt} in action, ${descriptor} practical example, success scenario`,
    },
    {
      slideNumber: 5,
      headline: `Start Your ${prompt} Journey Today`,
      body: `Don't stay behind. Master ${prompt} now with actionable steps you can implement immediately. Your transformation starts with one decision.`,
      imagePrompt: `Empowering call-to-action: ${prompt} mastery, ${descriptor} motivational, future-focused`,
    },
  ];

  return {
    title: `Educational Carousel - ${tone}`,
    format,
    slides: slides.map(slide => ({
      ...slide,
      // Enhance image prompts with format context
      imagePrompt: `${slide.imagePrompt}, ${format} aspect ratio, high-quality, engaging`,
    })),
  };
};

export const generateMockAdaptedStructure = (carouselStructure, targetFormat, tone) => {
  // Keep the same engaging content, just adapt for different format
  return {
    title: carouselStructure.title,
    format: targetFormat,
    slides: carouselStructure.slides.map(slide => ({
      ...slide,
      imagePrompt: `${slide.imagePrompt.split(',')[0]}, optimized for ${targetFormat} aspect ratio`,
    })),
  };
};
