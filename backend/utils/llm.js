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
        return 'Headline: 6-10 words max\nBody: 2-3 sentences, concise but impactful';
      } else if (count <= 5) {
        return 'Headline: 5-8 words max\nBody: 1-2 sentences ONLY, keep it punchy';
      } else {
        return 'Headline: 4-6 words max\nBody: 1 sentence ONLY, ultra-concise and clear';
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

For the slide, provide EXACTLY this JSON structure (no markdown):
${jsonExample}`
            : `Create a TIGHT, PUNCHY ${numSlides}-slide carousel about: "${prompt}"

Tone: ${tone}
Format: ${format} aspect ratio

TEXT LENGTH GUIDELINES (STRICT):
${getTextLengthGuidelines(numSlides)}

CRITICAL RULES:
1. Headlines MUST be short and punchy - curiosity-driven, not descriptive
2. Body text MUST match the length guidelines above - NO EXCEPTIONS
3. Each slide stands alone but builds on the previous one
4. Use ${tone} tone throughout
5. Make readers want to swipe to the next slide

For each slide, provide EXACTLY this JSON structure (no markdown):
${jsonExample}

NARRATIVE STRUCTURE (Follow this arc):
${narrativeArc.join('\n')}

EXAMPLES OF GOOD VS BAD:
❌ WRONG: "Headline: Introduction to Productivity Tips for Remote Workers | Body: Productivity is important in today's fast-paced world. Remote work has become increasingly popular..."
✅ RIGHT: "Headline: The Remote Worker's Secret | Body: Most remote workers lose 2 hours daily. Here's how to reclaim them."

Remember: Tight, punchy, engaging. No fluff. Only JSON response.`,
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
