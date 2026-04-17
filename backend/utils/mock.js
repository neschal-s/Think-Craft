// Mock LLM responses - realistic carousel structures
export const mockCarouselStructures = {
  professional: [
    {
      slideNumber: 1,
      headline: "The Forgetting Curve Problem",
      body: "Research shows 50% of new information is forgotten within just 1 hour. Without reinforcement, learning fades rapidly. Understanding this is the first step to better retention.",
      imagePrompt: "Ebbinghaus forgetting curve graph, professional minimalist style, educational illustration",
    },
    {
      slideNumber: 2,
      headline: "How Memory Decay Works",
      body: "The brain prioritizes survival information. Rarely-used knowledge gets pruned to save space. This is why cramming doesn't work for long-term learning.",
      imagePrompt: "Brain neural pathways fading over time, scientific illustration, clean design",
    },
    {
      slideNumber: 3,
      headline: "The Power of Repetition",
      body: "Each time you revisit information, you strengthen neural connections. Spaced repetition leverages this by reviewing at optimal intervals.",
      imagePrompt: "Spaced repetition timeline with review intervals, educational infographic",
    },
    {
      slideNumber: 4,
      headline: "Spaced Repetition Explained",
      body: "Review material right before you forget it. Studies show reviewing after 1 day, 3 days, 1 week, and 1 month creates long-term retention.",
      imagePrompt: "Calendar with review schedule, study planner aesthetic, modern design",
    },
    {
      slideNumber: 5,
      headline: "Help Your Kids Learn Better",
      body: "Use spaced repetition for homework. Review weekly, not nightly. Your kids will retain more and enjoy learning without the stress.",
      imagePrompt: "Happy parent and child studying together, educational, warm aesthetic",
    },
  ],
  casual: [
    {
      slideNumber: 1,
      headline: "Your Kid's Brain is Forgetting Stuff 🧠",
      body: "Plot twist: your kid DOES forget stuff they just learned. It's not laziness—it's science! Half of what they learn today is forgotten by tomorrow.",
      imagePrompt: "Funny illustration of child forgetting, playful cartoon style, colorful",
    },
    {
      slideNumber: 2,
      headline: "Why Cramming = Big Fail ❌",
      body: "Cramming the night before works for ONE night. Then? Gone. Your brain isn't wired to keep stuff it doesn't use. It's like a storage unit you never visit.",
      imagePrompt: "Exhausted student cramming books, humorous illustration, casual style",
    },
    {
      slideNumber: 3,
      headline: "The Forgetting Curve Hack 🎯",
      body: "There's this scientist Ebbinghaus who mapped how fast we forget. Turns out: spacing out reviews = way better than one big cram session.",
      imagePrompt: "Upward trending graph with study breaks, fun infographic, playful colors",
    },
    {
      slideNumber: 4,
      headline: "Space Out Those Reviews 📅",
      body: "Review stuff at the right times: tomorrow, 3 days later, a week later. Your brain locks it in. No torture, just smart studying.",
      imagePrompt: "Calendar with fun stickers and review dates, playful planner aesthetic",
    },
    {
      slideNumber: 5,
      headline: "Try It: Spaced Repetition Works 🚀",
      body: "Next time homework comes home, use spaced review instead of cramming. Watch your kid remember more AND complain less about studying.",
      imagePrompt: "Motivated student with thumbs up, happy and successful, encouraging",
    },
  ],
  creative: [
    {
      slideNumber: 1,
      headline: "Your Brain's Dirty Little Secret",
      body: "Picture this: your child learns something amazing. By tomorrow? 50% gone. By next week? Even more faded. The brain is basically a bad note-taker.",
      imagePrompt: "Surreal illustration of thoughts fading away, artistic, dreamlike",
    },
    {
      slideNumber: 2,
      headline: "The Forgetting Curve: A Love Story Gone Wrong",
      body: "You meet a new fact. You're fascinated! Then... silence. Days pass. The fact doesn't call anymore. It's gone. This is the forgetting curve in action.",
      imagePrompt: "Abstract artistic representation of fading memories, creative watercolor style",
    },
    {
      slideNumber: 3,
      headline: "Enter: The Hero (Spaced Repetition)",
      body: "What if you could rescue those fading memories? What if reviewing at the RIGHT moments could make them stick forever? That's the magic of spacing.",
      imagePrompt: "Artistic representation of memory preservation, hero's journey, creative art",
    },
    {
      slideNumber: 4,
      headline: "The Formula (That's Actually Simple)",
      body: "1 day. 3 days. 1 week. 1 month. Review at these intervals and watch neural pathways light up like a christmas tree. Learning becomes art.",
      imagePrompt: "Beautiful timeline with glowing nodes, artistic visualization, cosmic theme",
    },
    {
      slideNumber: 5,
      headline: "Transform Your Child's Learning",
      body: "Forget traditional homework. Try this method. Watch learning transform from struggle to flow. Your kid becomes the architect of their own brilliance.",
      imagePrompt: "Child surrounded by light and knowledge symbols, inspiring and artistic",
    },
  ],
};

export const generateMockCarouselStructure = (prompt, tone, format = '1:1') => {
  const toneKey = tone.toLowerCase() === 'professional' ? 'professional' 
                : tone.toLowerCase() === 'casual' ? 'casual' 
                : 'creative';

  const slides = mockCarouselStructures[toneKey] || mockCarouselStructures.professional;

  return {
    title: `Social Media Carousel - ${tone}`,
    format,
    slides: slides.map(slide => ({
      ...slide,
      // Add format context to image prompts
      imagePrompt: `${slide.imagePrompt}, for ${format} aspect ratio social media`,
    })),
  };
};

export const generateMockAdaptedStructure = (carouselStructure, targetFormat, tone) => {
  // Adjust copy for format without changing it dramatically
  const adjustedSlides = carouselStructure.slides.map(slide => ({
    ...slide,
    body: targetFormat === '16:9' 
      ? slide.body.substring(0, 100) + '...' // Shorter for wide format
      : targetFormat === '9:16'
      ? slide.body + ' Perfect for vertical viewing.' // Slightly longer for vertical
      : slide.body,
    imagePrompt: `${slide.imagePrompt.split(',')[0]}, optimized for ${targetFormat}`,
  }));

  return {
    title: carouselStructure.title,
    format: targetFormat,
    slides: adjustedSlides,
  };
};
