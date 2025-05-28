// AudioService - Centralized AWS Polly audio management with caching
'use client';

import AWS from 'aws-sdk';

class AudioService {
  constructor() {
    this.audioCache = new Map(); // Cache for audio URLs
    this.synthesisCache = new Map(); // Cache for synthesis promises
    this.currentAudio = null; // Currently playing audio
    this.isInitialized = false;
    
    this.initializeAWS();
  }
  initializeAWS() {
    if (this.isInitialized) return;
    
    try {
      // Configure AWS using environment variables
      AWS.config.update({
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
      });

      this.polly = new AWS.Polly();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AWS Polly:', error);
    }
  }

  // Language code mapping for Polly voices
  languageVoices = {
    french: { voice: 'Lea', code: 'fr-FR' },
    spanish: { voice: 'Lucia', code: 'es-ES' },
    german: { voice: 'Vicki', code: 'de-DE' },
    italian: { voice: 'Bianca', code: 'it-IT' },
    portuguese: { voice: 'Camila', code: 'pt-BR' },
    russian: { voice: 'Tatyana', code: 'ru-RU' },
    chinese: { voice: 'Zhiyu', code: 'cmn-CN' },
    japanese: { voice: 'Mizuki', code: 'ja-JP' },
    korean: { voice: 'Seoyeon', code: 'ko-KR' },
    english: { voice: 'Joanna', code: 'en-US' }
  };

  // Generate a unique cache key for the text and language combination
  generateCacheKey(text, language) {
    return `${language.toLowerCase()}-${text.toLowerCase().trim()}`;
  }

  // Get cached audio URL if it exists
  getCachedAudio(text, language) {
    const key = this.generateCacheKey(text, language);
    return this.audioCache.get(key);
  }

  // Store audio URL in cache
  setCachedAudio(text, language, audioUrl) {
    const key = this.generateCacheKey(text, language);
    this.audioCache.set(key, audioUrl);
    
    // Limit cache size to prevent memory issues (keep last 100 items)
    if (this.audioCache.size > 100) {
      const firstKey = this.audioCache.keys().next().value;
      const oldUrl = this.audioCache.get(firstKey);
      if (oldUrl && oldUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldUrl);
      }
      this.audioCache.delete(firstKey);
    }
  }

  // Synthesize speech using AWS Polly
  async synthesizeSpeech(text, language = 'english') {
    if (!this.isInitialized) {
      throw new Error('AWS Polly not initialized');
    }

    const cacheKey = this.generateCacheKey(text, language);

    // Check if synthesis is already in progress
    if (this.synthesisCache.has(cacheKey)) {
      return await this.synthesisCache.get(cacheKey);
    }

    // Check if audio is already cached
    const cachedUrl = this.getCachedAudio(text, language);
    if (cachedUrl) {
      return cachedUrl;
    }

    // Create synthesis promise and cache it to prevent duplicate calls
    const synthesisPromise = this._performSynthesis(text, language);
    this.synthesisCache.set(cacheKey, synthesisPromise);

    try {
      const audioUrl = await synthesisPromise;
      this.setCachedAudio(text, language, audioUrl);
      return audioUrl;
    } finally {
      // Remove from synthesis cache once complete
      this.synthesisCache.delete(cacheKey);
    }
  }

  // Internal method to perform the actual synthesis
  async _performSynthesis(text, language) {
    const voiceSettings = this.languageVoices[language.toLowerCase()] || this.languageVoices.english;
    
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceSettings.voice,
      LanguageCode: voiceSettings.code,
      Engine: 'neural'
    };

    try {
      const data = await this.polly.synthesizeSpeech(params).promise();
      const blob = new Blob([data.AudioStream], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  // Play audio with built-in controls
  async playAudio(text, language = 'english', options = {}) {
    const {
      onStart = () => {},
      onEnd = () => {},
      onError = () => {},
      stopCurrentAudio = true
    } = options;

    try {
      // Stop current audio if requested
      if (stopCurrentAudio && this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }

      // Get or create audio URL
      const audioUrl = await this.synthesizeSpeech(text, language);
      
      // Create new audio element
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      // Set up event listeners
      audio.onplay = onStart;
      audio.onended = () => {
        this.currentAudio = null;
        onEnd();
      };
      audio.onerror = (error) => {
        this.currentAudio = null;
        onError(error);
      };

      // Play the audio
      await audio.play();
      return audio;
    } catch (error) {
      onError(error);
      throw error;
    }
  }

  // Stop currently playing audio
  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  // Check if audio is currently playing
  isPlaying() {
    return this.currentAudio && !this.currentAudio.paused;
  }

  // Get current playing audio element
  getCurrentAudio() {
    return this.currentAudio;
  }

  // Clear all cached audio URLs (useful for memory management)
  clearCache() {
    for (const [key, url] of this.audioCache) {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
    this.audioCache.clear();
    this.synthesisCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      audioCache: this.audioCache.size,
      synthesisCache: this.synthesisCache.size,
      isPlaying: this.isPlaying()
    };
  }

  // Preload audio for better performance
  async preloadAudio(text, language = 'english') {
    try {
      await this.synthesizeSpeech(text, language);
      return true;
    } catch (error) {
      console.error('Error preloading audio:', error);
      return false;
    }
  }

  // Batch preload multiple audio files
  async preloadMultipleAudio(items) {
    const promises = items.map(({ text, language = 'english' }) => 
      this.preloadAudio(text, language)
    );
    
    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
      return {
        total: items.length,
        successful,
        failed: items.length - successful
      };
    } catch (error) {
      console.error('Error batch preloading audio:', error);
      return { total: items.length, successful: 0, failed: items.length };
    }
  }
}

// Create a singleton instance
const audioService = new AudioService();

export default audioService;
export { audioService };

// Named exports for specific functions
export const {
  synthesizeSpeech,
  playAudio,
  stopAudio,
  isPlaying,
  clearCache,
  getCacheStats,
  preloadAudio,
  preloadMultipleAudio
} = audioService;
