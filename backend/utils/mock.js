// Mock LLM responses - generate engaging, prompt-relevant carousel structures
export const generateMockCarouselStructure = (prompt, tone, format = '1:1', slideCount = 5) => {
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

  // Ensure slideCount is between 3 and 12
  const numSlides = Math.max(3, Math.min(12, slideCount));

  // Create narrative structure based on slide count
  const narrativeArcs = {
    3: ['Hook - Start with a surprising fact', 'Why It Matters - Show the impact', 'Action - End with takeaway'],
    4: ['Hook', 'Context', 'Deep Dive', 'Action'],
    5: ['Hook', 'Why It Matters', 'The Insight', 'Practical Use', 'Action'],
    6: ['Hook', 'Problem', 'Solution', 'Benefits', 'Application', 'Action'],
    7: ['Hook', 'Context', 'Problem', 'Solution', 'Benefits', 'Application', 'Action'],
    8: ['Hook', 'Background', 'Problem', 'Solution', 'Strategy 1', 'Strategy 2', 'Application', 'Action'],
    9: ['Hook', 'History', 'Current State', 'Problem', 'Solution', 'Strategy 1', 'Strategy 2', 'Application', 'Action'],
    10: ['Hook', 'Background', 'Current Trend', 'Challenge', 'Solution Overview', 'Deep Dive 1', 'Deep Dive 2', 'Practical Tips', 'Results', 'Action'],
    11: ['Hook', 'History', 'Current State', 'Problem', 'Myth-Busting', 'Solution', 'Strategy 1', 'Strategy 2', 'Real Examples', 'Application', 'Action'],
    12: ['Hook', 'Background', 'History', 'Current Trend', 'Challenge 1', 'Challenge 2', 'Solution', 'Strategy 1', 'Strategy 2', 'Real Examples', 'Application', 'Action'],
  };

  const arc = narrativeArcs[numSlides] || narrativeArcs[5];

  // Generate slides based on narrative arc
  const slideHeadlines = [
    `The ${prompt} Effect You Didn't Know About`,
    `Why ${prompt} Matters (More Than You Think)`,
    `The Hidden Mechanics of ${prompt}`,
    `${prompt} in Real Life: Proven Strategies`,
    `Start Your ${prompt} Journey Today`,
    `The Evolution of ${prompt}`,
    `Why Most People Get ${prompt} Wrong`,
    `The Future of ${prompt}`,
    `${prompt} Success: Real-World Examples`,
    `Advanced ${prompt} Techniques`,
    `Building Your ${prompt} Expertise`,
    `Transform Your Understanding of ${prompt}`,
  ];

  const slideBodies = [
    `Most people misunderstand ${prompt}. You're about to discover what actually works—backed by real-world results and proven methodology.`,
    `${prompt} isn't just a buzzword. It directly impacts your success, efficiency, and results. Here's the surprising truth most people miss.`,
    `Understanding HOW ${prompt} works changes everything. From fundamentals to advanced concepts, we break down what separates experts from amateurs.`,
    `Theory is nice. Results matter. Here are battle-tested strategies and real-world applications that deliver measurable outcomes with ${prompt}.`,
    `Don't stay behind. Master ${prompt} now with actionable steps you can implement immediately. Your transformation starts with one decision.`,
    `The journey of ${prompt} reveals crucial insights about how industries evolve and adapt to modern challenges.`,
    `Common myths about ${prompt} lead people astray. Let's separate fact from fiction with evidence-based analysis.`,
    `What's next for ${prompt}? Emerging trends point to revolutionary changes that will reshape the landscape.`,
    `From startups to Fortune 500s, these companies mastered ${prompt} and achieved remarkable results.`,
    `Take your ${prompt} knowledge to the next level with professional-grade strategies and insider secrets.`,
    `Build unshakeable expertise in ${prompt} by mastering these foundational and advanced principles.`,
    `Change your perspective on ${prompt} and unlock unprecedented opportunities for growth and success.`,
  ];

  const slides = [];
  for (let i = 1; i <= numSlides; i++) {
    const headlineIdx = Math.min(i - 1, slideHeadlines.length - 1);
    const bodyIdx = Math.min(i - 1, slideBodies.length - 1);
    
    slides.push({
      slideNumber: i,
      headline: slideHeadlines[headlineIdx],
      body: slideBodies[bodyIdx],
      imagePrompt: `${arc[i - 1] || 'Compelling visual'} for ${prompt}, ${descriptor} style, for ${format} aspect ratio, high-quality, engaging`,
    });
  }

  return {
    title: `Educational Carousel - ${tone}`,
    format,
    slides: slides,
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
