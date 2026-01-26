
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually read .env.local to get the key
const envPath = path.join(__dirname, '.env.local');
let apiKey = '';
let modelName = 'gemini-1.5-flash';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const keyMatch = envContent.match(/GOOGLE_API_KEY=(.+)/);
  if (keyMatch) {
    apiKey = keyMatch[1].trim();
  }
  const modelMatch = envContent.match(/GOOGLE_MODEL=(.+)/);
  if (modelMatch) {
    modelName = modelMatch[1].trim();
  }
} catch (e) {
  console.error("Could not read .env.local");
}

console.log("Testing with:");
console.log("Model:", modelName);
console.log("Key Length:", apiKey ? apiKey.length : 0);
console.log("Key (first 5):", apiKey ? apiKey.substring(0, 5) : 'NONE');

if (!apiKey) {
  console.error("ERROR: No API Key found in .env.local");
  process.exit(1);
}

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We saw gemini-2.5-flash in the list, let's try it and others
    const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
    
    for (const modelName of modelsToTry) {
        console.log(`\nTrying model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}! Response:`, response.text());
            return; // Exit on first success
        } catch (e) {
            console.log(`Failed with ${modelName}:`);
            console.log(e.message.split('\n')[0]);
        }
    }

  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

test();
