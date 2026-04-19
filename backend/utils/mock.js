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
        `${topic} isn't just theory—it's a proven framework for success. Here's what really works and why it matters for your goals.`,
        `Understanding the "why" behind ${topic} changes everything. Most people miss this crucial insight that separates success from mediocrity.`,
        `The secret to mastering ${topic} is focusing on these core principles and applying them strategically to your unique situation.`,
        `Real results come from implementing ${topic} the right way. Here's exactly how to do it and what to avoid.`,
        `Don't let myths about ${topic} hold you back. Here's the truth that actually matters for getting results.`,
      ];
      return medium[slideIndex % medium.length];
    }
    
    // For 4-5 slides: medium-short text (2 sentences)
    if (totalSlides <= 5) {
      const mediumShort = [
        `${topic} works when you understand this key principle. Apply it consistently and you'll see measurable improvements.`,
        `Most people miss this critical aspect of ${topic}. That's exactly why they don't get the results they expect.`,
        `Here's how to actually apply ${topic} effectively in your daily life. It's simpler than most people think.`,
        `The real secret to ${topic} success is consistency combined with this specific approach. Start implementing it today.`,
        `This one shift in how you approach ${topic} changes everything about your results and outcomes.`,
        `Understanding this principle of ${topic} separates top performers from everyone else. Here's why it works.`,
        `Most experts agree on this core ${topic} strategy because it's proven and reproducible across different scenarios.`,
      ];
      return mediumShort[slideIndex % mediumShort.length];
    }
    
    // For 6-9 slides: balanced text (2 sentences - we have enough slides, so be more detailed)
    if (totalSlides <= 9) {
      const balanced = [
        `The core principle of ${topic} that drives results is understanding this fundamental concept. When you master it, everything else becomes easier.`,
        `This proven ${topic} strategy has helped thousands achieve breakthrough results. The key is implementation consistency and focus.`,
        `Here's the practical way to use ${topic} that actually works in the real world. Stop overthinking and apply this.`,
        `The secret most people miss about ${topic} is this often-overlooked factor. It's what separates success from failure.`,
        `How top performers approach ${topic} is by focusing on these actionable steps. You can start today with immediate results.`,
        `The ${topic} strategy that actually works combines simplicity with strategic thinking. This is exactly how to execute it.`,
        `Transform your ${topic} understanding by grasping this counterintuitive principle. It changes how you see everything.`,
        `Master this ${topic} skill immediately by following these proven steps. The results speak for themselves.`,
        `The ${topic} truth nobody talks about is simpler than the complex theories you've heard. Here's what really matters.`,
      ];
      return balanced[slideIndex % balanced.length];
    }
    
    // For 10-12 slides: detailed text (2-3 sentences - we have plenty of slides)
    const detailed = [
      `The core principle that makes ${topic} work is understanding this foundational concept. When you master this, you unlock exponential results. Most people spend years without grasping this key insight.`,
      `This proven ${topic} strategy has transformed results for thousands of practitioners. The key lies in consistent implementation combined with strategic thinking. Start applying it today to see measurable improvements.`,
      `Here's the practical way to apply ${topic} in real-world situations with immediate impact. It's based on proven methodologies that work across industries. The competitive advantage comes from doing this consistently.`,
      `The secret most people miss about ${topic} is this often-overlooked factor that changes everything. Understanding this principle separates success from stagnation. This is where real breakthroughs begin.`,
      `How top performers approach ${topic} is by focusing on actionable steps that deliver results. You can implement this framework immediately. The outcome is measurable improvement within weeks.`,
      `The ${topic} strategy that actually works combines elegant simplicity with strategic depth. This is exactly how successful practitioners execute it. The results compound over time with consistent application.`,
      `Transform your ${topic} understanding by grasping this counterintuitive principle. It fundamentally changes how you approach challenges. This insight alone can reshape your entire perspective.`,
      `Master this essential ${topic} skill immediately by following these proven, step-by-step instructions. The results are both immediate and long-lasting. This foundation enables all future advancement.`,
      `The ${topic} truth nobody talks about is simpler than the complex theories you've encountered. Here's what really matters for success. Focus here first before exploring advanced concepts.`,
      `Understanding this ${topic} principle at a deep level unlocks sustainable competitive advantage. It's the difference between temporary results and lasting success. This is where champions differentiate themselves.`,
      `The advanced ${topic} approach that separates experts from novices starts with mastering this concept. Apply this framework systematically for exponential growth. This is the foundation of all breakthrough performance.`,
      `Building lasting ${topic} expertise requires understanding this fundamental principle that underpins everything else. When internalized deeply, it becomes your competitive edge. This knowledge compounds valuable results over time.`,
    ];
    return detailed[slideIndex % detailed.length];
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
