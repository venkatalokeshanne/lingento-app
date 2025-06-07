// Test script for comprehensive word data generation
async function testComprehensiveAPI() {
  const testWords = [
    { word: 'parler', language: 'french', expected: 'verb' },
    { word: 'chat', language: 'french', expected: 'noun' },
    { word: 'hablar', language: 'spanish', expected: 'verb' }
  ];

  for (const test of testWords) {
    console.log(`\n=== Testing ${test.word} (${test.language}) ===`);
    
    try {
      const response = await fetch('http://localhost:3001/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'comprehensive',
          word: test.word,
          language: test.language,
          userNativeLanguage: 'english'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        continue;
      }

      const data = await response.json();
      console.log('Result:', data.result);
      
      if (data.result.partOfSpeech && data.result.partOfSpeech.toLowerCase().includes('verb')) {
        console.log('This is a verb - checking conjugations...');
        if (data.result.conjugations) {
          console.log('✅ Conjugations found:', Object.keys(data.result.conjugations));
        } else {
          console.log('❌ No conjugations found for verb');
        }
      } else {
        console.log('Not a verb - conjugations should be null:', data.result.conjugations);
      }
      
    } catch (error) {
      console.error('Test failed:', error);
    }
  }
}

// Run the test
testComprehensiveAPI();
