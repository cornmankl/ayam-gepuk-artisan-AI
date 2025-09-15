/**
 * AI Orchestra - Multi-Provider Image Generation System
 * Integrates multiple free AI APIs for powerful image generation
 */

import axios from 'axios';

export interface AIProvider {
  name: string;
  displayName: string;
  enabled: boolean;
  priority: number;
  maxRetries: number;
  supportedAspectRatios: string[];
  supportedStyles: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface GenerationRequest {
  prompt: string;
  aspectRatio: string;
  numberOfImages?: number;
  style?: string;
  quality?: 'low' | 'medium' | 'high';
  provider?: string;
}

export interface GeneratedResult {
  success: boolean;
  images: Array<{
    url: string;
    base64?: string;
    provider: string;
    metadata?: any;
  }>;
  provider: string;
  processingTime: number;
  error?: string;
}

export class AIOrchestra {
  private providers: Map<string, AIProvider> = new Map();
  private requestHistory: Map<string, number[]> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Hugging Face Inference API (Free tier)
    this.providers.set('huggingface', {
      name: 'huggingface',
      displayName: 'Hugging Face SDXL',
      enabled: true,
      priority: 1,
      maxRetries: 3,
      supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      supportedStyles: ['realistic', 'artistic', 'cartoon', 'photographic'],
      rateLimit: {
        requestsPerMinute: 10,
        requestsPerHour: 100
      }
    });

    // Replicate API (Free tier with some models)
    this.providers.set('replicate', {
      name: 'replicate',
      displayName: 'Replicate SDXL',
      enabled: true,
      priority: 2,
      maxRetries: 3,
      supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      supportedStyles: ['realistic', 'artistic', 'photographic', 'cinematic'],
      rateLimit: {
        requestsPerMinute: 5,
        requestsPerHour: 50
      }
    });

    // Together AI (Free tier)
    this.providers.set('together', {
      name: 'together',
      displayName: 'Together AI SDXL',
      enabled: true,
      priority: 3,
      maxRetries: 3,
      supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      supportedStyles: ['realistic', 'artistic', 'anime', 'photographic'],
      rateLimit: {
        requestsPerMinute: 8,
        requestsPerHour: 80
      }
    });

    // Stability AI (Free tier)
    this.providers.set('stability', {
      name: 'stability',
      displayName: 'Stability AI SDXL',
      enabled: true,
      priority: 4,
      maxRetries: 3,
      supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      supportedStyles: ['realistic', 'artistic', 'photographic', 'enhance'],
      rateLimit: {
        requestsPerMinute: 3,
        requestsPerHour: 30
      }
    });

    // Keep Google GenAI as primary provider
    this.providers.set('google', {
      name: 'google',
      displayName: 'Google Imagen',
      enabled: true,
      priority: 0, // Highest priority
      maxRetries: 2,
      supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      supportedStyles: ['realistic', 'artistic', 'photographic', 'commercial'],
      rateLimit: {
        requestsPerMinute: 15,
        requestsPerHour: 200
      }
    });
  }

  /**
   * Enhanced prompt optimization using AI techniques
   */
  public optimizePrompt(originalPrompt: string, style?: string): string {
    let optimizedPrompt = originalPrompt;

    // Add style-specific enhancements
    const styleEnhancements = {
      'realistic': ', photorealistic, ultra detailed, professional photography, studio lighting, sharp focus',
      'artistic': ', artistic style, creative composition, vibrant colors, masterpiece quality',
      'commercial': ', commercial photography, product shot, professional lighting, marketing ready, high quality',
      'photographic': ', professional food photography, commercial quality, studio lighting, sharp details, appetizing'
    };

    if (style && styleEnhancements[style as keyof typeof styleEnhancements]) {
      optimizedPrompt += styleEnhancements[style as keyof typeof styleEnhancements];
    }

    // Add quality boosters
    optimizedPrompt += ', 8k uhd, high resolution, detailed, premium quality';

    // Food-specific enhancements for Ayam Gepuk
    if (optimizedPrompt.toLowerCase().includes('ayam gepuk') || 
        optimizedPrompt.toLowerCase().includes('chicken') ||
        optimizedPrompt.toLowerCase().includes('food')) {
      optimizedPrompt += ', appetizing, mouth-watering, gourmet presentation, food styling';
    }

    return optimizedPrompt;
  }

  /**
   * Check rate limits for a provider
   */
  private canMakeRequest(providerName: string): boolean {
    const provider = this.providers.get(providerName);
    if (!provider) return false;

    const now = Date.now();
    const history = this.requestHistory.get(providerName) || [];
    
    // Clean old requests (older than 1 hour)
    const recentRequests = history.filter(time => now - time < 3600000);
    
    // Check minute limit
    const lastMinuteRequests = recentRequests.filter(time => now - time < 60000);
    if (lastMinuteRequests.length >= provider.rateLimit.requestsPerMinute) {
      return false;
    }

    // Check hour limit
    if (recentRequests.length >= provider.rateLimit.requestsPerHour) {
      return false;
    }

    return true;
  }

  /**
   * Record a request for rate limiting
   */
  private recordRequest(providerName: string) {
    const history = this.requestHistory.get(providerName) || [];
    history.push(Date.now());
    this.requestHistory.set(providerName, history);
  }

  /**
   * Generate images using Hugging Face API
   */
  private async generateWithHuggingFace(request: GenerationRequest): Promise<GeneratedResult> {
    const startTime = Date.now();
    
    try {
      // Use SDXL model from Hugging Face
      const modelUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
      
      const response = await axios.post(modelUrl, {
        inputs: this.optimizePrompt(request.prompt, request.style),
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: this.getWidthFromAspectRatio(request.aspectRatio),
          height: this.getHeightFromAspectRatio(request.aspectRatio)
        }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 30000
      });

      const base64 = Buffer.from(response.data).toString('base64');
      
      return {
        success: true,
        images: [{
          url: `data:image/png;base64,${base64}`,
          base64,
          provider: 'huggingface',
          metadata: { model: 'SDXL' }
        }],
        provider: 'huggingface',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        images: [],
        provider: 'huggingface',
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate images using Together AI API
   */
  private async generateWithTogether(request: GenerationRequest): Promise<GeneratedResult> {
    const startTime = Date.now();
    
    try {
      const response = await axios.post('https://api.together.xyz/v1/images/generations', {
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        prompt: this.optimizePrompt(request.prompt, request.style),
        width: this.getWidthFromAspectRatio(request.aspectRatio),
        height: this.getHeightFromAspectRatio(request.aspectRatio),
        steps: 20,
        n: Math.min(request.numberOfImages || 1, 3)
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      });

      const images = response.data.data.map((img: any, index: number) => ({
        url: img.url,
        provider: 'together',
        metadata: { model: 'SDXL', index }
      }));

      return {
        success: true,
        images,
        provider: 'together',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        images: [],
        provider: 'together',
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate images using Stability AI API
   */
  private async generateWithStability(request: GenerationRequest): Promise<GeneratedResult> {
    const startTime = Date.now();
    
    try {
      const response = await axios.post('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        text_prompts: [{
          text: this.optimizePrompt(request.prompt, request.style),
          weight: 1
        }],
        cfg_scale: 7,
        height: this.getHeightFromAspectRatio(request.aspectRatio),
        width: this.getWidthFromAspectRatio(request.aspectRatio),
        samples: Math.min(request.numberOfImages || 1, 3),
        steps: 20,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY || ''}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000
      });

      const images = response.data.artifacts.map((artifact: any, index: number) => ({
        url: `data:image/png;base64,${artifact.base64}`,
        base64: artifact.base64,
        provider: 'stability',
        metadata: { seed: artifact.seed, index }
      }));

      return {
        success: true,
        images,
        provider: 'stability',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        images: [],
        provider: 'stability',
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get available providers sorted by priority
   */
  public getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.values())
      .filter(provider => provider.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Generate images with fallback mechanism
   */
  public async generateImages(request: GenerationRequest): Promise<GeneratedResult> {
    const providers = request.provider 
      ? [this.providers.get(request.provider)].filter(Boolean)
      : this.getAvailableProviders();

    for (const provider of providers) {
      if (!provider || !this.canMakeRequest(provider.name)) {
        continue;
      }

      this.recordRequest(provider.name);

      let result: GeneratedResult;

      try {
        switch (provider.name) {
          case 'huggingface':
            result = await this.generateWithHuggingFace(request);
            break;
          case 'together':
            result = await this.generateWithTogether(request);
            break;
          case 'stability':
            result = await this.generateWithStability(request);
            break;
          default:
            continue; // Skip unknown providers
        }

        if (result.success && result.images.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error);
        continue;
      }
    }

    return {
      success: false,
      images: [],
      provider: 'none',
      processingTime: 0,
      error: 'All providers failed or rate limited'
    };
  }

  /**
   * Utility methods for aspect ratio handling
   */
  private getWidthFromAspectRatio(aspectRatio: string): number {
    const ratioMap: { [key: string]: number } = {
      '1:1': 1024,
      '16:9': 1344,
      '9:16': 768,
      '4:3': 1152,
      '3:4': 896
    };
    return ratioMap[aspectRatio] || 1024;
  }

  private getHeightFromAspectRatio(aspectRatio: string): number {
    const ratioMap: { [key: string]: number } = {
      '1:1': 1024,
      '16:9': 768,
      '9:16': 1344,
      '4:3': 896,
      '3:4': 1152
    };
    return ratioMap[aspectRatio] || 1024;
  }

  /**
   * Get provider status and rate limit info
   */
  public getProviderStatus(): Array<{
    name: string;
    displayName: string;
    enabled: boolean;
    available: boolean;
    requestsRemaining: {
      perMinute: number;
      perHour: number;
    };
  }> {
    return Array.from(this.providers.values()).map(provider => {
      const history = this.requestHistory.get(provider.name) || [];
      const now = Date.now();
      const lastMinuteRequests = history.filter(time => now - time < 60000).length;
      const lastHourRequests = history.filter(time => now - time < 3600000).length;

      return {
        name: provider.name,
        displayName: provider.displayName,
        enabled: provider.enabled,
        available: this.canMakeRequest(provider.name),
        requestsRemaining: {
          perMinute: Math.max(0, provider.rateLimit.requestsPerMinute - lastMinuteRequests),
          perHour: Math.max(0, provider.rateLimit.requestsPerHour - lastHourRequests)
        }
      };
    });
  }
}

export const aiOrchestra = new AIOrchestra();