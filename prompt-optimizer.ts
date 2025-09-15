/**
 * AI-Powered Prompt Optimizer and Enhancement System
 * Uses multiple AI models to create better, more detailed prompts
 */

import { GoogleGenAI } from '@google/genai';

export interface PromptEnhancement {
  originalPrompt: string;
  enhancedPrompt: string;
  enhancements: string[];
  style: string;
  confidence: number;
  suggestions: string[];
}

export interface PromptAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: 'simple' | 'moderate' | 'complex';
  keywords: string[];
  missingElements: string[];
  recommendations: string[];
}

export class PromptOptimizer {
  private ai: GoogleGenAI;
  private foodKeywords: string[] = [
    'ayam gepuk', 'chicken', 'crispy', 'fried', 'golden', 'sambal', 'spicy',
    'rice', 'lalapan', 'cucumber', 'tofu', 'tempeh', 'indonesian', 'malaysian',
    'street food', 'artisan', 'authentic', 'traditional', 'delicious',
    'appetizing', 'mouth-watering', 'gourmet', 'homemade'
  ];

  private photographyTerms: string[] = [
    'professional photography', 'studio lighting', 'commercial photography',
    'food styling', 'macro photography', 'shallow depth of field',
    'natural lighting', 'dramatic lighting', 'high resolution',
    '8k uhd', 'sharp focus', 'detailed texture', 'vibrant colors',
    'appetizing presentation', 'clean background', 'minimalist',
    'lifestyle photography', 'editorial style'
  ];

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Analyze prompt for completeness and quality
   */
  public analyzePrompt(prompt: string): PromptAnalysis {
    const words = prompt.toLowerCase().split(/\s+/);
    const keywords = this.foodKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword.toLowerCase())
    );

    const hasPhotographyTerms = this.photographyTerms.some(term =>
      prompt.toLowerCase().includes(term.toLowerCase())
    );

    const missingElements: string[] = [];
    const recommendations: string[] = [];

    // Check for essential elements
    if (!keywords.some(k => ['ayam gepuk', 'chicken'].includes(k))) {
      missingElements.push('main subject');
      recommendations.push('Specify the main dish (ayam gepuk or chicken)');
    }

    if (!hasPhotographyTerms) {
      missingElements.push('photography style');
      recommendations.push('Add photography style terms for better quality');
    }

    if (!prompt.includes('lighting')) {
      missingElements.push('lighting description');
      recommendations.push('Specify lighting conditions (studio, natural, dramatic)');
    }

    if (!prompt.includes('background')) {
      missingElements.push('background specification');
      recommendations.push('Describe the background or setting');
    }

    return {
      sentiment: this.determineSentiment(prompt),
      complexity: words.length < 10 ? 'simple' : words.length < 25 ? 'moderate' : 'complex',
      keywords,
      missingElements,
      recommendations
    };
  }

  private determineSentiment(prompt: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['delicious', 'appetizing', 'beautiful', 'amazing', 'perfect', 'fresh', 'crispy', 'golden'];
    const negativeWords = ['burnt', 'old', 'stale', 'ugly', 'bad', 'terrible'];

    const positiveCount = positiveWords.filter(word => prompt.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => prompt.toLowerCase().includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Enhance prompt using AI-powered analysis
   */
  public async enhancePrompt(
    originalPrompt: string, 
    style: string = 'commercial',
    aspectRatio: string = '1:1'
  ): Promise<PromptEnhancement> {
    const analysis = this.analyzePrompt(originalPrompt);
    
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `You are an expert food photography and AI image generation prompt engineer. Your task is to enhance prompts for generating high-quality images of Indonesian/Malaysian food, specifically Ayam Gepuk Artisan.

Guidelines:
1. Maintain the original intent and core elements
2. Add professional photography terminology
3. Include specific lighting and composition details
4. Add texture and quality descriptors
5. Ensure cultural authenticity for Indonesian/Malaysian cuisine
6. Optimize for commercial/marketing use
7. Keep prompts concise but descriptive (max 200 words)

Style preferences:
- Commercial: professional, clean, marketing-ready
- Artistic: creative, stylized, unique angles
- Realistic: photorealistic, natural, authentic
- Lifestyle: casual, relatable, in-context

Current style: ${style}
Aspect ratio: ${aspectRatio}

Return only the enhanced prompt without explanation.`
        }
      });

      const response = await chat.sendMessage({
        message: `Enhance this Ayam Gepuk Artisan image prompt: "${originalPrompt}"`
      });

      const enhancedPrompt = response.text.trim();
      
      // Generate enhancements list
      const enhancements = this.identifyEnhancements(originalPrompt, enhancedPrompt);
      
      return {
        originalPrompt,
        enhancedPrompt,
        enhancements,
        style,
        confidence: this.calculateConfidence(enhancedPrompt, analysis),
        suggestions: analysis.recommendations
      };

    } catch (error) {
      console.warn('AI enhancement failed, using rule-based enhancement:', error);
      return this.ruleBasedEnhancement(originalPrompt, style, analysis);
    }
  }

  /**
   * Rule-based enhancement as fallback
   */
  private ruleBasedEnhancement(
    originalPrompt: string, 
    style: string, 
    analysis: PromptAnalysis
  ): PromptEnhancement {
    let enhanced = originalPrompt;
    const enhancements: string[] = [];

    // Add style-specific terms
    const styleEnhancements = {
      commercial: 'professional commercial food photography, studio lighting, clean background, marketing ready',
      artistic: 'artistic food photography, creative composition, dramatic lighting, unique perspective',
      realistic: 'photorealistic food photography, natural lighting, authentic presentation, detailed texture',
      lifestyle: 'lifestyle food photography, casual setting, natural environment, relatable presentation'
    };

    if (styleEnhancements[style as keyof typeof styleEnhancements]) {
      enhanced = `${enhanced}, ${styleEnhancements[style as keyof typeof styleEnhancements]}`;
      enhancements.push(`Added ${style} photography style`);
    }

    // Add missing photography elements
    if (!enhanced.toLowerCase().includes('lighting')) {
      enhanced += ', soft professional lighting';
      enhancements.push('Added lighting specification');
    }

    if (!enhanced.toLowerCase().includes('resolution') && !enhanced.toLowerCase().includes('quality')) {
      enhanced += ', 8k uhd, high resolution, sharp focus';
      enhancements.push('Added quality specifications');
    }

    // Add food-specific enhancements
    if (enhanced.toLowerCase().includes('ayam') || enhanced.toLowerCase().includes('chicken')) {
      enhanced += ', appetizing, mouth-watering presentation, gourmet food styling';
      enhancements.push('Added appetizing descriptors');
    }

    return {
      originalPrompt,
      enhancedPrompt: enhanced,
      enhancements,
      style,
      confidence: 0.7, // Lower confidence for rule-based
      suggestions: analysis.recommendations
    };
  }

  /**
   * Identify what enhancements were made
   */
  private identifyEnhancements(original: string, enhanced: string): string[] {
    const enhancements: string[] = [];
    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    const enhancedWords = enhanced.toLowerCase().split(/\s+/);
    
    const newWords = enhancedWords.filter(word => !originalWords.has(word));
    
    if (newWords.some(word => ['professional', 'commercial', 'studio'].includes(word))) {
      enhancements.push('Added professional photography terms');
    }
    
    if (newWords.some(word => ['lighting', 'light', 'illuminated'].includes(word))) {
      enhancements.push('Enhanced lighting description');
    }
    
    if (newWords.some(word => ['8k', 'uhd', 'resolution', 'sharp'].includes(word))) {
      enhancements.push('Added quality specifications');
    }
    
    if (newWords.some(word => ['appetizing', 'delicious', 'mouth-watering'].includes(word))) {
      enhancements.push('Added appetizing descriptors');
    }

    return enhancements;
  }

  /**
   * Calculate confidence score for enhanced prompt
   */
  private calculateConfidence(prompt: string, analysis: PromptAnalysis): number {
    let score = 0.5; // Base score

    // Bonus for including photography terms
    if (this.photographyTerms.some(term => prompt.toLowerCase().includes(term.toLowerCase()))) {
      score += 0.2;
    }

    // Bonus for food keywords
    const foodKeywordCount = this.foodKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += Math.min(foodKeywordCount * 0.05, 0.2);

    // Penalty for missing elements
    score -= analysis.missingElements.length * 0.1;

    // Bonus for optimal length
    const wordCount = prompt.split(/\s+/).length;
    if (wordCount >= 15 && wordCount <= 50) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate multiple prompt variations
   */
  public async generateVariations(
    basePrompt: string, 
    count: number = 3
  ): Promise<PromptEnhancement[]> {
    const styles = ['commercial', 'artistic', 'realistic', 'lifestyle'];
    const variations: PromptEnhancement[] = [];

    for (let i = 0; i < Math.min(count, styles.length); i++) {
      try {
        const enhancement = await this.enhancePrompt(basePrompt, styles[i]);
        variations.push(enhancement);
      } catch (error) {
        console.warn(`Failed to generate variation ${i + 1}:`, error);
      }
    }

    return variations;
  }

  /**
   * Batch optimize multiple prompts
   */
  public async batchOptimize(prompts: string[]): Promise<PromptEnhancement[]> {
    const results: PromptEnhancement[] = [];
    
    for (const prompt of prompts) {
      try {
        const enhanced = await this.enhancePrompt(prompt);
        results.push(enhanced);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn('Batch optimization failed for prompt:', prompt, error);
      }
    }

    return results;
  }
}