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
          content: `You are an educational carousel expert. Create informative, engaging 5-slide carousels that help users understand topics deeply. Each slide should build on the previous one and teach something valuable. You MUST respond with ONLY a valid JSON array, no markdown, no explanations.`,
        },
        {
          role: 'user',
          content: `Create a 5-slide educational carousel that teaches about: "${prompt}"

Tone: ${tone}
Format: ${format} aspect ratio

Your goal: Help the user understand this topic through a clear learning progression.

For each slide, provide EXACTLY this JSON structure (no markdown):
[
  {"slideNumber": 1, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 2, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 3, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 4, "headline": "...", "body": "...", "imagePrompt": "..."},
  {"slideNumber": 5, "headline": "...", "body": "...", "imagePrompt": "..."}
]

Guidelines:
- Slide 1: Introduction/Definition - What is this topic?
- Slide 2: Context/Why It Matters - Why should people care?
- Slide 3: Key Concepts - What are the main ideas?
- Slide 4: Practical Applications - How is it used in real life?
- Slide 5: Conclusion/Takeaway - What should they remember?

- Headlines: max 50 characters, clear and specific
- Body: 2-3 sentences, informative and easy to understand
- imagePrompt: descriptive scene matching the ${tone} tone and slide topic
- Make content educational and progressively build understanding
- Tone: ${tone}`,
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
