// AWS Bedrock Service - Centralized AI functionality
'use client';

// Helper function to get ordered French pronouns
function getOrderedFrenchPronouns() {
  return ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
}

// Helper function to order conjugations by French pronoun order
function orderConjugations(conjugations) {
  if (!conjugations || typeof conjugations !== 'object') {
    return conjugations;
  }
  
  const orderedPronouns = getOrderedFrenchPronouns();
  const ordered = {};
  
  // First, add pronouns in the correct order
  orderedPronouns.forEach(pronoun => {
    if (conjugations[pronoun]) {
      ordered[pronoun] = conjugations[pronoun];
    }
  });
  
  // Then add any remaining pronouns that might not match exactly
  Object.entries(conjugations).forEach(([pronoun, form]) => {
    if (!ordered[pronoun]) {
      ordered[pronoun] = form;
    }
  });
  
  return ordered;
}

class BedrockService {
  constructor() {
    this.cache = new Map();
    this.isInitialized = true; // Always ready since we use API routes
  }// Generate examples for a word with context
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
      return this.generateFallbackExamples(word, translation, language);    }
  }  // Generate text based on a prompt
  async generateText(prompt) {
    // For text generation, we NEVER cache to ensure unique content every time
    // Add multiple randomness factors to guarantee uniqueness
    const timestamp = new Date().getTime();
    const randomSalt = Math.random().toString(36).substring(2, 15);
    const sessionId = Math.random() * 1000000;
    
    // Enhance prompt with uniqueness guarantees
    const enhancedPrompt = `${prompt}

ABSOLUTE UNIQUENESS REQUIREMENT: Generate content that is completely different from any previous generation. Session ID: ${sessionId}, Timestamp: ${timestamp}, Salt: ${randomSalt}

This must be a BRAND NEW response that has never been generated before.`;
    
    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          action: 'generate',
          prompt: enhancedPrompt,
          temperature: 0.9, // High temperature for more creativity
          timestamp: timestamp,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bedrock API error:', errorData);
        throw new Error(errorData.error || 'Failed to generate text');
      }

      const data = await response.json();
      const result = data.result;
      
      // DO NOT cache text generation results to ensure uniqueness
      console.log('Generated unique text for session:', sessionId);
      
      return result;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
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
  }  // Generate pronunciation guide
  async generatePronunciation(word, language) {
    // Don't cache pronunciation to allow for regeneration with different words
    // or use a timestamp-based cache key for shorter cache duration
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 5)); // 5-minute cache
    const cacheKey = `pronunciation_${word}_${language}_${timestamp}`;
    
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
      let pronunciation = data.result;
      
      // Clean up pronunciation: remove any extra text and keep only the phonetic part
      pronunciation = this.cleanPronunciation(pronunciation);
      
      // Cache the result with shorter duration
      this.cache.set(cacheKey, pronunciation);
      
      return pronunciation;
    } catch (error) {
      console.error('Error generating pronunciation:', error);
      throw error;
    }
  }

  // Clean pronunciation by removing any extra formatting and keeping only the phonetic pronunciation
  cleanPronunciation(pronunciation) {
    if (!pronunciation) return '';
    
    // Remove any quotes, slashes, or parentheses that might be added by AI
    pronunciation = pronunciation.replace(/["/\[\]()]/g, '').trim();
    
    // Remove common prefixes that AI might add
    pronunciation = pronunciation.replace(/^(pronunciation:|phonetic:|sounds like:?)\s*/i, '');
    
    // Extract just the phonetic part if there are multiple formats provided
    // Look for hyphenated phonetic pronunciation
    const phoneticMatch = pronunciation.match(/([a-z]+-[a-z\-]+)/i);
    if (phoneticMatch) {
      return phoneticMatch[1];
    }
    
        if (pronunciation.includes('/')) {
      const afterSlash = pronunciation.replace(/^[^/]*\/[^/]*\/\s*/, '');
      if (afterSlash && afterSlash !== pronunciation) {
        return afterSlash.replace(/^\(|\)$/g, ''); // Remove wrapping parentheses if any
      }
    }
    // If no hyphens, just return the cleaned version
    return pronunciation.trim();
    
    // If no parentheses found, but has forward slashes, remove everything before the first space after closing slash

    
    // Fallback: return as-is if no pattern matches
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
          .replace(/\s*\(.*?\)\s*/g, '') // Remove parenthetical explanations          .replace(/[àáâãäå]/g, 'a')      // Remove accents from a
          .replace(/[èéêë]/g, 'e')          // Remove accents from e
          .replace(/[ìíîï]/g, 'i')          // Remove accents from i
          .replace(/[òóôõö]/g, 'o')          // Remove accents from o
          .replace(/[ùúûü]/g, 'u')          // Remove accents from u
          .replace(/[ç]/g, 'c')             // Convert c with cedilla to c
          .replace(/[ñ]/g, 'n')             // Convert n with tilde to n
          .replace(/[^a-z0-9\s]/g, '')    // Remove non-alphanumeric except spaces
          .replace(/\s+/g, ' ')           // Normalize spaces
          .trim();
          // Map language-specific tense names to standardized English equivalents
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
      }    });
    
    // Apply ordering to all conjugations before returning
    Object.keys(conjugations).forEach(tense => {
      conjugations[tense] = orderConjugations(conjugations[tense]);
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

  // Generate word suggestions based on partial input
  async generateWordSuggestions(partialWord, language) {
    // Don't cache suggestions to allow for fresh suggestions each time
    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'wordSuggestions',
          partialWord,
          language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bedrock word suggestions API error:', errorData);
        throw new Error(errorData.error || 'Failed to generate word suggestions');
      }

      const data = await response.json();
      const suggestions = data.result;
      
      // Parse suggestions if they come as a string
      if (typeof suggestions === 'string') {
        try {
          return JSON.parse(suggestions);
        } catch (e) {
          // If parsing fails, split by lines and clean up
          return suggestions.split('\n')
            .filter(line => line.trim())
            .slice(0, 5)
            .map(line => line.trim().replace(/^[\d\-\*\.\s]+/, ''));
        }
      }
      
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (error) {
      console.error('Error generating word suggestions:', error);
      // Return fallback suggestions
      return this.generateFallbackSuggestions(partialWord, language);
    }
  }
  // Generate fallback suggestions when AI is not available
  generateFallbackSuggestions(partialWord, language) {
    // Expanded vocabulary for better word completion
    const commonWords = {
      french: [
        'regarder (to look)', 'régime (diet)', 'région (region)', 'régler (to adjust)', 'régulier (regular)',
        'bonjour (hello)', 'bonsoir (good evening)', 'beaucoup (a lot)', 'bien (well)', 'blanc (white)',
        'chat (cat)', 'chien (dog)', 'chez (at/to)', 'chose (thing)', 'comme (like/as)',
        'dans (in)', 'depuis (since)', 'dernier (last)', 'devant (in front of)', 'dire (to say)',
        'eau (water)', 'école (school)', 'écrire (to write)', 'enfant (child)', 'entre (between)',
        'faire (to do)', 'famille (family)', 'femme (woman)', 'fenêtre (window)', 'fois (time)',
        'grand (big)', 'groupe (group)', 'guerre (war)', 'heure (hour)', 'histoire (story)',
        'jamais (never)', 'jardin (garden)', 'jeune (young)', 'jouer (to play)', 'jour (day)',
        'livre (book)', 'long (long)', 'main (hand)', 'maison (house)', 'manger (to eat)',
        'nouveau (new)', 'nuit (night)', 'partir (to leave)', 'petit (small)', 'place (place)',
        'quel (which)', 'question (question)', 'raison (reason)', 'répondre (to answer)', 'rester (to stay)',
        'savoir (to know)', 'semaine (week)', 'sortir (to go out)', 'temps (time)', 'travail (work)',
        'venir (to come)', 'ville (city)', 'vivre (to live)', 'voir (to see)', 'vouloir (to want)'
      ],
      spanish: [
        'regalo (gift)', 'región (region)', 'regla (rule)', 'reír (to laugh)', 'reloj (clock)',
        'hola (hello)', 'casa (house)', 'agua (water)', 'tiempo (time)', 'año (year)',
        'día (day)', 'noche (night)', 'mañana (morning)', 'tarde (afternoon)', 'semana (week)',
        'mes (month)', 'vida (life)', 'mundo (mundo)', 'país (country)', 'ciudad (city)',
        'persona (person)', 'hombre (man)', 'mujer (woman)', 'niño (child)', 'familia (family)',
        'amigo (friend)', 'amor (love)', 'trabajo (work)', 'escuela (school)', 'libro (book)',
        'coche (car)', 'comida (food)', 'dinero (money)', 'puerta (door)', 'ventana (window)'
      ],
      italian: [
        'regalo (gift)', 'regione (region)', 'regola (rule)', 'ridere (to laugh)', 'ricordare (to remember)',
        'ciao (hello)', 'casa (house)', 'acqua (water)', 'tempo (time)', 'anno (year)',
        'giorno (day)', 'notte (night)', 'mattina (morning)', 'sera (evening)', 'settimana (week)',
        'mese (month)', 'vita (life)', 'mondo (world)', 'paese (country)', 'città (city)',
        'persona (person)', 'uomo (man)', 'donna (woman)', 'bambino (child)', 'famiglia (family)',
        'amico (friend)', 'amore (love)', 'lavoro (work)', 'scuola (school)', 'libro (book)'
      ],
      german: [
        'regen (rain)', 'regel (rule)', 'region (region)', 'reden (to talk)', 'reisen (to travel)',
        'hallo (hello)', 'haus (house)', 'wasser (water)', 'zeit (time)', 'jahr (year)',
        'tag (day)', 'nacht (night)', 'morgen (morning)', 'abend (evening)', 'woche (week)',
        'monat (month)', 'leben (life)', 'welt (world)', 'land (country)', 'stadt (city)',
        'person (person)', 'mann (man)', 'frau (woman)', 'kind (child)', 'familie (family)',
        'freund (friend)', 'liebe (love)', 'arbeit (work)', 'schule (school)', 'buch (book)'
      ],
      portuguese: [
        'regalo (gift)', 'região (region)', 'regra (rule)', 'rir (to laugh)', 'relógio (clock)',
        'olá (hello)', 'casa (house)', 'água (water)', 'tempo (time)', 'ano (year)',
        'dia (day)', 'noite (night)', 'manhã (morning)', 'tarde (afternoon)', 'semana (week)',
        'mês (month)', 'vida (life)', 'mundo (world)', 'país (country)', 'cidade (city)',
        'pessoa (person)', 'homem (man)', 'mulher (woman)', 'criança (child)', 'família (family)',
        'amigo (friend)', 'amor (love)', 'trabalho (work)', 'escola (school)', 'livro (book)'
      ]
    };

    const languageWords = commonWords[language.toLowerCase()] || commonWords.french;
    
    // Filter based on partial word if it exists
    if (partialWord && partialWord.length > 0) {
      const filtered = languageWords.filter(word => 
        word.toLowerCase().startsWith(partialWord.toLowerCase())
      );
      if (filtered.length > 0) {
        return filtered.slice(0, 5); // Return up to 5 suggestions
      }
    }
    
    return languageWords.slice(0, 5); // Return first 5 if no match
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Check if service is ready
  isReady() {
    return this.isInitialized;
  }


  // Generate comprehensive word data in a single AI request
  async generateComprehensiveWordData(word, language, userNativeLanguage = 'english') {
    // Don't cache comprehensive data to ensure fresh content
    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'comprehensive',
          word,
          language,
          userNativeLanguage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bedrock comprehensive API error:', errorData);
        throw new Error(errorData.error || 'Failed to generate comprehensive word data');
      }

      const data = await response.json();
      let result = data.result;
      
      // Parse result if it comes as a string
      if (typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch (e) {
          console.error('Failed to parse comprehensive data JSON:', e);
          throw new Error('Invalid response format from AI');
        }
      }
      
      // Transform verb conjugations if present
      if (result.conjugations && typeof result.conjugations === 'object') {
        result.conjugations = this.transformComprehensiveConjugations(result.conjugations);
      }
      
      return result;
    } catch (error) {
      console.error('Error generating comprehensive word data:', error);
      throw error;
    }
  }
  // Transform comprehensive conjugations to match UI expectations
  transformComprehensiveConjugations(conjugations) {
    if (!conjugations || conjugations === null) {
      return null;
    }
    
    const transformed = {};
    
    // Handle both object format and existing transformed format
    Object.entries(conjugations).forEach(([tense, forms]) => {
      if (typeof forms === 'object' && forms !== null) {
        // Order the conjugations for each tense
        transformed[tense] = orderConjugations(forms);
      }
    });
    
    return Object.keys(transformed).length > 0 ? transformed : null;
  }
}

// Export singleton instance
export const bedrockService = new BedrockService();
