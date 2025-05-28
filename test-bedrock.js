// Test script to check Bedrock access
const { BedrockRuntimeClient, ListFoundationModelsCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

async function testBedrock() {
  try {
    console.log('Testing Bedrock access...');
    console.log('Region:', process.env.NEXT_PUBLIC_AWS_REGION);
    
    // Try to list available models
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    
    console.log('Available models:');
    response.modelSummaries.forEach(model => {
      console.log(`- ${model.modelId} (${model.modelName})`);
    });
    
  } catch (error) {
    console.error('Bedrock test failed:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      statusCode: error.statusCode
    });
  }
}

testBedrock();
