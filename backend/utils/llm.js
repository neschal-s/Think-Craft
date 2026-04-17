import axios from 'axios';
import { generateMockCarouselStructure, generateMockAdaptedStructure } from './mock.js';

// Use OpenRouter API directly instead of OpenAI SDK
export const generateCarouselStructure = async (prompt, tone, format = '1:1') => {
  const formatInstructions = {
    '1:1': 'Generate a 5-slide carousel for social media (1:1 square ratio).',
    '9:16': 'Generate a 5-slide carousel for social media (9:16 vertical ratio, taller). Adjust text to fit vertical layout.',
    '16:9': 'Generate a 5-slide carousel for social media (16:9 horizontal ratio, wider). Keep text concise for horizontal layout.',
  };

  try {
    const response = await axios.post(
      'https://openrouter.io/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a social media content expert. Create engaging carousel posts. Return ONLY valid JSON, no markdown or extra text.`,
          },
          {
            role: 'user',
            content: `${formatInstructions[format] || formatInstructions['1:1']}
        
Each slide needs:
- headline (short, max 50 characters)
- body (2-3 sentences, engaging)
- imagePrompt (descriptive, for AI image generation, include "${tone}" aesthetic)

Topic: "${prompt}"
Tone: ${tone}

Return JSON array with exactly 5 slides. No markdown, no extra text.
[{slideNumber: 1, headline: "...", body: "...", imagePrompt: "..."}, ...]`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-OpenRouter-Title': 'Carousel Creator',
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    
    const slides = JSON.parse(jsonMatch[0]);
    
    return {
      title: `Social Media Carousel - ${tone}`,
      format,
      slides: slides.slice(0, 5),
    };
  } catch (error) {
    console.error('[LLM] Error:', error.response?.status, error.response?.data || error.message);
    console.warn('[LLM] Falling back to mock mode...');
    // Fallback to mock data if OpenRouter fails
    return generateMockCarouselStructure(prompt, tone, format);
  }
};

export const adaptCarouselFormat = async (carouselStructure, targetFormat, tone) => {
  try {
    const response = await axios.post(
      'https://openrouter.io/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a social media content expert. Adapt carousels for different formats while maintaining the narrative. Return ONLY valid JSON, no markdown.`,
          },
          {
            role: 'user',
            content: `Adapt this carousel for ${targetFormat} format:
        
Original carousel:
${JSON.stringify(carouselStructure.slides, null, 2)}

For ${targetFormat}:
- 9:16 is VERTICAL (tall): more text space, can be longer
- 16:9 is HORIZONTAL (wide): less text, more concise

Rewrite copy for the target format. Keep narrative flow intact. Keep tone: ${tone}
Update imagePrompts to mention "${targetFormat} aspect ratio" and "${tone} style".

Return ONLY JSON array with 5 slides: [{slideNumber: 1, headline: "...", body: "...", imagePrompt: "..."}, ...]`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-OpenRouter-Title': 'Carousel Creator',
          'Content-Type': 'application/json',
        },
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
