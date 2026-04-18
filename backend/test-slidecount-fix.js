import { generateMockCarouselStructure } from './utils/mock.js';

console.log('Testing slide count fix with different inputs...\n');

const testCases = [
  { slideCount: '1', expected: 1 },
  { slideCount: '2', expected: 2 },
  { slideCount: 1, expected: 1 },
  { slideCount: 2, expected: 2 },
  { slideCount: '3', expected: 3 },
  { slideCount: 5, expected: 5 },
  { slideCount: '12', expected: 12 },
];

testCases.forEach(testCase => {
  const result = generateMockCarouselStructure('Artificial Intelligence', 'professional', '1:1', testCase.slideCount);
  const actual = result.slides.length;
  const status = actual === testCase.expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} | Input: ${testCase.slideCount} (${typeof testCase.slideCount}) | Expected: ${testCase.expected} | Actual: ${actual}`);
});
