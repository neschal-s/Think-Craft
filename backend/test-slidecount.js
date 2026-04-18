import { generateMockCarouselStructure } from './utils/mock.js';

console.log('Testing mock carousel generation with different slide counts...\n');

const testCases = [1, 2, 3, 5, 8, 12];
const prompt = 'Artificial Intelligence';
const tone = 'professional';
const format = '1:1';

testCases.forEach(slideCount => {
  console.log(`\n--- Testing slideCount: ${slideCount} ---`);
  const result = generateMockCarouselStructure(prompt, tone, format, slideCount);
  console.log(`Expected: ${slideCount} slides`);
  console.log(`Got: ${result.slides.length} slides`);
  console.log(`Match: ${result.slides.length === slideCount ? '✅ YES' : '❌ NO'}`);
  
  if (result.slides.length !== slideCount) {
    console.log(`\n⚠️  MISMATCH DETECTED!`);
    console.log('Slides returned:', result.slides.map(s => `${s.slideNumber}: ${s.headline}`));
  }
});

console.log('\n\n========== Test Complete ==========\n');
