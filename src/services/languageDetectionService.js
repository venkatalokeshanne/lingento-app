// Language Detection Service - AI-powered language detection for smart translation
'use client';

import { bedrockService } from './bedrockService';

class LanguageDetectionService {
  constructor() {
    // Fallback pattern-based detection for when AI is not available
    this.commonWordPatterns = {
      english: {
        patterns: [
          // Common English words and patterns
          /\b(the|and|or|but|if|when|where|what|how|this|that|these|those)\b/i,
          /\b(is|are|was|were|am|have|has|had|do|does|did|will|would|can|could)\b/i,
          /\b(hello|hi|yes|no|please|thank|you|me|my|your|his|her|our|their)\b/i,
          /\b(good|bad|big|small|new|old|first|last|long|short|high|low)\b/i,
          /\b(time|day|year|week|month|house|work|school|book|car|water)\b/i,
          // English-specific letter patterns
          /\b\w*ing\b/i, // -ing endings
          /\b\w*ed\b/i,  // -ed endings
          /\b\w*ly\b/i,  // -ly endings
          /\b\w*tion\b/i, // -tion endings
        ],
        weights: [3, 3, 2, 2, 2, 1, 1, 1, 1] // Weight importance of each pattern
      },
      
      french: {
        patterns: [
          // Common French words
          /\b(le|la|les|un|une|des|et|ou|mais|si|quand|où|que|qui|ce|cette|ces)\b/i,
          /\b(est|sont|était|étaient|suis|avoir|avons|avez|ont|faire|fait)\b/i,
          /\b(bonjour|salut|oui|non|merci|vous|me|mon|ma|mes|votre|son|sa|ses|notre|nos|leur|leurs)\b/i,
          /\b(bon|mauvais|grand|petit|nouveau|vieux|premier|dernier|long|court)\b/i,
          /\b(temps|jour|année|semaine|mois|maison|travail|école|livre|voiture|eau)\b/i,
          // French-specific patterns
          /\b\w*ment\b/i, // -ment endings (adverbs)
          /\b\w*tion\b/i, // -tion endings
          /\b\w*eur\b/i,  // -eur endings
          /[àáâãäåèéêëìíîïòóôõöùúûü]/i, // French accents
        ],
        weights: [3, 3, 2, 2, 2, 1, 1, 1, 2]
      },
      
      spanish: {
        patterns: [
          // Common Spanish words
          /\b(el|la|los|las|un|una|unos|unas|y|o|pero|si|cuando|dónde|qué|quién|este|esta|estos|estas)\b/i,
          /\b(es|son|era|eran|soy|tener|tiene|tienen|hacer|hace|hacen)\b/i,
          /\b(hola|sí|no|gracias|usted|me|mi|mis|su|sus|nuestro|nuestra|nuestros|nuestras)\b/i,
          /\b(bueno|malo|grande|pequeño|nuevo|viejo|primero|último|largo|corto)\b/i,
          /\b(tiempo|día|año|semana|mes|casa|trabajo|escuela|libro|coche|agua)\b/i,
          // Spanish-specific patterns
          /\b\w*mente\b/i, // -mente endings (adverbs)
          /\b\w*ción\b/i,  // -ción endings
          /\b\w*dad\b/i,   // -dad endings
          /[ñáéíóúü]/i,    // Spanish specific characters
        ],
        weights: [3, 3, 2, 2, 2, 1, 1, 1, 2]
      },
      
      german: {
        patterns: [
          // Common German words
          /\b(der|die|das|ein|eine|und|oder|aber|wenn|wann|wo|was|wer|dieser|diese|dieses)\b/i,
          /\b(ist|sind|war|waren|bin|haben|hat|hatten|machen|macht|machten)\b/i,
          /\b(hallo|ja|nein|danke|Sie|mich|mein|meine|Ihr|Ihre|sein|seine|unser|unsere)\b/i,
          /\b(gut|schlecht|groß|klein|neu|alt|erste|letzte|lang|kurz)\b/i,
          /\b(Zeit|Tag|Jahr|Woche|Monat|Haus|Arbeit|Schule|Buch|Auto|Wasser)\b/i,
          // German-specific patterns
          /\b\w*ung\b/i,   // -ung endings
          /\b\w*keit\b/i,  // -keit endings
          /\b\w*lich\b/i,  // -lich endings
          /[äöüß]/i,       // German umlauts and ß
        ],
        weights: [3, 3, 2, 2, 2, 1, 1, 1, 2]
      },
      
      italian: {
        patterns: [
          // Common Italian words
          /\b(il|la|lo|le|gli|un|una|e|o|ma|se|quando|dove|che|chi|questo|questa|questi|queste)\b/i,
          /\b(è|sono|era|erano|essere|avere|ha|hanno|fare|fa|fanno)\b/i,
          /\b(ciao|sì|no|grazie|Lei|me|mio|mia|miei|mie|suo|sua|suoi|sue|nostro|nostra)\b/i,
          /\b(buono|cattivo|grande|piccolo|nuovo|vecchio|primo|ultimo|lungo|corto)\b/i,
          /\b(tempo|giorno|anno|settimana|mese|casa|lavoro|scuola|libro|macchina|acqua)\b/i,
          // Italian-specific patterns
          /\b\w*mente\b/i, // -mente endings (adverbs)
          /\b\w*zione\b/i, // -zione endings
          /\b\w*ità\b/i,   // -ità endings
          /[àèéìíîòóù]/i,  // Italian accents
        ],
        weights: [3, 3, 2, 2, 2, 1, 1, 1, 2]
      },
      
      portuguese: {
        patterns: [
          // Common Portuguese words
          /\b(o|a|os|as|um|uma|uns|umas|e|ou|mas|se|quando|onde|que|quem|este|esta|estes|estas)\b/i,
          /\b(é|são|era|eram|ser|ter|tem|têm|fazer|faz|fazem)\b/i,
          /\b(olá|sim|não|obrigado|você|me|meu|minha|meus|minhas|seu|sua|seus|suas|nosso|nossa)\b/i,
          /\b(bom|mau|grande|pequeno|novo|velho|primeiro|último|longo|curto)\b/i,
          /\b(tempo|dia|ano|semana|mês|casa|trabalho|escola|livro|carro|água)\b/i,
          // Portuguese-specific patterns
          /\b\w*mente\b/i, // -mente endings (adverbs)
          /\b\w*ção\b/i,   // -ção endings
          /\b\w*dade\b/i,  // -dade endings
          /[ãáàâéêíóôõúç]/i, // Portuguese specific characters
        ],
        weights: [3, 3, 2, 2, 2, 1, 1, 1, 2]
      }
    };
  }
  /**
   * Detect the language of input text using AI
   * @param {string} text - The text to analyze
   * @param {string} userLearningLanguage - User's current learning language  
   * @param {string} userNativeLanguage - User's native language
   * @returns {object} - Detection result with language and confidence
   */
  async detectLanguageWithAI(text, userLearningLanguage = 'french', userNativeLanguage = 'english') {
    if (!text || text.trim().length === 0) {
      return { language: userLearningLanguage, confidence: 0, reason: 'empty_input' };
    }

    // Check if AI service is available
    if (!bedrockService.isReady()) {
      console.log('AI service not available, falling back to pattern detection');
      return this.detectLanguage(text, userLearningLanguage, userNativeLanguage);
    }

    try {
      const cleanText = text.trim();
      
      // Build AI prompt for language detection
      const prompt = `You are a language detection expert. Analyze the following text and determine its language.

Text to analyze: "${cleanText}"

Available languages:
- ${userNativeLanguage} (user's native language)
- ${userLearningLanguage} (user's learning language)
- english (if not already listed)
- french (if not already listed)
- spanish (if not already listed)
- german (if not already listed)
- italian (if not already listed)
- portuguese (if not already listed)

Instructions:
1. Identify the most likely language of the input text
2. Provide a confidence score from 0.0 to 1.0
3. Consider language-specific characteristics like:
   - Common words and grammar patterns
   - Character usage (accents, special characters)
   - Sentence structure and word order
   - Vocabulary and spelling patterns

Response format (JSON only):
{
  "language": "detected_language_name",
  "confidence": 0.95,
  "reason": "explanation of detection logic"
}

Return only the JSON response, no other text.`;

      const aiResponse = await bedrockService.generateText(prompt);
      
      try {
        // Parse the AI response
        let cleanResponse = aiResponse
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();
        
        // Find JSON content
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanResponse = jsonMatch[0];
        }
        
        const result = JSON.parse(cleanResponse);
        
        // Validate the response
        if (result.language && typeof result.confidence === 'number') {
          console.log(`AI detected language: ${result.language} (confidence: ${result.confidence})`);
          return {
            language: result.language.toLowerCase(),
            confidence: Math.max(0, Math.min(1, result.confidence)), // Clamp to 0-1
            reason: result.reason || 'ai_detection',
            method: 'ai'
          };
        } else {
          throw new Error('Invalid AI response structure');
        }
      } catch (parseError) {
        console.error('Failed to parse AI language detection response:', parseError);
        console.log('Raw AI response:', aiResponse);
        throw parseError;
      }
      
    } catch (error) {
      console.error('AI language detection failed:', error);
      console.log('Falling back to pattern-based detection');
      
      // Fallback to pattern-based detection
      const fallbackResult = this.detectLanguage(text, userLearningLanguage, userNativeLanguage);
      return {
        ...fallbackResult,
        method: 'pattern_fallback',
        aiError: error.message
      };
    }
  }

  /**
   * Detect the language of input text using pattern matching (fallback method)
   * @param {string} text - The text to analyze
   * @param {string} userLearningLanguage - User's current learning language
   * @param {string} userNativeLanguage - User's native language
   * @returns {object} - Detection result with language and confidence
   */
  detectLanguage(text, userLearningLanguage = 'french', userNativeLanguage = 'english') {
    if (!text || text.trim().length === 0) {
      return { language: userLearningLanguage, confidence: 0, reason: 'empty_input' };
    }

    const cleanText = text.toLowerCase().trim();
    
    // For single words, use character-based detection first
    if (cleanText.split(/\s+/).length === 1) {
      return this.detectSingleWord(cleanText, userLearningLanguage, userNativeLanguage);
    }

    // For longer text, use pattern-based detection
    return this.detectByPatterns(cleanText, userLearningLanguage, userNativeLanguage);
  }

  /**
   * Detect language for single words
   * Uses character patterns and common word mappings
   */
  detectSingleWord(word, userLearningLanguage, userNativeLanguage) {
    const scores = {};
    
    // Check against common word patterns for user's languages first
    const relevantLanguages = [userNativeLanguage, userLearningLanguage];
    
    for (const lang of relevantLanguages) {
      if (!this.commonWordPatterns[lang]) continue;
      
      scores[lang] = 0;
      const patterns = this.commonWordPatterns[lang].patterns;
      const weights = this.commonWordPatterns[lang].weights;
      
      for (let i = 0; i < patterns.length; i++) {
        if (patterns[i].test(word)) {
          scores[lang] += weights[i] || 1;
        }
      }
      
      // Boost score for exact matches in common word lists
      if (this.isCommonWordInLanguage(word, lang)) {
        scores[lang] += 5;
      }
    }

    // Check character-based patterns for non-English languages
    if (userLearningLanguage !== 'english') {
      scores[userLearningLanguage] = (scores[userLearningLanguage] || 0) + 
        this.getCharacterScore(word, userLearningLanguage);
    }

    // Find the highest scoring language
    const maxScore = Math.max(...Object.values(scores));
    const detectedLang = Object.keys(scores).find(lang => scores[lang] === maxScore);
    
    // If no clear detection or low confidence, default based on character patterns
    if (!detectedLang || maxScore < 2) {
      // Check if word contains non-English characters
      if (this.hasNonEnglishCharacters(word)) {
        return {
          language: userLearningLanguage,
          confidence: 0.6,
          reason: 'character_based',
          scores
        };
      } else {
        return {
          language: userNativeLanguage,
          confidence: 0.5,
          reason: 'default_fallback',
          scores
        };
      }
    }

    const confidence = Math.min(maxScore / 10, 1); // Normalize to 0-1
    
    return {
      language: detectedLang,
      confidence,
      reason: 'pattern_match',
      scores
    };
  }

  /**
   * Detect language using pattern matching for longer text
   */
  detectByPatterns(text, userLearningLanguage, userNativeLanguage) {
    const scores = {};
    const relevantLanguages = [userNativeLanguage, userLearningLanguage];
    
    for (const lang of relevantLanguages) {
      if (!this.commonWordPatterns[lang]) continue;
      
      scores[lang] = 0;
      const patterns = this.commonWordPatterns[lang].patterns;
      const weights = this.commonWordPatterns[lang].weights;
      
      for (let i = 0; i < patterns.length; i++) {
        const matches = text.match(patterns[i]) || [];
        scores[lang] += matches.length * (weights[i] || 1);
      }
    }

    // Find the highest scoring language
    const maxScore = Math.max(...Object.values(scores));
    const detectedLang = Object.keys(scores).find(lang => scores[lang] === maxScore);
    
    if (!detectedLang || maxScore === 0) {
      return {
        language: userLearningLanguage,
        confidence: 0.3,
        reason: 'no_patterns_matched',
        scores
      };
    }

    const confidence = Math.min(maxScore / (text.split(/\s+/).length * 2), 1);
    
    return {
      language: detectedLang,
      confidence,
      reason: 'pattern_analysis',
      scores
    };  }

  /**
   * Normalize language names for consistent comparison
   * Handles different formats: "en" → "english", "English" → "english", etc.
   */
  normalizeLanguageName(language) {
    if (!language) return 'english';
    
    const normalized = language.toLowerCase().trim();
    
    // Map common language codes and variations to full names
    const languageMap = {
      'en': 'english',
      'eng': 'english',
      'english': 'english',
      'fr': 'french',
      'fra': 'french', 
      'fre': 'french',
      'french': 'french',
      'français': 'french',
      'francais': 'french',
      'es': 'spanish',
      'esp': 'spanish',
      'spanish': 'spanish',
      'español': 'spanish',
      'espanol': 'spanish',
      'de': 'german',
      'deu': 'german',
      'ger': 'german',
      'german': 'german',
      'deutsch': 'german',
      'it': 'italian',
      'ita': 'italian',
      'italian': 'italian',
      'italiano': 'italian',
      'pt': 'portuguese',
      'por': 'portuguese',
      'portuguese': 'portuguese',
      'português': 'portuguese',
      'portugues': 'portuguese'
    };
    
    return languageMap[normalized] || normalized;
  }

  /**
   * Check if word contains non-English characters
   */
  hasNonEnglishCharacters(word) {
    // Check for accented characters, umlauts, special characters
    return /[àáâãäåçèéêëìíîïñòóôõöùúûüýÿßÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝŸ]/.test(word);
  }

  /**
   * Get character-based score for a language
   */
  getCharacterScore(word, language) {
    const characterPatterns = {
      french: /[àáâãäåçèéêëìíîïòóôõöùúûüÿ]/gi,
      spanish: /[ñáéíóúü]/gi,
      german: /[äöüß]/gi,
      italian: /[àèéìíîòóù]/gi,
      portuguese: /[ãáàâéêíóôõúç]/gi
    };

    const pattern = characterPatterns[language];
    if (!pattern) return 0;

    const matches = word.match(pattern) || [];
    return matches.length * 2; // Weight character matches
  }

  /**
   * Check if word is a common word in the specified language
   * Uses the existing common word mappings from translateService
   */
  isCommonWordInLanguage(word, language) {
    // Simple check - in a real implementation, this would use
    // the translateService.commonWordMappings
    const commonWords = {
      english: ['the', 'and', 'is', 'are', 'to', 'of', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'],
      french: ['le', 'de', 'et', 'un', 'à', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'il', 'une', 'sur', 'avec', 'ne', 'se', 'pas'],
      spanish: ['el', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al'],
      german: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als'],
      italian: ['il', 'di', 'che', 'e', 'la', 'per', 'un', 'in', 'con', 'del', 'da', 'a', 'al', 'le', 'si', 'dei', 'nel', 'alla', 'o', 'se'],
      portuguese: ['o', 'de', 'que', 'e', 'do', 'a', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as']
    };

    const wordList = commonWords[language] || [];
    return wordList.includes(word.toLowerCase());
  }  /**
   * Determine translation direction based on detected language (using AI)
   * @param {string} inputText - The input text to analyze
   * @param {string} userLearningLanguage - User's learning language
   * @param {string} userNativeLanguage - User's native language
   * @returns {object} - Translation direction and detected language info
   */  async getTranslationDirectionWithAI(inputText, userLearningLanguage = 'french', userNativeLanguage = 'english') {
    const detection = await this.detectLanguageWithAI(inputText, userLearningLanguage, userNativeLanguage);
    
    // Normalize language names for comparison
    const normalizedDetected = this.normalizeLanguageName(detection.language);
    const normalizedNative = this.normalizeLanguageName(userNativeLanguage);
    const normalizedLearning = this.normalizeLanguageName(userLearningLanguage);
    
    console.log(`🔍 AI Detection Debug:
    - Input: "${inputText}"
    - Detected: "${detection.language}" (normalized: "${normalizedDetected}")
    - Native: "${userNativeLanguage}" (normalized: "${normalizedNative}")  
    - Learning: "${userLearningLanguage}" (normalized: "${normalizedLearning}")
    - Confidence: ${detection.confidence}
    - Method: ${detection.method}`);
    
    let direction = {
      detectedLanguage: normalizedDetected,
      confidence: detection.confidence,
      sourceLanguage: normalizedDetected,
      targetLanguage: null,
      wordLanguage: normalizedLearning, // Always save word in learning language
      translationLanguage: normalizedNative, // Always save translation in native language
      swapNeeded: false,
      reason: detection.reason,
      method: detection.method || 'unknown'
    };

    if (normalizedDetected === normalizedNative) {
      // Input is in native language -> translate to learning language
      direction.targetLanguage = normalizedLearning;
      direction.swapNeeded = true; // We'll need to swap word/translation
      direction.translationFlow = 'native_to_learning';
      console.log(`📝 Direction: Native (${normalizedNative}) → Learning (${normalizedLearning})`);
    } else {
      // Input is in learning language -> translate to native language
      direction.targetLanguage = normalizedNative;
      direction.swapNeeded = false;
      direction.translationFlow = 'learning_to_native';
      console.log(`📝 Direction: Learning (${normalizedDetected}) → Native (${normalizedNative})`);
    }

    return direction;
  }

  /**
   * Determine translation direction based on detected language (pattern-based fallback)
   * @param {string} inputText - The input text to analyze
   * @param {string} userLearningLanguage - User's learning language
   * @param {string} userNativeLanguage - User's native language
   * @returns {object} - Translation direction and detected language info
   */
  /**
   * Determine translation direction based on detected language (AI with pattern fallback)
   * @param {string} inputText - The input text to analyze
   * @param {string} userLearningLanguage - User's learning language
   * @param {string} userNativeLanguage - User's native language
   * @returns {object} - Translation direction and detected language info
   */
  async getTranslationDirection(inputText, userLearningLanguage = 'french', userNativeLanguage = 'english') {
    // Try AI detection first
    try {
      return await this.getTranslationDirectionWithAI(inputText, userLearningLanguage, userNativeLanguage);
    } catch (error) {
      console.warn('AI detection failed, using pattern fallback:', error.message);
      return this.getTranslationDirectionFallback(inputText, userLearningLanguage, userNativeLanguage);
    }
  }
  getTranslationDirectionFallback(inputText, userLearningLanguage = 'french', userNativeLanguage = 'english') {
    const detection = this.detectLanguage(inputText, userLearningLanguage, userNativeLanguage);
    
    // Normalize language names for comparison
    const normalizedDetected = this.normalizeLanguageName(detection.language);
    const normalizedNative = this.normalizeLanguageName(userNativeLanguage);
    const normalizedLearning = this.normalizeLanguageName(userLearningLanguage);
    
    console.log(`🔍 Pattern Detection Debug:
    - Input: "${inputText}"
    - Detected: "${detection.language}" (normalized: "${normalizedDetected}")
    - Native: "${userNativeLanguage}" (normalized: "${normalizedNative}")  
    - Learning: "${userLearningLanguage}" (normalized: "${normalizedLearning}")
    - Confidence: ${detection.confidence}`);
    
    let direction = {
      detectedLanguage: normalizedDetected,
      confidence: detection.confidence,
      sourceLanguage: normalizedDetected,
      targetLanguage: null,
      wordLanguage: normalizedLearning, // Always save word in learning language
      translationLanguage: normalizedNative, // Always save translation in native language
      swapNeeded: false,
      reason: detection.reason
    };

    if (normalizedDetected === normalizedNative) {
      // Input is in native language -> translate to learning language
      direction.targetLanguage = normalizedLearning;
      direction.swapNeeded = true; // We'll need to swap word/translation
      direction.translationFlow = 'native_to_learning';
      console.log(`📝 Direction: Native (${normalizedNative}) → Learning (${normalizedLearning})`);
    } else {
      // Input is in learning language -> translate to native language
      direction.targetLanguage = normalizedNative;
      direction.swapNeeded = false;
      direction.translationFlow = 'learning_to_native';
      console.log(`📝 Direction: Learning (${normalizedDetected}) → Native (${normalizedNative})`);
    }

    return direction;
  }
  /**
   * Prepare word data for saving based on translation direction
   * Always ensures: word = learning language, translation = native language
   */
  prepareWordData(originalInput, translatedText, direction, userLearningLanguage, userNativeLanguage) {
    const normalizedLearning = this.normalizeLanguageName(userLearningLanguage);
    const normalizedNative = this.normalizeLanguageName(userNativeLanguage);
    
    let wordData = {
      word: '',
      translation: '',
      language: normalizedLearning, // Always learning language
      detectedInputLanguage: direction.detectedLanguage,
      confidence: direction.confidence
    };

    console.log(`🔄 Preparing word data:
    - Original input: "${originalInput}"
    - Translated text: "${translatedText}"
    - Swap needed: ${direction.swapNeeded}
    - Translation flow: ${direction.translationFlow}`);

    if (direction.swapNeeded) {
      // Input was in native language, translation is in learning language
      wordData.word = translatedText; // Learning language (translated)
      wordData.translation = originalInput; // Native language (original input)
      console.log(`✅ Final assignment (swapped):
      - word (${normalizedLearning}): "${wordData.word}"
      - translation (${normalizedNative}): "${wordData.translation}"`);
    } else {
      // Input was in learning language, translation is in native language
      wordData.word = originalInput; // Learning language (original input)
      wordData.translation = translatedText; // Native language (translated)
      console.log(`✅ Final assignment (direct):
      - word (${normalizedLearning}): "${wordData.word}"
      - translation (${normalizedNative}): "${wordData.translation}"`);
    }

    return wordData;
  }
}

// Create singleton instance
const languageDetectionService = new LanguageDetectionService();

export default languageDetectionService;
export { languageDetectionService };
