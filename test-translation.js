// Test script for translation service
console.log('Testing translation service improvements...');

async function testTranslations() {
  try {
    console.log('\n=== Testing Common Word Mappings ===');
    
    // Test English to French
    const testWords = [
      { word: 'what', source: 'english', target: 'french', expected: 'quoi' },
      { word: 'who', source: 'english', target: 'french', expected: 'qui' },
      { word: 'where', source: 'english', target: 'french', expected: 'où' },
      { word: 'when', source: 'english', target: 'french', expected: 'quand' },
      { word: 'why', source: 'english', target: 'french', expected: 'pourquoi' },
      { word: 'how', source: 'english', target: 'french', expected: 'comment' }
    ];

    for (const test of testWords) {
      console.log(`\nTesting: "${test.word}" (${test.source} → ${test.target})`);
      
      try {
        const response = await fetch('http://localhost:3000/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: test.word,
            sourceLanguage: test.source,
            targetLanguage: test.target
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const result = data.translatedText.toLowerCase();
          const expected = test.expected.toLowerCase();
          
          if (result === expected) {
            console.log(`✅ PASS: Got "${data.translatedText}" (expected "${test.expected}")`);
          } else {
            console.log(`❌ FAIL: Got "${data.translatedText}" but expected "${test.expected}"`);
          }
        } else {
          console.log(`❌ API Error: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

    console.log('\n=== Testing Comprehensive AI Translation ===');
    
    // Test comprehensive data generation
    const comprehensiveTest = {
      word: 'What',
      language: 'english',
      userNativeLanguage: 'french'
    };

    console.log(`\nTesting comprehensive: "${comprehensiveTest.word}" (${comprehensiveTest.language})`);
    
    try {
      const response = await fetch('http://localhost:3000/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'comprehensive',
          word: comprehensiveTest.word,
          language: comprehensiveTest.language,
          userNativeLanguage: comprehensiveTest.userNativeLanguage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AI Response:', data.result);
        
        if (data.result.translation) {
          const aiTranslation = data.result.translation.toLowerCase();
          if (aiTranslation.includes('quoi') || aiTranslation.includes('que')) {
            console.log(`✅ AI translation looks good: "${data.result.translation}"`);
          } else {
            console.log(`⚠️  AI translation might need improvement: "${data.result.translation}"`);
          }
        }
      } else {
        console.log(`❌ AI API Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ AI Error: ${error.message}`);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run tests
testTranslations();
