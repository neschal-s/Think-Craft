import axios from 'axios';
import { generateMockCarouselStructure, generateMockAdaptedStructure } from './mock.js';

// Use OpenRouter API with arcee-ai/trinity-large-preview:free model
export const generateCarouselStructure = async (prompt, tone, format = '1:1') => {
  const formatInstructions = {
    '1:1': 'Generate a 5-slide carousel for social media (1:1 square ratio).',
    '9:16': 'Generate a 5-slide carousel for social media (9:16 vertical ratio, taller). Adjust text to fit vertical layout.',
    '16:9': 'Generate a 5-slide carousel for social media (16:9 horizontal ratio, wider). Keep text concise for horizontal layout.',
  };

  try {
    console.log('[LLM] 📡 Calling OpenRouter API with prompt:', prompt.substring(0, 50) + '...');
    console.log('[LLM] Using API Key:', process.env.OPENROUTER_API_KEY ? '✅ Present' : '❌ Missing');
    
    const payload = {
      model: 'arcee-ai/trinity-large-preview:free',
      messages: [
        {
          role: 'system',
          content: `You are a master carousel storyteller. Create 5-slide carousels that are SO ENGAGING users can't help but read from start to finish. Each slide must hook the reader and build on the last. Focus on: compelling headlines, surprising facts, practical value, and emotional connection. You MUST respond with ONLY a valid JSON array, no markdown, no explanations.`,
        },
        {
          role: 'user',
          content: `Create an ENGAGING 5-slide carousel that teaches about: "${prompt}"

Tone: ${tone}
Format: ${format} aspect ratio

CRITICAL: Make each headline irresistible. Make users WANT to read the next slide.

For each slide, provide EXACTLY this JSON structure (no markdown):
[
  {"slideNumber": 1, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 2, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 3, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 4, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 5, "headline": "...", "body": "...", "imagePrompt": "..."}
]

NARRATIVE STRUCTURE (Must follow this arc):
- Slide 1: HOOK - Start with a surprising fact, problem, or "did you know?" about ${prompt}. Make them curious.
- Slide 2: WHY IT MATTERS - Show the real-world impact. Why should they care RIGHT NOW?
- Slide 3: THE INSIGHT - Reveal a key concept or truth about ${prompt} that changes perspective.
- Slide 4: PRACTICAL USE - Show how to actually USE this. Real examples, not theory.
- Slide 5: ACTION - End with an actionable takeaway. What should they do TODAY?

GUIDELINES FOR MAXIMUM ENGAGEMENT:
- Slide 1 headline: Use curiosity gap (e.g., "The ${prompt} Secret Nobody Tells You", "Why You've Been Wrong About ${prompt}")
- Headlines: 5-10 words max, direct, intriguing, promise value
- Body: 2-3 sentences MAX. Short, punchy, conversational. NO JARGON.
- Each slide must end with a reason to read the next one (curiosity or "here's how")
- imagePrompt: Specific, vivid scenes matching ${tone} style and ${format} ratio

Example good headline: "The Hidden Truth About Marketing" (curiosity, promise)
Example bad headline: "Introduction to Marketing Concepts" (boring, generic)

Make it impossible for readers to stop swiping. Go! Remember: only JSON, no markdown.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
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
    
    console.log('[LLM] ✅ Successfully parsed', slides.length, 'slides');
    
    return {
      title: `Educational Carousel - ${tone}`,
      format,
      slides: slides.slice(0, 5),
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
    return generateMockCarouselStructure(prompt, tone, format);
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
