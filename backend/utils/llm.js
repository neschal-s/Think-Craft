import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateCarouselStructure = async (prompt, tone, format = '1:1') => {
  const formatInstructions = {
    '1:1': 'Generate a 5-slide carousel for social media (1:1 square ratio).',
    '9:16': 'Generate a 5-slide carousel for social media (9:16 vertical ratio, taller). Adjust text to fit vertical layout.',
    '16:9': 'Generate a 5-slide carousel for social media (16:9 horizontal ratio, wider). Keep text concise for horizontal layout.',
  };

  const message = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
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
  });

  try {
    const content = message.choices[0].message.content.trim();
    // Extract JSON from response (in case model adds extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    
    const slides = JSON.parse(jsonMatch[0]);
    
    return {
      title: `Social Media Carousel - ${tone}`,
      format,
      slides: slides.slice(0, 5), // Ensure max 5 slides
    };
  } catch (error) {
    console.error('LLM parsing error:', error);
    throw new Error('Failed to parse carousel structure from LLM');
  }
};

export const adaptCarouselFormat = async (carouselStructure, targetFormat, tone) => {
  const message = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
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
  });

  try {
    const content = message.choices[0].message.content.trim();
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    
    const slides = JSON.parse(jsonMatch[0]);
    
    return {
      title: carouselStructure.title,
      format: targetFormat,
      slides: slides.slice(0, 5),
    };
  } catch (error) {
    console.error('LLM adaptation error:', error);
    throw new Error('Failed to adapt carousel for new format');
  }
};
