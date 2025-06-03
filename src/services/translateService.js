// TranslateService - Centralized DeepL translation management with caching
'use client';

class TranslateService {  constructor() {
    this.translationCache = new Map(); // Cache for translations
    this.translationPromiseCache = new Map(); // Cache for translation promises
    this.isInitialized = false;
    this.translator = null;
    
    this.initializeDeepL();
    
    // Load cached translations from localStorage for persistence
    if (typeof window !== 'undefined') {
      this.loadCacheFromStorage();
      
      // Save cache periodically to preserve translations
      setInterval(() => {
        this.saveCacheToStorage();
      }, 60000); // Save every minute
    }
  }initializeDeepL() {
    if (this.isInitialized) return;
    
    try {
      // Use internal API route to avoid CORS issues
      this.apiEndpoint = '/api/translate';
      this.isInitialized = true;
      
      // Check if using free tier and log optimization tips
      console.log('DeepL translator initialized successfully (using internal API)');
      console.log('💡 Free tier optimization enabled: enhanced caching, validation, and common word mappings');
      console.log('📊 Use the Translation Usage Monitor to track your daily API usage');
      
    } catch (error) {
      console.error('Failed to initialize DeepL translator:', error);
    }
  }// Language code mapping for DeepL API
  languageCodes = {
    french: 'FR',
    spanish: 'ES',
    german: 'DE',
    italian: 'IT',
    portuguese: 'PT-PT',
    russian: 'RU',
    chinese: 'ZH',
    japanese: 'JA',
    korean: 'KO',
    english: 'EN-US'
  };
  // Common word corrections for better translation accuracy and reduced API usage
  commonWordMappings = {
    french: {
      'salut': 'hi',
      'bonjour': 'hello',
      'bonsoir': 'good evening',
      'au revoir': 'goodbye',
      'merci': 'thank you',
      'oui': 'yes',
      'non': 'no',
      's\'il vous plaît': 'please',
      'excusez-moi': 'excuse me',
      'pardon': 'sorry',
      'chat': 'cat',
      'chien': 'dog',
      'eau': 'water',
      'pain': 'bread',
      'maison': 'house',
      'voiture': 'car',
      'livre': 'book',
      'temps': 'time',
      'jour': 'day',
      'nuit': 'night',
      'ami': 'friend',
      'famille': 'family',
      'école': 'school',
      'travail': 'work',
      'argent': 'money',
      'rouge': 'red',
      'bleu': 'blue',
      'vert': 'green',
      'blanc': 'white',
      'noir': 'black',
      'grand': 'big',
      'petit': 'small'
    },
    spanish: {
      'hola': 'hello',
      'adiós': 'goodbye',
      'gracias': 'thank you',
      'sí': 'yes',
      'no': 'no',
      'por favor': 'please',
      'perdón': 'sorry',
      'disculpe': 'excuse me',
      'gato': 'cat',
      'perro': 'dog',
      'agua': 'water',
      'pan': 'bread',
      'casa': 'house',
      'coche': 'car',
      'libro': 'book',
      'tiempo': 'time',
      'día': 'day',
      'noche': 'night',
      'amigo': 'friend',
      'familia': 'family',
      'escuela': 'school',
      'trabajo': 'work',
      'dinero': 'money',
      'rojo': 'red',
      'azul': 'blue',
      'verde': 'green',
      'blanco': 'white',
      'negro': 'black',
      'grande': 'big',
      'pequeño': 'small'
    },
    german: {
      'hallo': 'hello',
      'auf wiedersehen': 'goodbye',
      'danke': 'thank you',
      'ja': 'yes',
      'nein': 'no',
      'bitte': 'please',
      'entschuldigung': 'excuse me',
      'katze': 'cat',
      'hund': 'dog',
      'wasser': 'water',
      'brot': 'bread',
      'haus': 'house',
      'auto': 'car',
      'buch': 'book',
      'zeit': 'time',
      'tag': 'day',
      'nacht': 'night',
      'freund': 'friend',
      'familie': 'family',
      'schule': 'school',
      'arbeit': 'work',
      'geld': 'money',
      'rot': 'red',
      'blau': 'blue',
      'grün': 'green',
      'weiß': 'white',
      'schwarz': 'black',
      'groß': 'big',
      'klein': 'small'
    },
    italian: {
      'ciao': 'hello',
      'arrivederci': 'goodbye',
      'grazie': 'thank you',
      'sì': 'yes',
      'no': 'no',
      'per favore': 'please',
      'scusi': 'excuse me',
      'gatto': 'cat',
      'cane': 'dog',
      'acqua': 'water',
      'pane': 'bread',
      'casa': 'house',
      'macchina': 'car',
      'libro': 'book',
      'tempo': 'time',
      'giorno': 'day',
      'notte': 'night',
      'amico': 'friend',
      'famiglia': 'family',
      'scuola': 'school',
      'lavoro': 'work',
      'soldi': 'money',
      'rosso': 'red',
      'blu': 'blue',
      'verde': 'green',
      'bianco': 'white',
      'nero': 'black',
      'grande': 'big',
      'piccolo': 'small'
    },
    portuguese: {
      'olá': 'hello',
      'tchau': 'goodbye',
      'obrigado': 'thank you',
      'sim': 'yes',
      'não': 'no',
      'por favor': 'please',
      'desculpe': 'excuse me',
      'gato': 'cat',
      'cão': 'dog',
      'água': 'water',
      'pão': 'bread',
      'casa': 'house',
      'carro': 'car',
      'livro': 'book',
      'tempo': 'time',
      'dia': 'day',
      'noite': 'night',
      'amigo': 'friend',
      'família': 'family',
      'escola': 'school',
      'trabalho': 'work',
      'dinheiro': 'money'
    }
  };

  // Check if word has a common mapping for better accuracy
  getCommonWordMapping(text, sourceLanguage) {
    const normalizedText = text.toLowerCase().trim();
    const mappings = this.commonWordMappings[sourceLanguage.toLowerCase()];
    
    if (mappings && mappings[normalizedText]) {
      return mappings[normalizedText];
    }
    
    return null;
  }

  // Generate a unique cache key for the text and language combination
  generateCacheKey(text, sourceLanguage, targetLanguage) {
    return `${sourceLanguage.toLowerCase()}-${targetLanguage.toLowerCase()}-${text.toLowerCase().trim()}`;
  }

  // Get cached translation if it exists
  getCachedTranslation(text, sourceLanguage, targetLanguage) {
    const key = this.generateCacheKey(text, sourceLanguage, targetLanguage);
    return this.translationCache.get(key);
  }

  // Store translation in cache
  setCachedTranslation(text, sourceLanguage, targetLanguage, translation) {
    const key = this.generateCacheKey(text, sourceLanguage, targetLanguage);
    this.translationCache.set(key, translation);
    
    // Limit cache size to prevent memory issues (keep last 200 items)
    if (this.translationCache.size > 200) {
      const firstKey = this.translationCache.keys().next().value;
      this.translationCache.delete(firstKey);
    }
  }
  // Get language code for DeepL API
  getLanguageCode(language) {
    return this.languageCodes[language.toLowerCase()] || this.languageCodes.english;
  }  // Validate text for translation (optimize for free tier usage)
  isValidTextForTranslation(text, allowShort = false) {
    if (!text || typeof text !== 'string') return false;
    
    const trimmedText = text.trim();
    
    // Skip empty text
    if (trimmedText.length === 0) return false;
    
    // Skip very short text unless explicitly allowed
    if (!allowShort && trimmedText.length < 2) return false;
    
    // Skip if it's just numbers, spaces, or special characters
    if (/^[\d\s\W]*$/.test(trimmedText)) return false;
    
    // Skip if it's just a single character (unless explicitly allowed)
    if (!allowShort && trimmedText.length === 1) return false;
    
    // Skip if it contains only spaces and punctuation
    if (!/[a-zA-ZÀ-ÿ\u0100-\u017F\u0400-\u04FF\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(trimmedText)) return false;
    
    return true;
  }

  // Translate text using DeepL API
  async translateText(text, sourceLanguage = 'auto', targetLanguage = 'english') {
    // Try to re-initialize if not initialized
    if (!this.isInitialized) {
      this.initializeDeepL();
    }
    
    if (!this.isInitialized) {
      throw new Error('DeepL translator not initialized');
    }    // Validate text for translation to avoid wasting API calls
    // For vocabulary items, we want to allow shorter texts
    const isVocabularyWord = text && text.trim().split(/\s+/).length === 1;
    if (!this.isValidTextForTranslation(text, isVocabularyWord)) {
      throw new Error('Text is not suitable for translation');
    }

    const cacheKey = this.generateCacheKey(text, sourceLanguage, targetLanguage);

    // Check if translation is already in progress
    if (this.translationPromiseCache.has(cacheKey)) {
      return await this.translationPromiseCache.get(cacheKey);
    }    // Check if translation is already cached
    const cachedTranslation = this.getCachedTranslation(text, sourceLanguage, targetLanguage);
    if (cachedTranslation) {
      this.trackCacheHit();
      return cachedTranslation;
    }

    // Create translation promise and cache it to prevent duplicate calls
    const translationPromise = this._performTranslation(text, sourceLanguage, targetLanguage);
    this.translationPromiseCache.set(cacheKey, translationPromise);

    try {
      const translation = await translationPromise;
      this.setCachedTranslation(text, sourceLanguage, targetLanguage, translation);
      this.trackApiUsage(); // Track actual API usage
      return translation;
    } finally {
      // Remove from promise cache once complete
      this.translationPromiseCache.delete(cacheKey);
    }
  }  // Internal method to perform the actual translation using internal API
  async _performTranslation(text, sourceLanguage, targetLanguage) {
    if (!this.isInitialized) {
      throw new Error('Translation service not initialized');
    }

    try {
      // Call our internal API route
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        translatedText: data.translatedText,
        sourceLanguageCode: data.sourceLanguageCode,
        targetLanguageCode: data.targetLanguageCode
      };
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }// Translate with basic source language specification (supports auto-detection)
  async autoTranslate(text, sourceLanguage = 'auto', targetLanguage = 'english') {
    try {
      return await this.translateText(text, sourceLanguage, targetLanguage);
    } catch (error) {
      console.error('Error in auto translate:', error);
      throw error;
    }
  }
  // Batch translate multiple texts
  async translateMultiple(texts, sourceLanguage = 'auto', targetLanguage = 'english') {
    const promises = texts.map(text => 
      this.translateText(text, sourceLanguage, targetLanguage)
    );
    
    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        originalText: texts[index],
        success: result.status === 'fulfilled',
        translation: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
    } catch (error) {
      console.error('Error batch translating texts:', error);
      return texts.map(text => ({
        originalText: text,
        success: false,
        translation: null,
        error: error
      }));
    }
  }
  // Clear all cached translations (useful for memory management)
  clearCache() {
    this.translationCache.clear();
    this.translationPromiseCache.clear();
  }

  // Get cache statistics and usage info
  getCacheStats() {
    const cacheStats = {
      translationCacheSize: this.translationCache.size,
      promiseCacheSize: this.translationPromiseCache.size,
      isInitialized: this.isInitialized,
      commonWordsAvailable: Object.keys(this.commonWordMappings).reduce((total, lang) => 
        total + Object.keys(this.commonWordMappings[lang]).length, 0)
    };
    
    // Add API usage tracking info
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const apiCalls = parseInt(localStorage.getItem(`deepl_api_calls_${today}`) || '0');
      const cacheHits = parseInt(localStorage.getItem(`deepl_cache_hits_${today}`) || '0');
      
      cacheStats.todayApiCalls = apiCalls;
      cacheStats.todayCacheHits = cacheHits;
      cacheStats.todayTotal = apiCalls + cacheHits;
      cacheStats.cacheHitRate = cacheStats.todayTotal > 0 ? 
        Math.round((cacheHits / cacheStats.todayTotal) * 100) : 0;
    }
    
    return cacheStats;
  }
  // Track API usage for monitoring with warnings
  trackApiUsage() {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const currentCalls = parseInt(localStorage.getItem(`deepl_api_calls_${today}`) || '0');
      const newCount = currentCalls + 1;
      localStorage.setItem(`deepl_api_calls_${today}`, newCount.toString());
      
      // Warn about high usage (free tier has ~16,666 chars/day if spread evenly)
      // Assuming average word is 5-10 chars, warn at 1000+ calls per day
      if (newCount === 500) {
        console.warn('⚠️ DeepL API: 500 translations today. Consider using cached words or common vocabulary.');
      } else if (newCount === 750) {
        console.warn('⚠️ DeepL API: 750 translations today. High usage detected - check for unnecessary calls.');
      } else if (newCount >= 1000) {
        console.warn('🚨 DeepL API: 1000+ translations today! You may be approaching free tier limits.');
      }
    }
  }

  // Track cache hits for monitoring
  trackCacheHit() {
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const currentHits = parseInt(localStorage.getItem(`deepl_cache_hits_${today}`) || '0');
      localStorage.setItem(`deepl_cache_hits_${today}`, (currentHits + 1).toString());
    }
  }  // Export cache data for backup/persistence
  exportCacheData() {
    if (typeof window === 'undefined') return null;
    
    const cacheData = {};
    for (const [key, value] of this.translationCache.entries()) {
      cacheData[key] = value;
    }
    
    return {
      timestamp: new Date().toISOString(),
      cacheSize: this.translationCache.size,
      data: cacheData
    };
  }

  // Import cache data from backup
  importCacheData(cacheData) {
    if (!cacheData || !cacheData.data) return false;
    
    try {
      for (const [key, value] of Object.entries(cacheData.data)) {
        this.translationCache.set(key, value);
      }
      console.log(`Imported ${Object.keys(cacheData.data).length} cached translations`);
      return true;
    } catch (error) {
      console.error('Error importing cache data:', error);
      return false;
    }
  }

  // Save cache to localStorage for persistence
  saveCacheToStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData = this.exportCacheData();
      localStorage.setItem('deepl_translation_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  // Load cache from localStorage
  loadCacheFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const cached = localStorage.getItem('deepl_translation_cache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        this.importCacheData(cacheData);
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }  // Get supported language pairs
  getSupportedLanguages() {
    return Object.keys(this.languageCodes);
  }

  // Validate if a language is supported
  isLanguageSupported(language) {
    return this.languageCodes.hasOwnProperty(language.toLowerCase());
  }
  // Check if a word is likely to be in common mappings (avoid API call)
  isCommonWord(text, language) {
    const normalizedText = text.toLowerCase().trim();
    const mappings = this.commonWordMappings[language?.toLowerCase()];
    return mappings && mappings.hasOwnProperty(normalizedText);
  }

  // Check if service is ready
  isReady() {
    return this.isInitialized;
  }

  // Get estimated character count for a text (for free tier monitoring)
  getCharacterCount(text) {
    return text ? text.length : 0;
  }

  // Batch check if words exist in cache or common mappings
  checkWordsExist(words, language) {
    return words.map(word => ({
      word,
      inCache: this.getCachedTranslation(word, language, 'english') !== undefined,
      isCommon: this.isCommonWord(word, language),
      needsTranslation: !this.getCachedTranslation(word, language, 'english') && !this.isCommonWord(word, language)
    }));
  }// Simple translate from specified language to English with optimization
  async simpleTranslate(inputText, sourceLanguage) {
    // Validate input text - allow short words for vocabulary
    if (!this.isValidTextForTranslation(inputText, true)) {
      throw new Error('Input text is not suitable for translation');
    }

    const trimmedText = inputText.trim();

    if (!sourceLanguage || sourceLanguage === 'english') {
      // If source is English or not specified, return as-is
      return {
        word: trimmedText,
        translation: trimmedText,
        sourceLanguage: 'english'
      };
    }    // First check for common word mappings for better accuracy
    const commonMapping = this.getCommonWordMapping(trimmedText, sourceLanguage);
    if (commonMapping) {
      this.trackCacheHit(); // Count common word mapping as cache hit
      return {
        word: trimmedText,
        translation: commonMapping,
        sourceLanguage: sourceLanguage
      };
    }

    try {
      // Translate from the specified language to English
      const translation = await this.translateText(trimmedText, sourceLanguage, 'english');
      
      return {
        word: trimmedText, // Keep original as the word
        translation: translation.translatedText, // Translated text as English translation
        sourceLanguage: sourceLanguage
      };
    } catch (error) {
      console.error('Error in simple translate:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const translateService = new TranslateService();

export default translateService;
export { translateService };

// Named exports for specific functions
export const {
  translateText,
  autoTranslate,
  translateMultiple,
  simpleTranslate,
  clearCache,
  getCacheStats,
  preloadTranslation,
  getSupportedLanguages,
  isLanguageSupported,
  isReady
} = translateService;
