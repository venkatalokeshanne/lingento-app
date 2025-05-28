// AWS Bedrock Service - Centralized AI functionality
'use client';

class BedrockService {
  constructor() {
    this.cache = new Map();
    this.isInitialized = true; // Always ready since we use API routes
  }  // Generate examples for a word with context
  async generateExamples(word, translation, language, definition = '') {
    const cacheKey = `examples_${word}_${language}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'examples',
          word,
          translation,
          language,
          definition
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bedrock API error:', errorData);
        
        // If Bedrock is not available, return fallback examples
        if (response.status === 403 || response.status === 500) {
          console.log('Bedrock not available, generating fallback examples');
          return this.generateFallbackExamples(word, translation, language);
        }
        
        throw new Error(errorData.error || 'Failed to generate examples');
      }

      const data = await response.json();
      const examples = data.result;
      
      // Cache the result
      this.cache.set(cacheKey, examples);
      
      return examples;
    } catch (error) {
      console.error('Error generating examples:', error);
      
      // Return fallback examples if there's any error
      console.log('Generating fallback examples due to error');
      return this.generateFallbackExamples(word, translation, language);
    }
  }
  // Generate enhanced definition for a word (with conjugation support for verbs)
  async generateDefinition(word, language, translation = '', partOfSpeech = '', context = '') {
    const cacheKey = `definition_${word}_${language}_${partOfSpeech}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'definition',
          word,
          language,
          translation,
          partOfSpeech,
          definition: context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bedrock definition API error:', errorData);
        
        // If Bedrock is not available, return fallback definition
        if (response.status === 403 || response.status === 500) {
          console.log('Bedrock not available, generating fallback definition');
          return this.generateFallbackDefinition(word, language, translation, partOfSpeech);
        }
        
        throw new Error(errorData.error || 'Failed to generate definition');
      }      const data = await response.json();
      const result = data.result;
      
      // Transform verb conjugation data if present
      if (result && result.type === 'conjugation' && result.conjugationTable) {
        const transformedResult = {
          definition: result.definition,
          conjugations: this.transformConjugationTable(result.conjugationTable),
          notes: result.notes,
          rawText: result.rawText
        };
        
        // Cache the result
        this.cache.set(cacheKey, transformedResult);
        return transformedResult;
      }
      
      // Cache the result for non-verb definitions
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error generating definition:', error);
      
      // Return fallback definition if there's any error
      console.log('Generating fallback definition due to error');
      return this.generateFallbackDefinition(word, language, translation, partOfSpeech);
    }
  }

  // Generate pronunciation guide
  async generatePronunciation(word, language) {
    const cacheKey = `pronunciation_${word}_${language}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'pronunciation',
          word,
          language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate pronunciation');
      }

      const data = await response.json();
      const pronunciation = data.result;
      
      // Cache the result
      this.cache.set(cacheKey, pronunciation);
      
      return pronunciation;
    } catch (error) {
      console.error('Error generating pronunciation:', error);
      throw error;
    }
  }
  // Transform conjugation table from array format to object format expected by UI
  transformConjugationTable(conjugationTable) {
    const conjugations = {};
    
    if (!Array.isArray(conjugationTable)) {
      return conjugations;
    }
    
    conjugationTable.forEach(tenseData => {
      if (tenseData.tense && tenseData.forms) {        // Clean up tense name for use as object key
        let tenseName = tenseData.tense
          .toLowerCase()
          .replace(/\s*\(.*?\)\s*/g, '') // Remove parenthetical explanations
          .replace(/[àáâãäå]/g, 'a')      // Remove French accents
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[ñ]/g, 'n')
          .replace(/[^a-z0-9\s]/g, '')    // Remove non-alphanumeric except spaces
          .replace(/\s+/g, ' ')           // Normalize spaces
          .trim();
          // Map French tense names to cleaner English equivalents - only allow desired tenses
        const tenseMapping = {
          'present tense': 'present',
          'present': 'present',
          'passe compose': 'passe',
          'present perfect': 'passe',
          'past tense': 'past',
          'past': 'past',
          'imparfait': 'imperfect',
          'imperfect': 'imperfect',
          'futur simple': 'future',
          'simple future': 'future',
          'future': 'future'
        };
        
        const mappedTenseName = tenseMapping[tenseName];
        
        // Skip unwanted tenses (conditional, subjunctive, etc.)
        if (!mappedTenseName) {
          return; // Skip this tense entirely
        }
        
        conjugations[mappedTenseName] = {};
        
        tenseData.forms.forEach(form => {
          // Clean up the form and try to extract pronoun and conjugated verb
          const cleanForm = form.trim();
          
          // Try different patterns to extract pronoun and verb
          let match = cleanForm.match(/^(.+?)\s+(.+)$/);
          if (match) {
            const pronoun = match[1].trim();
            const conjugatedForm = match[2].trim();
            
            // Clean up pronouns (remove "que" from subjunctive, etc.)
            const cleanPronoun = pronoun.replace(/^qu?['']?/i, '').trim();
              conjugations[mappedTenseName][cleanPronoun] = conjugatedForm;
          } else {
            // If no clear pattern, just add as numbered entry
            const index = Object.keys(conjugations[mappedTenseName]).length;
            conjugations[mappedTenseName][`form${index + 1}`] = cleanForm;
          }
        });
      }
    });
    
    return conjugations;
  }
  // Generate fallback examples when Bedrock is not available
  generateFallbackExamples(word, translation, language) {
    const templates = [
      `When studying ${language}, I discovered that "${word}" means "${translation}".`,
      `The ${language} term "${word}" can be translated as "${translation}" in English.`,
      `In ${language} conversation, you might hear "${word}", which means "${translation}".`,
      `Understanding the word "${word}" (${translation}) is important for ${language} learners.`
    ];

    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, 3).map((template, index) => ({
      id: `fallback_${index + 1}`,
      sentence: template,
      translation: template, // For fallback, we'll use the same text
      explanation: `This is a basic example showing how to use "${word}" in context.`
    }));
  }

  // Generate fallback definition when Bedrock is not available
  generateFallbackDefinition(word, language, translation = '', partOfSpeech = '') {
    const part = partOfSpeech || 'Word';
    const translationText = translation ? ` (${translation})` : '';
      if (partOfSpeech?.toLowerCase() === 'verb') {
      return {
        definition: `[Verb] ${word}${translationText} - Basic verb definition not available. Please check your internet connection.`,
        conjugations: {
          note: {
            'Information': 'Conjugation table is not available without AI service.',
            'Status': 'Please check your internet connection and try again.',
            'Word': `This is the ${language} verb: ${word}${translationText}`
          }
        },
        notes: ['AI-generated conjugation is temporarily unavailable.'],
        rawText: `Verb conjugation for "${word}" is not available offline.`
      };
    }
    
    return `[${part}] ${word}${translationText} - Definition not available without AI service. Please check your internet connection and try again.`;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Check if service is ready
  isReady() {
    return this.isInitialized;
  }
}

// Export singleton instance
export const bedrockService = new BedrockService();
