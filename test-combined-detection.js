// Test script for combined language detection and word suggestions
const fetch = require('node-fetch');

// Mock the global fetch if needed
if (!global.fetch) {
  global.fetch = fetch;
}

async function testCombinedDetectionAndSuggestions() {
  const API_URL = 'http://localhost:3000/api/bedrock';
  
  console.log('🧪 Testing Combined Language Detection and Word Suggestions');
  console.log('================================================\n');

  const testCases = [
    {
      partialWord: 'bon',
      userLearningLanguage: 'french',
      userNativeLanguage: 'english',
      description: 'French partial word "bon"'
    },
    {
      partialWord: 'hel',
      userLearningLanguage: 'french', 
      userNativeLanguage: 'english',
      description: 'English partial word "hel"'
    },
    {
      partialWord: 'sal',
      userLearningLanguage: 'french',
      userNativeLanguage: 'english',
      description: 'Ambiguous partial word "sal" (could be French or English)'
    },
    {
      partialWord: 'que',
      userLearningLanguage: 'french',
      userNativeLanguage: 'english',
      description: 'French partial word "que"'
    },
    {
      partialWord: 'com',
      userLearningLanguage: 'spanish',
      userNativeLanguage: 'english',
      description: 'Spanish/English partial word "com"'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.description}`);
    console.log(`   Input: "${testCase.partialWord}"`);
    console.log(`   Learning: ${testCase.userLearningLanguage}, Native: ${testCase.userNativeLanguage}`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'languageDetectionAndSuggestions',
          partialWord: testCase.partialWord,
          userLearningLanguage: testCase.userLearningLanguage,
          userNativeLanguage: testCase.userNativeLanguage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`   ❌ API Error: ${errorData.error}`);
        continue;
      }

      const data = await response.json();
      const result = data.result;
      
      console.log(`   ✅ Detected Language: ${result.detectedLanguage}`);
      console.log(`   📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`   💭 Reason: ${result.reason || 'Not provided'}`);
      console.log(`   📝 Suggestions (${result.suggestions?.length || 0}):`);
      
      if (result.suggestions && result.suggestions.length > 0) {
        result.suggestions.forEach((suggestion, index) => {
          console.log(`      ${index + 1}. ${suggestion}`);
        });
      } else {
        console.log(`      No suggestions provided`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('   ────────────────────────────────────────');
  }

  console.log('\n✨ Testing complete!\n');
  console.log('💡 Benefits of the combined approach:');
  console.log('   • Single API call instead of two separate requests');
  console.log('   • Consistent language detection and suggestions');
  console.log('   • Better performance and reduced latency');
  console.log('   • Automatic translation direction handling');
}

// Run the test
testCombinedDetectionAndSuggestions().catch(console.error);
