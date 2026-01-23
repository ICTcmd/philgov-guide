import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
let apiKey = '';

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GOOGLE_API_KEY=(.+)/);
    if (match) {
      apiKey = match[1].trim();
    }
  }
} catch (e) {
  console.error("Error reading .env.local:", e);
}

if (!apiKey) {
  console.error("❌ No GOOGLE_API_KEY found in .env.local");
  process.exit(1);
}

console.log(`Checking API Key: ${apiKey.substring(0, 10)}...`);

async function testKey() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Trying model: gemini-2.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    try {
        const result = await model.generateContent("Reply 'Hello' if you are working.");
        const response = await result.response;
        console.log("✅ gemini-2.5-flash WORKED!");
        console.log("Response:", response.text());
        return;
    } catch (e) {
        console.log("⚠️ gemini-2.5-flash failed:", e.message);
    }

  } catch (error) {
    console.error("❌ Verification Failed:");
    console.error(error.message);
  }
}

testKey();
