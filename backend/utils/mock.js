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

  // Ensure slideCount is between 1 and 12 - explicitly parse to number
  const numSlides = Math.max(1, Math.min(12, parseInt(slideCount, 10) || 5));
  console.log('[MOCK] Received slideCount:', slideCount, 'Type:', typeof slideCount, 'Parsed numSlides:', numSlides);

  // Create narrative structure based on slide count
  const narrativeArcs = {
    1: ['Complete Overview - Everything about ' + prompt],
    2: ['Hook - Most important fact', 'Action - Practical takeaway'],
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

  const arc = narrativeArcs[numSlides] || narrativeArcs[numSlides <= 3 ? 3 : 5];

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

  // Generate text bodies based on slide count for intelligent text sizing
  const generateSlideBody = (slideIndex, totalSlides, topic) => {
    // For 1 slide: longer, comprehensive text
    if (totalSlides === 1) {
      const comprehensive = [
        `${topic} is more than just a concept—it's a transformative approach that impacts every aspect of modern life. Understanding its core principles, practical applications, and real-world impact can completely change how you approach challenges and opportunities.`,
        `Most people only scratch the surface of ${topic}. By mastering its fundamentals, advanced strategies, and proven implementation methods, you unlock measurable results and sustainable success in everything you do.`,
        `The true power of ${topic} lies in its versatility and proven track record. From industry leaders to successful entrepreneurs, those who deeply understand and apply its principles consistently achieve exceptional outcomes and sustained growth.`,
      ];
      return comprehensive[slideIndex % comprehensive.length];
    }
    
    // For 2-3 slides: medium text
    if (totalSlides <= 3) {
      const medium = [
        `${topic} isn't just theory—it's a proven framework for success. Here's what really works.`,
        `Understanding the "why" behind ${topic} changes everything. Most people miss this crucial insight.`,
        `The secret to mastering ${topic} is focusing on these core principles and applying them strategically.`,
        `Real results come from implementing ${topic} the right way. Here's exactly how to do it.`,
        `Don't let myths about ${topic} hold you back. Here's the truth that actually matters.`,
      ];
      return medium[slideIndex % medium.length];
    }
    
    // For 4-5 slides: shorter text
    if (totalSlides <= 5) {
      const short = [
        `${topic} works when you understand this key principle.`,
        `Most people miss this critical aspect of ${topic}.`,
        `Here's how to actually apply ${topic} effectively.`,
        `The real secret to ${topic} success is simpler than you think.`,
        `This one shift in how you approach ${topic} changes everything.`,
      ];
      return short[slideIndex % short.length];
    }
    
    // For 6+ slides: ultra-concise text
    const ultraShort = [
      `The core principle that makes ${topic} work.`,
      `Why this matters for ${topic} mastery.`,
      `The practical way to use ${topic} today.`,
      `The secret most people miss about ${topic}.`,
      `How top performers approach ${topic}.`,
      `The ${topic} strategy that actually works.`,
      `Transform your ${topic} understanding right now.`,
      `Master this ${topic} skill immediately.`,
      `The ${topic} truth nobody talks about.`,
      `Your ${topic} breakthrough starts here.`,
      `The ${topic} principle that changes games.`,
      `Why understanding ${topic} matters now.`,
    ];
    return ultraShort[slideIndex % ultraShort.length];
  };

  const slides = [];
  console.log('[MOCK] About to generate slides - numSlides:', numSlides, 'arc.length:', arc.length, 'arc:', arc);
  for (let i = 1; i <= numSlides; i++) {
    const headlineIdx = Math.min(i - 1, slideHeadlines.length - 1);
    
    slides.push({
      slideNumber: i,
      headline: slideHeadlines[headlineIdx],
      body: generateSlideBody(i - 1, numSlides, prompt),
      imagePrompt: `${arc[i - 1] || 'Compelling visual'} for ${prompt}, ${descriptor} style, for ${format} aspect ratio, high-quality, engaging`,
    });
  }
  console.log('[MOCK] Generated', slides.length, 'slides');

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
