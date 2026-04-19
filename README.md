# Think-Craft: AI-Powered Social Media Carousel Generator

🎨 **Transform your ideas into stunning social media carousels in seconds!**

Think-Craft is an intelligent platform that generates professional, visually appealing social media carousels (posts, stories, and more) powered by AI. Simply provide a topic or idea, and our AI engine creates compelling slide content with contextual images and optimized copy for maximum engagement.

---

## 🌟 Features

### 📝 **AI-Powered Content Generation**
- **Smart Carousel Structure**: Uses advanced LLM (OpenRouter - Arcee Trinity model) to generate compelling slide narratives
- **Headline & Body Text**: Automatically creates catchy headlines and descriptive content for each slide
- **Customizable Tone**: Choose from professional, casual, creative, viral, and more
- **Variable Slide Count**: Generate 3-10 slides based on your needs

### 🖼️ **AI-Generated Images**
- **Contextual Image Generation**: Uses Replicate's FLUX.1-dev AI model to generate images matching slide content
- **Smart Fallback System**: Gracefully falls back to stock photo APIs:
  - Unsplash API
  - Pixabay API
  - Picsum.photos
- **Multiple Formats**: 1:1, 9:16, 16:9

### 🎨 **Design & Customization**
- **Multiple Formats**: Square (1:1), Vertical (9:16), Horizontal (16:9)
- **Color Palettes**: Pre-designed palettes or custom color picker
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes

### ✨ **Smart Copy Generation**
- **Hashtag Generator**: Creates trending hashtags for maximum reach
- **Caption Writer**: Multiple styles (catchy, professional, storytelling)
- **Caption Length Options**: Short, medium, or long

### 🎭 **Interactive Features**
- **Typewriter Animation**: Dynamic heading cycling through "Carousels", "Stories", "Posts"
- **Live Preview**: See your carousel being generated in real-time
- **Regenerate Options**: Remake slides with different prompts
- **Format Adaptation**: Convert between aspect ratios
- **Dark/Light Theme Toggle**: Comfortable viewing in any lighting

### 🚀 **Performance & Reliability**
- **Fast Generation**: 30-60 seconds per carousel
- **Intelligent Polling**: Smart async image generation with retry logic
- **Error Handling**: Seamless fallback chains
- **Production-Ready**: Deployed on Render & Vercel

---

## 🛠️ **Tech Stack**

### **Frontend**
- React + Vite (lightning-fast)
- Tailwind CSS (utility-first styling)
- React Router (client-side routing)
- Axios (HTTP client)
- Orbitron Font (futuristic design)

### **Backend**
- Node.js + Express (fast, scalable)
- Dotenv (environment management)
- Axios (external API calls)

### **AI & APIs**
- OpenRouter (Arcee Trinity LLM)
- Replicate (FLUX.1-dev image model)
- Unsplash API (stock photos)
- Pixabay API (stock photos)
- Picsum.photos (placeholder images)

### **Deployment**
- Vercel (Frontend hosting)
- Render (Backend hosting)
- GitHub (Version control)

---

## 📋 **Key API Endpoints**
