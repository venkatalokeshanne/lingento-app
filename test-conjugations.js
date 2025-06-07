// Test script to check comprehensive data generation for verbs
import { bedrockService } from './src/services/bedrockService.js';

async function testVerbConjugations() {
  console.log('Testing comprehensive data generation for verb "parler"...');
  
  try {
    const result = await bedrockService.generateComprehensiveWordData('parler', 'french', 'english');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    console.log('\n--- Checking specific fields ---');
    console.log('Part of speech:', result.partOfSpeech);
    console.log('Has conjugations:', !!result.conjugations);
    console.log('Conjugations keys:', result.conjugations ? Object.keys(result.conjugations) : 'None');
    
    if (result.conjugations) {
      console.log('\n--- Conjugation details ---');
      Object.entries(result.conjugations).forEach(([tense, forms]) => {
        console.log(`${tense}:`, forms);
      });
    }
    
  } catch (error) {
    console.error('Error testing verb conjugations:', error);
  }
}

testVerbConjugations();
