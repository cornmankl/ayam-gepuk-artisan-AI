<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🍗 Ayam Gepuk Artisan AI - Enhanced with AI Orchestra

**Powerful AI-driven image generation for Malaysian/Indonesian food marketing with multi-provider orchestration**

## 🌟 New Features - AI Orchestra System

### ✨ Multi-Provider AI Integration
- **🔵 Google Imagen** - Primary high-quality provider
- **🤗 Hugging Face SDXL** - Free community models
- **⚡ Together AI** - Fast SDXL generation
- **🎨 Stability AI** - Professional-grade outputs
- **🔮 Replicate** - Diverse model selection

### 🧠 Intelligent Features
- **Smart Prompt Enhancement** - AI-powered prompt optimization
- **Automatic Fallback** - Seamless provider switching
- **Rate Limit Management** - Intelligent quota handling
- **Multi-Provider Results** - Compare outputs from different AIs
- **Real-time Status** - Live provider availability tracking

### 🎯 Enhanced Capabilities
- **Professional Food Photography Prompts** - 30+ commercial-ready templates
- **Cultural Authenticity** - Optimized for Indonesian/Malaysian cuisine
- **Quality Control** - Multiple generation options (High/Medium/Low)
- **Batch Processing** - Generate from multiple providers simultaneously
- **Download & Compare** - Easy comparison and selection

## 🚀 Quick Start

### Prerequisites
- Node.js (16+ recommended)
- At least one AI API key (start with Google Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cornmankl/ayam-gepuk-artisan-AI.git
   cd ayam-gepuk-artisan-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API keys**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   # Required - Get from https://makersuite.google.com/app/apikey
   GEMINI_API_KEY=your_google_gemini_api_key_here
   
   # Optional - Add more for enhanced capabilities
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   TOGETHER_API_KEY=your_together_ai_key_here
   STABILITY_API_KEY=your_stability_ai_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Visit `http://localhost:5173`

## 🎨 How to Use

### Basic Image Generation
1. **Select a Template** - Choose from 30+ professional food photography prompts
2. **Customize Prompt** - Edit or write your own description
3. **Enhance with AI** - Click "Enhance" to optimize your prompt automatically
4. **Choose Provider** - Select "Auto" for best results or pick a specific AI
5. **Add Options** - Include branded paper, drinks, sides, etc.
6. **Generate** - Create multiple high-quality images

### Advanced Features

#### AI Prompt Enhancement
- Click the ✨ "Enhance" button to automatically improve your prompts
- Adds professional photography terms, lighting, and composition details
- Optimizes for commercial food marketing use
- Shows confidence score and enhancement details

#### Multi-Provider Generation
- **Auto Mode**: Generates from multiple providers simultaneously
- **Specific Provider**: Choose your preferred AI service
- **Quality Settings**: High (best), Medium (balanced), Low (fastest)
- **Real-time Status**: See which providers are available

#### Provider Status Indicators
- 🟢 **Available** - Ready to generate
- 🟡 **Limited** - Approaching rate limits
- 🔴 **Unavailable** - Rate limited or offline

## 🔑 Free API Keys Guide

### Google Gemini (Primary - Required)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Free tier: 15 requests/minute, 1500 requests/day

### Hugging Face (Optional)
1. Sign up at [Hugging Face](https://huggingface.co)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token with "Read" permissions
4. Free tier: 1000 requests/month

### Together AI (Optional)
1. Sign up at [Together AI](https://api.together.xyz)
2. Get $5 free credits
3. Visit [API Keys](https://api.together.xyz/settings/api-keys)
4. Create new API key

### Stability AI (Optional)
1. Sign up at [Stability AI](https://platform.stability.ai)
2. Get free credits
3. Visit [Account > API Keys](https://platform.stability.ai/account/keys)
4. Generate new key

## 📋 Available Templates

Our system includes 30+ professional food photography templates:

- **Classic Product Shot** - Clean, professional menu photos
- **Spicy Action Shot** - Dynamic sambal drizzling
- **Flat Lay Menu Style** - Complete meal top-down view
- **Lifestyle Enjoyment** - People enjoying the food
- **Extreme Close-Up** - Texture and detail focus
- **Steam and Freshness** - Hot, fresh appearance
- **Behind the Scenes** - Kitchen and preparation
- **Family Meal Deal** - Large sharing portions
- **Minimalist Dark Mode** - Sophisticated presentation
- **Ingredients Spotlight** - Fresh ingredient focus
- And many more...

## 🎯 Perfect For

- **Restaurant Marketing** - Menu photos, social media content
- **Food Delivery Apps** - Appetizing product shots
- **Social Media** - Instagram, Facebook, TikTok content
- **Print Materials** - Brochures, posters, flyers
- **E-commerce** - Online menu and ordering systems
- **Food Blogs** - High-quality food photography
- **Marketing Campaigns** - Professional advertising materials

## 🔧 Technical Features

### AI Orchestra Architecture
- **Provider Management** - Automatic load balancing and failover
- **Rate Limit Handling** - Smart quota management across providers
- **Image Quality Analysis** - Automatic quality assessment
- **Caching System** - Efficient resource utilization
- **Error Recovery** - Graceful handling of provider failures

### Performance Optimizations
- **Parallel Generation** - Multiple providers working simultaneously
- **Smart Caching** - Reduced API calls and faster responses
- **Progressive Loading** - Images load as they're generated
- **Bandwidth Optimization** - Efficient image delivery

### Security & Privacy
- **API Key Protection** - Secure environment variable handling
- **No Data Storage** - Images aren't stored on our servers
- **Privacy First** - Your prompts and images stay private
- **CORS Protection** - Secure cross-origin resource sharing

## 🆘 Troubleshooting

### Common Issues

**"All providers failed"**
- Check your API keys in `.env.local`
- Verify internet connection
- Wait if rate limited (status indicators show availability)

**Images not generating**
- Ensure at least GEMINI_API_KEY is set
- Check browser console for error details
- Try different providers or lower quality settings

**Slow generation**
- Use "Medium" or "Low" quality settings
- Try specific providers instead of "Auto" mode
- Check provider status indicators

**Prompt enhancement not working**
- Verify GEMINI_API_KEY is correct
- Check internet connection
- Try again after a few moments

### Getting Help
- Check the browser console for error messages
- Verify API keys are correctly formatted
- Ensure you have sufficient API credits/quota
- Try using different providers if one fails

## 📈 Performance Tips

1. **Start with Google Gemini** - Most reliable and high-quality
2. **Add multiple providers** - Better availability and variety
3. **Use Auto mode** - Best results from multiple AIs
4. **Monitor rate limits** - Check status indicators
5. **Enhance prompts** - AI optimization improves results
6. **Try different qualities** - Balance speed vs quality

## 🤝 Contributing

We welcome contributions! Areas for enhancement:
- Additional AI providers
- New prompt templates
- UI/UX improvements
- Performance optimizations
- Documentation updates

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for primary image generation
- Hugging Face for community models
- Together AI, Stability AI, Replicate for additional providers
- OpenAI for inspiration in multi-model orchestration

---

<div align="center">
<strong>🍗 Made with ❤️ for the Malaysian/Indonesian food industry</strong><br>
<em>Generate amazing food photography with the power of multiple AI providers</em>
</div>
