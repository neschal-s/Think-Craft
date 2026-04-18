import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

async function testCarouselGeneration(prompt, slideCount) {
  console.log(`\n--- Testing API with slideCount: ${slideCount} ---`);
  try {
    const response = await api.post('/generate/carousel-structure', {
      prompt,
      tone: 'professional',
      format: '1:1',
      slideCount: slideCount
    });
    
    const slides = response.data.slides;
    console.log(`📤 Sent: slideCount=${slideCount}`);
    console.log(`📥 Received: ${slides.length} slides`);
    console.log(`✅ Match: ${slides.length === slideCount}`);
    
    if (slides.length !== slideCount) {
      console.log(`\n❌ MISMATCH!`);
      console.log('Expected:', slideCount);
      console.log('Got:', slides.length);
      console.log('Slides:', slides.map((s, idx) => `${idx + 1}. ${s.headline}`));
    } else {
      console.log('✅ Correct slide count returned');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Response:', error.response.data);
    }
  }
}

console.log('🧪 Testing API carousel generation...');
console.log('Make sure the backend is running on http://localhost:5000\n');

const testCases = [1, 2, 3, 5, 8];

for (const slideCount of testCases) {
  await testCarouselGeneration('Artificial Intelligence in 2024', slideCount);
  // Add delay between requests
  await new Promise(r => setTimeout(r, 1000));
}

console.log('\n========== API Test Complete ==========\n');
