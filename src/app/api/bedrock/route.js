// AWS Bedrock API Route - Server-side AI functionality
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Use US East 1 for better Bedrock model availability
const BEDROCK_REGION = 'us-east-1';

const client = new BedrockRuntimeClient({
  region: BEDROCK_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    console.log('Bedrock API called');
    
    // Check AWS credentials
    if (!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || 
        !process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || 
        !process.env.NEXT_PUBLIC_AWS_REGION) {
      console.error('Missing AWS credentials');
      return Response.json({ error: 'AWS credentials not configured' }, { status: 500 });    }    const { action, word, translation, language, definition, partOfSpeech, prompt, temperature, timestamp, sessionId } = await request.json();
    console.log('Request parameters:', { action, word, translation, language, definition, partOfSpeech, prompt: prompt ? 'provided' : 'none', temperature, sessionId });

    // For generate action, we need a prompt instead of word/language
    if (action === 'generate' && !prompt) {
      return Response.json({ error: 'Missing required parameter: prompt' }, { status: 400 });
    }

    if (action !== 'generate' && (!word || !language)) {
      return Response.json({ error: 'Missing required parameters (word and language)' }, { status: 400 });
    }

    let aiPrompt;
    let maxTokens = 500;    switch (action) {
      case 'generate':
        aiPrompt = prompt;
        maxTokens = 1000; // Allow more tokens for reading/writing content
        break;
      case 'examples':
        aiPrompt = buildExamplePrompt(word, translation, language, definition);
        maxTokens = 600; // More tokens for examples
        break;
      case 'definition':
        // Check if it's a verb and if conjugation is requested
        if (partOfSpeech?.toLowerCase() === 'verb' || definition?.toLowerCase().includes('verb')) {
          aiPrompt = buildVerbConjugationPrompt(word, language, translation);
          maxTokens = 800;
        } else {
          aiPrompt = buildDefinitionPrompt(word, language, translation);
          maxTokens = 400;
        }
        break;
      case 'pronunciation':
        aiPrompt = buildPronunciationPrompt(word, language);
        maxTokens = 150;
        break;
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }// Try different models in order of preference
    const models = [
      'anthropic.claude-3-haiku-20240307-v1:0',
      'anthropic.claude-v2:1',
      'anthropic.claude-v2',
      'anthropic.claude-instant-v1'
    ];

    let response;
    let lastError;

    for (const modelId of models) {
      try {
        console.log(`Trying model: ${modelId}`);
        
        const command = new InvokeModelCommand({
          modelId,
          body: JSON.stringify({
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: maxTokens,
            temperature: action === 'examples' ? 0.7 : 0.3,            messages: [
              {
                role: 'user',
                content: aiPrompt
              }
            ]
          }),
          contentType: 'application/json',
          accept: 'application/json',
        });

        response = await client.send(command);
        console.log(`Successfully used model: ${modelId}`);
        break;
      } catch (error) {
        console.log(`Model ${modelId} failed:`, error.message);
        lastError = error;
        
        if (error.name === 'AccessDeniedException') {
          continue; // Try next model
        } else {
          throw error; // Other errors should be thrown immediately
        }
      }
    }

    if (!response) {
      throw new Error(`No available models. Last error: ${lastError?.message || 'Unknown error'}`);
    }    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    let result;
    if (action === 'examples') {
      result = parseExamples(responseBody.content[0].text);
    } else if (action === 'definition' && (partOfSpeech?.toLowerCase() === 'verb' || definition?.toLowerCase().includes('verb'))) {
      result = parseVerbConjugation(responseBody.content[0].text);
    } else {
      result = responseBody.content[0].text.trim();
    }return Response.json({ result });
  } catch (error) {
    console.error('Bedrock API error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      region: process.env.NEXT_PUBLIC_AWS_REGION
    });
    
    let errorMessage = 'Failed to generate AI content';
    let statusCode = 500;
    
    if (error.name === 'AccessDeniedException') {
      errorMessage = 'Access denied to Bedrock models. Please check your AWS permissions and model access in the Bedrock console.';
      statusCode = 403;
    } else if (error.name === 'ValidationException') {
      errorMessage = 'Invalid request parameters';
      statusCode = 400;
    } else if (error.name === 'ThrottlingException') {
      errorMessage = 'Request rate exceeded. Please try again later.';
      statusCode = 429;
    }
    
    return Response.json({ 
      error: errorMessage,
      details: error.message,
      name: error.name
    }, { status: statusCode });
  }
}

// Build prompt for example generation
function buildExamplePrompt(word, translation, language, definition) {
  return `Generate 3 practical example sentences using the ${language} word "${word}" (meaning: ${translation}).

Requirements:
- Examples should be appropriate for intermediate learners
- Show natural usage in everyday conversations
- Include context that helps understand the word's meaning
- Make examples culturally relevant and practical
- Keep each example under 15 words
${definition ? `- Consider this definition: ${definition}` : ''}

Format your response as a JSON array of strings, like this:
["Example sentence 1", "Example sentence 2", "Example sentence 3"]

Only return the JSON array, no other text.`;
}

// Build prompt for definition generation
function buildDefinitionPrompt(word, language, translation = '') {
  const translationContext = translation ? ` (meaning: ${translation})` : '';
  
  return `Provide a comprehensive definition for the ${language} word "${word}"${translationContext}.

Requirements:
- Start with the part of speech in brackets (e.g., [Noun], [Adjective], [Verb])
- Give a clear, concise definition
- Include key usage notes or contexts where this word is commonly used
- Mention any important grammatical information (gender, irregular forms, etc.)
- Include any cultural or contextual nuances
- Keep it under 100 words total

Format: [Part of Speech] Definition with usage notes.

Only return the definition, no other text.`;
}

// Build prompt for pronunciation generation
function buildPronunciationPrompt(word, language) {
  let languageSpecificInstructions = '';
  
  // Language-specific pronunciation rules
  if (language.toLowerCase() === 'french') {
    languageSpecificInstructions = `
French pronunciation rules:
- 'u' sounds like 'oo' in English
- 'ou' sounds like 'oo' in English  
- Silent final consonants in most cases
- 'r' is rolled/guttural
- Nasal vowels: 'an/en' = 'ahn', 'in/im' = 'an', 'on/om' = 'ohn', 'un/um' = 'uhn'
- 'tion' = 'see-ohn'
- 'lle' = 'l' (silent e)

Examples:
- "salut" = "sah-loo" (silent 't')
- "bonjour" = "bohn-zhoor"
- "merci" = "mer-see"
- "parlez" = "par-lay" (silent 'z')`;
  } else if (language.toLowerCase() === 'spanish') {
    languageSpecificInstructions = `
Spanish pronunciation rules:
- 'j' sounds like 'h' in English
- 'rr' is rolled
- 'ñ' sounds like 'ny'
- Stress usually on second-to-last syllable
- All vowels are pronounced clearly`;
  } else if (language.toLowerCase() === 'italian') {
    languageSpecificInstructions = `
Italian pronunciation rules:
- 'c' before 'e' or 'i' = 'ch'
- 'g' before 'e' or 'i' = 'j'
- 'gli' = 'lyee'
- Double consonants are pronounced longer`;
  }

  return `You are an expert linguist. Provide a phonetic pronunciation guide for the ${language} word "${word}".

${languageSpecificInstructions}

Requirements:
- Provide ONLY the English-style phonetic pronunciation using simple English sounds
- Use hyphens to separate syllables  
- Use common English letter combinations to represent sounds
- DO NOT use IPA symbols or complex notation
- BE VERY ACCURATE to native pronunciation
- Consider silent letters and language-specific rules

Examples of good format:
- "sah-loo" not "sah-loot" 
- "bohn-zhoor" not "bon-jour"
- "mer-see" not "mer-ci"

Return ONLY the phonetic pronunciation, nothing else.`;
}

// Build prompt for verb conjugation generation
function buildVerbConjugationPrompt(word, language, translation = '') {
  const translationContext = translation ? ` (meaning: ${translation})` : '';
  
  return `Generate a verb conjugation table for the ${language} verb "${word}"${translationContext}.

Return your response as a JSON object with this exact structure:

{
  "definition": "[Verb] Brief definition of the word",
  "conjugations": {
    "present": {
      "je": "conjugated form",
      "tu": "conjugated form",
      "il/elle/on": "conjugated form",
      "nous": "conjugated form",
      "vous": "conjugated form",
      "ils/elles": "conjugated form"
    },
    "past": {
      "je": "conjugated form",
      "tu": "conjugated form",
      "il/elle/on": "conjugated form",
      "nous": "conjugated form",
      "vous": "conjugated form",
      "ils/elles": "conjugated form"
    },
    "passe": {
      "je": "conjugated form",
      "tu": "conjugated form",
      "il/elle/on": "conjugated form",
      "nous": "conjugated form",
      "vous": "conjugated form",
      "ils/elles": "conjugated form"
    },
    "future": {
      "je": "conjugated form",
      "tu": "conjugated form",
      "il/elle/on": "conjugated form",
      "nous": "conjugated form",
      "vous": "conjugated form",
      "ils/elles": "conjugated form"
    },
    "imperfect": {
      "je": "conjugated form",
      "tu": "conjugated form",
      "il/elle/on": "conjugated form",
      "nous": "conjugated form",
      "vous": "conjugated form",
      "ils/elles": "conjugated form"
    }
  },
  "notes": ["Any important notes about the verb"]
}

Requirements:
- Include ONLY these 5 tenses: present, past, passe (Passé Composé), future, imperfect
- Use the exact pronoun keys shown above
- Provide the conjugated forms for each person
- Keep the definition brief and clear
- Add any important notes about irregular forms or usage

Return ONLY the JSON object, no other text.`;
}

// Parse examples from AI response
function parseExamples(response) {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 3); // Ensure we only return 3 examples
    }
  } catch (error) {
    // If JSON parsing fails, try to extract examples from text
    const lines = response.split('\n').filter(line => line.trim());
    const examples = [];
    
    for (const line of lines) {
      if (line.match(/^\d+\.|\-|\*/) || line.startsWith('"')) {
        let example = line.replace(/^\d+\.\s*|\-\s*|\*\s*|^"|"$/g, '').trim();
        if (example && examples.length < 3) {
          examples.push(example);
        }
      }
    }
    
    return examples.length > 0 ? examples : ['Unable to generate examples at this time.'];
  }
  
  return ['Unable to generate examples at this time.'];
}

// Parse verb conjugation from AI response
function parseVerbConjugation(response) {
  try {
    // First try to parse as JSON
    const jsonResponse = JSON.parse(response);
    if (jsonResponse.definition && jsonResponse.conjugations) {
      // Transform the JSON structure to match our expected format
      const conjugationTable = [];
      
      Object.entries(jsonResponse.conjugations).forEach(([tense, forms]) => {
        const tenseEntry = {
          tense: tense.charAt(0).toUpperCase() + tense.slice(1), // Capitalize first letter
          forms: []
        };
        
        Object.entries(forms).forEach(([pronoun, conjugatedForm]) => {
          tenseEntry.forms.push(`${pronoun}: ${conjugatedForm}`);
        });
        
        conjugationTable.push(tenseEntry);
      });
      
      return {
        type: 'conjugation',
        definition: jsonResponse.definition,
        conjugationTable,
        notes: jsonResponse.notes || [],
        rawText: response
      };
    }
  } catch (jsonError) {
    console.log('Not valid JSON, trying text parsing...');
    
    // Fallback to text parsing if JSON fails
    const lines = response.split('\n').filter(line => line.trim());
    
    let definition = '';
    let conjugationTable = [];
    let notes = [];
    
    let currentTense = '';
    let currentForms = [];
    let inNotes = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Extract definition (look for [Verb] or just take first meaningful line as definition)
      if (!definition) {
        if (line.includes('[Verb]')) {
          definition = line;
          continue;
        } else if (line && !line.toLowerCase().includes('conjugation') && 
                   !line.toLowerCase().includes('table') && 
                   !line.match(/^(present|past|passé|future|imperfect)/i)) {
          // If we haven't found a [Verb] line yet, use the first meaningful line
          definition = `[Verb] ${line}`;
          continue;
        }
      }
      
      // Check if we're entering notes section
      if (line.toLowerCase().includes('notes:') || line.toLowerCase().includes('note:')) {
        // Save current tense if we have one
        if (currentTense && currentForms.length > 0) {
          conjugationTable.push({ tense: currentTense, forms: [...currentForms] });
          currentForms = [];
        }
        inNotes = true;
        continue;
      }
      
      if (inNotes) {
        if (line.startsWith('-') || line.startsWith('•')) {
          notes.push(line);
        }
        continue;
      }
      
      // Check if this is a tense header - only accept the 5 desired tenses
      const allowedTenses = ['Present', 'Past', 'Passé', 'Future', 'Imperfect'];
      
      if (allowedTenses.some(tense => line.includes(tense))) {
        // Save previous tense if we have one
        if (currentTense && currentForms.length > 0) {
          conjugationTable.push({ tense: currentTense, forms: [...currentForms] });
        }
        
        // Start new tense
        currentTense = line.replace(/\s*:?\s*$/, '');
        currentForms = [];
        continue;
      }
        // Check if this looks like a conjugation form (contains pronouns)
      // Support multiple language pronoun patterns
      const pronounPatterns = [
        /^(je|tu|il|elle|on|nous|vous|ils|elles|qu?['']?\w*)\s+/i, // French
        /^(I|you|he|she|it|we|they)\s+/i, // English
        /^(yo|tú|él|ella|nosotros|vosotros|ellos|ellas)\s+/i, // Spanish
        /^(ich|du|er|sie|es|wir|ihr|sie)\s+/i, // German
        /^(io|tu|lui|lei|noi|voi|loro)\s+/i, // Italian
        /^(eu|tu|ele|ela|nós|vós|eles|elas)\s+/i // Portuguese
      ];
      
      if (pronounPatterns.some(pattern => line.match(pattern))) {
        if (currentTense) {
          currentForms.push(line);
        } else {
          // If no tense header found yet, create a general one
          if (!currentTense) {
            currentTense = 'Conjugation';
          }
          currentForms.push(line);
        }
      }
    }
    
    // Add the last tense if we have one
    if (currentTense && currentForms.length > 0) {
      conjugationTable.push({ tense: currentTense, forms: [...currentForms] });
    }
    
    return {
      type: 'conjugation',
      definition: definition || '[Verb] Definition not found',
      conjugationTable,
      notes: notes.length > 0 ? notes : undefined,
      rawText: response
    };
  }
  
  return {
    type: 'conjugation',
    definition: '[Verb] Parsing error',
    conjugationTable: [],
    notes: ['Error parsing conjugation data'],
    rawText: response
  };
}