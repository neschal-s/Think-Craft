import axios from 'axios';
import { generateMockCarouselStructure, generateMockAdaptedStructure } from './mock.js';

// Use OpenRouter API with arcee-ai/trinity-large-preview:free model
export const generateCarouselStructure = async (prompt, tone, format = '1:1', slideCount = 5) => {
  // Ensure slideCount is between 1 and 12 - explicitly parse to number
  const numSlides = Math.max(1, Math.min(12, parseInt(slideCount, 10) || 5));
  console.log('[LLM] Received slideCount:', slideCount, 'Type:', typeof slideCount, 'Parsed numSlides:', numSlides);

  const formatInstructions = {
    '1:1': numSlides === 1 
      ? `Generate a SINGLE COMPREHENSIVE slide that teaches the entire topic about "${prompt}". This is the ONLY slide, so include all essential information, key insights, and actionable takeaways on this one slide.`
      : `Generate a ${numSlides}-slide carousel for social media (1:1 square ratio).`,
    '9:16': numSlides === 1
      ? `Generate a SINGLE COMPREHENSIVE slide that teaches the entire topic about "${prompt}". This is the ONLY slide, so include all essential information, key insights, and actionable takeaways. Optimize for 9:16 vertical ratio.`
      : `Generate a ${numSlides}-slide carousel for social media (9:16 vertical ratio, taller). Adjust text to fit vertical layout.`,
    '16:9': numSlides === 1
      ? `Generate a SINGLE COMPREHENSIVE slide that teaches the entire topic about "${prompt}". This is the ONLY slide, so include all essential information, key insights, and actionable takeaways. Optimize for 16:9 horizontal ratio.`
      : `Generate a ${numSlides}-slide carousel for social media (16:9 horizontal ratio, wider). Keep text concise for horizontal layout.`,
  };

  // Generate narrative structure based on slide count
  const narrativeStructures = {
    1: [
      'Slide 1: COMPLETE OVERVIEW - This is your ONLY slide. Include: compelling hook, clear definition of ' + prompt + ', key benefits/insights, real-world impact/examples, and actionable takeaway. Make it comprehensive, valuable, and impossible to ignore.',
    ],
    2: [
      'Slide 1: HOOK - Start with the most important fact about ' + prompt + '. Make them want to keep reading.',
      'Slide 2: ACTION - Practical application and key takeaway. Tell them exactly what to do.',
    ],
    3: [
      'Slide 1: HOOK - Start with a surprising fact or problem. Make them curious.',
      'Slide 2: INSIGHT - Reveal the key truth or solution about ' + prompt + '.',
      'Slide 3: ACTION - End with an actionable takeaway they can use TODAY.',
    ],
    4: [
      'Slide 1: HOOK - Start with curiosity.',
      'Slide 2: CONTEXT - Provide essential background.',
      'Slide 3: SOLUTION - Present the key insight.',
      'Slide 4: ACTION - End with actionable steps.',
    ],
    5: [
      'Slide 1: HOOK - Start with a surprising fact, problem, or "did you know?" about ' + prompt + '. Make them curious.',
      'Slide 2: WHY IT MATTERS - Show the real-world impact. Why should they care RIGHT NOW?',
      'Slide 3: THE INSIGHT - Reveal a key concept or truth about ' + prompt + ' that changes perspective.',
      'Slide 4: PRACTICAL USE - Show how to actually USE this. Real examples, not theory.',
      'Slide 5: ACTION - End with an actionable takeaway. What should they do TODAY?',
    ],
    6: [
      'Slide 1: HOOK - Grab attention with a surprising fact about ' + prompt + '.',
      'Slide 2: PROBLEM - Define the challenge people face.',
      'Slide 3: CONTEXT - Provide critical background.',
      'Slide 4: SOLUTION - Present the answer.',
      'Slide 5: APPLICATION - Show real-world examples.',
      'Slide 6: ACTION - End with clear next steps.',
    ],
    7: [
      'Slide 1: HOOK - Open with intrigue.',
      'Slide 2: BACKGROUND - Set the stage.',
      'Slide 3: PROBLEM - Identify the challenge.',
      'Slide 4: WHY - Explain the cause.',
      'Slide 5: SOLUTION - Present the answer.',
      'Slide 6: APPLICATION - Show practical use.',
      'Slide 7: ACTION - Call to action.',
    ],
    8: [
      'Slide 1: HOOK - Grab attention immediately.',
      'Slide 2: BACKGROUND - Essential context.',
      'Slide 3: PROBLEM - Define the challenge.',
      'Slide 4: ANALYSIS - Deep dive explanation.',
      'Slide 5: SOLUTION - Present the approach.',
      'Slide 6: STRATEGY 1 - First actionable strategy.',
      'Slide 7: STRATEGY 2 - Second actionable strategy.',
      'Slide 8: ACTION - Next steps.',
    ],
    9: [
      'Slide 1: HOOK - Start strong.',
      'Slide 2: HISTORY - Evolution and background.',
      'Slide 3: CURRENT STATE - Where we are now.',
      'Slide 4: CHALLENGE - Define the problem.',
      'Slide 5: ROOT CAUSE - Why it happens.',
      'Slide 6: SOLUTION - The answer.',
      'Slide 7: STRATEGY 1 - Implementation tactic.',
      'Slide 8: STRATEGY 2 - Additional tactic.',
      'Slide 9: ACTION - What to do next.',
    ],
    10: [
      'Slide 1: HOOK - Attention-grabbing opening.',
      'Slide 2: BACKGROUND - Historical context.',
      'Slide 3: CURRENT TREND - What is happening now.',
      'Slide 4: CHALLENGE - The obstacle.',
      'Slide 5: MYTH BUSTING - Reveal common misconceptions.',
      'Slide 6: SOLUTION OVERVIEW - The path forward.',
      'Slide 7: DEEP DIVE 1 - First detailed explanation.',
      'Slide 8: DEEP DIVE 2 - Second detailed explanation.',
      'Slide 9: REAL EXAMPLES - Proof in action.',
      'Slide 10: ACTION - Final call to action.',
    ],
    11: [
      'Slide 1: HOOK - Compelling opening.',
      'Slide 2: HISTORY - Origin and evolution.',
      'Slide 3: CURRENT STATE - Today\'s landscape.',
      'Slide 4: CHALLENGE - The core problem.',
      'Slide 5: MYTH BUSTING - Debunk misconceptions.',
      'Slide 6: ROOT CAUSE - Why it matters.',
      'Slide 7: SOLUTION - The approach.',
      'Slide 8: STRATEGY 1 - First tactic.',
      'Slide 9: STRATEGY 2 - Second tactic.',
      'Slide 10: REAL EXAMPLES - Success stories.',
      'Slide 11: ACTION - What you can do.',
    ],
    12: [
      'Slide 1: HOOK - Open with impact.',
      'Slide 2: BACKGROUND - Essential context.',
      'Slide 3: HISTORY - How it evolved.',
      'Slide 4: CURRENT TREND - State of the industry.',
      'Slide 5: CHALLENGE 1 - First major obstacle.',
      'Slide 6: CHALLENGE 2 - Second major obstacle.',
      'Slide 7: SOLUTION INTRO - Overview of answer.',
      'Slide 8: STRATEGY 1 - Detailed tactic.',
      'Slide 9: STRATEGY 2 - Alternative tactic.',
      'Slide 10: STRATEGY 3 - Third approach.',
      'Slide 11: REAL EXAMPLES - Proof points.',
      'Slide 12: ACTION - Next steps.',
    ],
  };

  const narrativeArc = narrativeStructures[numSlides] || narrativeStructures[numSlides <= 3 ? 3 : 5];

  try {
    console.log('[LLM] 📡 Calling OpenRouter API with prompt:', prompt.substring(0, 50) + '...');
    console.log('[LLM] Generating', numSlides, 'slides');
    console.log('[LLM] Using API Key:', process.env.OPENROUTER_API_KEY ? '✅ Present' : '❌ Missing');
    
    // Build JSON example for correct slide count
    let jsonExample = '[';
    for (let i = 1; i <= numSlides; i++) {
      if (i > 1) jsonExample += ',';
      jsonExample += `\n  {"slideNumber": ${i}, "headline": "...", "body": "...", "imagePrompt": "..."}`;
    }
    jsonExample += '\n]';

    // Define text length based on slide count
    const getTextLengthGuidelines = (count) => {
      if (count === 1) {
        return 'Headline: 8-12 words max\nBody: 4-5 sentences, comprehensive and detailed';
      } else if (count === 2) {
        return 'Headline: 6-10 words max\nBody: 2-3 sentences, well-developed and impactful';
      } else if (count === 3) {
        return 'Headline: 6-8 words max\nBody: 2-3 sentences, balanced detail';
      } else if (count <= 6) {
        return 'Headline: 5-8 words max\nBody: 2 sentences, punchy but informative';
      } else if (count <= 9) {
        return 'Headline: 5-8 words max\nBody: 2 sentences, clear and focused';
      } else {
        return 'Headline: 5-8 words max\nBody: 2-3 sentences, detailed and engaging (longer carousels have room for depth)';
      }
    };

    const payload = {
      model: 'arcee-ai/trinity-large-preview:free',
      messages: [
        {
          role: 'system',
          content: numSlides === 1
            ? `You are an expert content strategist. Create a SINGLE, COMPREHENSIVE, and DEEPLY INFORMATIVE slide that teaches users EVERYTHING about the topic. This is the ONLY slide, so it must be packed with value: definition, key insights, benefits, real-world examples, and actionable takeaways. Make it impossible for users to ignore. You MUST respond with ONLY a valid JSON array with 1 slide object, no markdown, no explanations.`
            : `You are a master carousel storyteller creating a ${numSlides}-slide carousel. Each slide must be SHORT, IMPACTFUL, and leave the user wanting to see the next one. CRITICAL: Keep text extremely concise - headlines are 4-10 words max, body text is 1-3 sentences max depending on slide count. You MUST respond with ONLY a valid JSON array, no markdown, no explanations.`,
        },
        {
          role: 'user',
          content: numSlides === 1
            ? `Create a SINGLE, COMPREHENSIVE slide that teaches about: "${prompt}"

Tone: ${tone}
Format: ${format} aspect ratio

TEXT LENGTH GUIDELINES:
Headline: 8-12 words max
Body: 4-5 sentences, comprehensive and detailed

Requirements:
- Compelling headline that captures the essence
- Body text covering: definition, key benefits, real-world impact, and actionable insight
- Make it impossible to ignore - this slide must deliver complete understanding
- Use ${tone} tone
- Write in an engaging, conversational style

For the slide, provide EXACTLY this JSON structure (no markdown):
${jsonExample}`
            : `Create an ENGAGING, DETAILED ${numSlides}-slide carousel about: "${prompt}"

Tone: ${tone}
Format: ${format} aspect ratio

TEXT LENGTH GUIDELINES (STRICT):
${getTextLengthGuidelines(numSlides)}

KEY PRINCIPLES:
1. MORE SLIDES = MORE ROOM FOR DEPTH AND EXAMPLES
   - With ${numSlides} slides, we can explore the topic thoroughly
   - Don't make it too sparse - use the space available
   - Include specific examples, data points, and actionable insights
   - Balance between being punchy AND being informative

2. Headlines MUST be short and punchy
   - Use curiosity, questions, or surprising statements
   - Make readers want to read the body text
   - Examples: "The 72-Hour Window", "Why Most People Get This Wrong", "The Hidden Cost"

3. Body text is your chance to deliver VALUE
   - Be specific with examples and real-world applications
   - Use numbers, statistics, or concrete details when possible
   - Make each point memorable and actionable
   - Don't waste space with generic statements

4. Each slide should feel complete but build toward a conclusion
5. Use ${tone} tone - keep it conversational and engaging
6. Make readers want to swipe to the next slide BECAUSE they're learning something valuable

NARRATIVE STRUCTURE (Follow this arc for natural flow):
${narrativeArc.join('\n')}

CONTENT QUALITY EXAMPLES:
❌ WEAK: "Headline: Sleep Tips | Body: Sleep is important. Getting more sleep helps you be productive."
✅ STRONG: "Headline: The 72-Hour Sleep Rule | Body: Research shows that staying consistent with sleep schedules boosts productivity by 40%. Even 7 hours at the same time daily outperforms 8 random hours."

❌ WEAK: "Headline: Remote Work Benefits | Body: Remote work is flexible. You can work from anywhere."
✅ STRONG: "Headline: Remote Work Truth Bomb | Body: Remote workers save 2-3 hours daily commuting. That's an extra 520 hours per year - enough for a full side project."

For each slide, provide EXACTLY this JSON structure (no markdown, no extra text):
${jsonExample}

Remember: 
- Be SPECIFIC not generic
- Include DATA or EXAMPLES wherever possible
- Make content MEMORABLE
- Write in an ENGAGING, CONVERSATIONAL style
- Deliver clear VALUE in each slide
- Only respond with the JSON array, nothing else`,
        },
      ],
      temperature: 0.7,
      max_tokens: 3500,
    };

    console.log('[LLM] Sending request to OpenRouter...');
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/neschal-s/Think-Craft',
          'X-OpenRouter-Title': 'ThinkCraft Educational Carousel',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('[LLM] ✅ Got response from OpenRouter');
    const content = response.data.choices[0].message.content.trim();
    console.log('[LLM] Response preview:', content.substring(0, 100));
    
    // Extract JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('[LLM] Could not find JSON array in response:', content.substring(0, 200));
      throw new Error('No JSON array found in response');
    }
    
    const slides = JSON.parse(jsonMatch[0]);
    
    console.log('[LLM] ✅ Successfully parsed', slides.length, 'slides from response');
    console.log('[LLM] numSlides requested:', numSlides, 'slides parsed:', slides.length);
    
    const finalSlides = slides.slice(0, numSlides);
    console.log('[LLM] After slice - finalSlides count:', finalSlides.length);
    
    return {
      title: `Educational Carousel - ${tone}`,
      format,
      slides: finalSlides,
    };
  } catch (error) {
    console.error('[LLM] ❌ ERROR:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data?.error || error.response?.data,
      message: error.message,
      code: error.code,
    });
    console.warn('[LLM] Falling back to mock mode...');
    // Fallback to mock data if OpenRouter fails
    return generateMockCarouselStructure(prompt, tone, format, numSlides);
  }
};

// Regenerate text for a single slide
export const generateSlideText = async (slidePrompt, tone, currentSlide) => {
  try {
    console.log('[LLM] 📡 Regenerating slide text with prompt:', slidePrompt.substring(0, 50) + '...');

    const payload = {
      model: 'arcee-ai/trinity-large-preview:free',
      messages: [
        {
          role: 'system',
          content: `You are a master copywriter. Regenerate carousel slide content to be ENGAGING and compelling.`,
        },
        {
          role: 'user',
          content: `Regenerate the headline and body text for this carousel slide.

Topic: "${slidePrompt}"
Tone: ${tone}

Current slide data:
Headline: "${currentSlide.headline}"
Body: "${currentSlide.body}"

Create NEW, fresh, engaging content. Respond with ONLY a valid JSON object, no markdown:
{"headline": "...", "body": "..."}

Guidelines:
- Headline: 5-10 words max, compelling, intriguing
- Body: 2-3 sentences max, conversational, punchy
- Tone should be ${tone}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    };

    console.log('[LLM] Sending slide text regeneration request to OpenRouter...');
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/neschal-s/Think-Craft',
          'X-OpenRouter-Title': 'ThinkCraft Slide Regeneration',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }

    const regeneratedText = JSON.parse(jsonMatch[0]);
    
    return {
      ...currentSlide,
      headline: regeneratedText.headline,
      body: regeneratedText.body,
    };
  } catch (error) {
    console.error('[LLM] ❌ ERROR regenerating slide text:', error.message);
    // Fallback: return current slide with "regenerated" marker
    return {
      ...currentSlide,
      headline: `${currentSlide.headline} (Regenerated)`,
      body: currentSlide.body + ' [Content regenerated]',
    };
  }
};

export const adaptCarouselFormat = async (carouselStructure, targetFormat, tone) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          {
            role: 'system',
            content: `You are an educational carousel expert. Adapt educational carousels for different formats while maintaining the learning narrative. Return ONLY valid JSON, no markdown.`,
          },
          {
            role: 'user',
            content: `Adapt this carousel for ${targetFormat} format:
        
Original carousel:
${JSON.stringify(carouselStructure.slides, null, 2)}

For ${targetFormat}:
- 9:16 is VERTICAL (tall): more text space, can be longer with more details
- 16:9 is HORIZONTAL (wide): less text, more concise but still educational

Rewrite copy for the target format. Keep the learning narrative flow intact. Keep tone: ${tone}
Update imagePrompts to mention "${targetFormat} aspect ratio" and "${tone} style".

Return ONLY JSON array with 5 slides: [{slideNumber: 1, headline: "...", body: "...", imagePrompt: "..."}, ...]`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/neschal-s/Think-Craft',
          'X-OpenRouter-Title': 'ThinkCraft Educational Carousel',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    
    const slides = JSON.parse(jsonMatch[0]);
    
    return {
      title: carouselStructure.title,
      format: targetFormat,
      slides: slides.slice(0, 5),
    };
  } catch (error) {
    console.error('[LLM] Adaptation error:', error.response?.status, error.response?.data || error.message);
    console.warn('[LLM] Falling back to mock mode...');
    // Fallback to mock data if OpenRouter fails
    return generateMockAdaptedStructure(carouselStructure, targetFormat, tone);
  }
};

/**
 * Generate 10 relevant hashtags based on carousel content
 */
export const generateHashtags = async (prompt, carouselContent) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          {
            role: 'system',
            content: `You are a social media expert. Generate 10 highly relevant, trending hashtags that will maximize reach and engagement for educational content. Return ONLY a JSON array of strings, no markdown.`,
          },
          {
            role: 'user',
            content: `Generate 10 relevant hashtags for this social media carousel about: "${prompt}"
            
Carousel content: ${carouselContent}

Requirements:
- Mix of popular and niche hashtags
- Relevant to the topic and audience
- Trending or evergreen (not outdated)
- No duplicates
- Include 2-3 branded hashtag ideas

Return ONLY a JSON array: ["#hashtag1", "#hashtag2", ...]`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/neschal-s/Think-Craft',
          'X-OpenRouter-Title': 'ThinkCraft Hashtag Generator',
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    
    const hashtags = JSON.parse(jsonMatch[0]);
    return hashtags.slice(0, 10); // Ensure exactly 10 hashtags
  } catch (error) {
    console.error('[LLM] Hashtags error:', error.response?.status, error.response?.data || error.message);
    // Fallback hashtags
    return [
      '#SocialMedia',
      '#ContentCreation',
      '#Education',
      '#Marketing',
      '#Engagement',
      '#DigitalMarketing',
      '#SocialMediaTips',
      '#ContentStrategy',
      '#OnlineLearning',
      '#GrowthHacking'
    ];
  }
};

/**
 * Generate captions for carousel content with specified style and length
 */
export const generateCaptions = async (prompt, carouselContent, style = 'catchy', length = 'medium') => {
  try {
    const lengthGuide = {
      short: '20-50 words - concise and punchy',
      medium: '50-100 words - balanced and engaging',
      long: '100-150 words - detailed and comprehensive'
    };

    const styleGuide = {
      catchy: 'Use attention-grabbing hooks, emojis strategically, and call-to-action. Make it irresistible.',
      detailed: 'Provide context and value. Explain the "why" and "how". Educational and informative.',
      funny: 'Use humor, witty wordplay, and entertaining tone. Make people smile while learning.'
    };

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'arcee-ai/trinity-large-preview:free',
        messages: [
          {
            role: 'system',
            content: `You are a professional copywriter specializing in social media captions. Write compelling captions that drive engagement, clicks, and shares. Return ONLY a JSON array with 2 caption strings, no markdown.`,
          },
          {
            role: 'user',
            content: `Write 2 different social media captions for this carousel about: "${prompt}"

Carousel content summary: ${carouselContent?.substring(0, 300) || prompt}

Style: ${styleGuide[style] || styleGuide.catchy}
Length: ${lengthGuide[length] || lengthGuide.medium}

Requirements:
- Caption should make people want to save and share
- Include call-to-action (ask question, encourage share, etc)
- Appropriate for LinkedIn, Instagram, or Twitter
- Each caption should be distinct and unique

Return ONLY a JSON array with 2 captions: ["Caption 1 here...", "Caption 2 here..."]`,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/neschal-s/Think-Craft',
          'X-OpenRouter-Title': 'ThinkCraft Caption Generator',
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    
    const captions = JSON.parse(jsonMatch[0]);
    return captions.slice(0, 2); // Return exactly 2 captions
  } catch (error) {
    console.error('[LLM] Captions error:', error.response?.status, error.response?.data || error.message);
    // Fallback captions
    return [
      `Discover the power of ${prompt}! This game-changing approach will transform how you think about success. Don't miss out on this incredible opportunity. What's your biggest takeaway? 👇`,
      `Everything you need to know about ${prompt} is in this carousel. Save this for later and share with your network. Your success starts here! 🚀 What question do you have?`
    ];
  }
};
