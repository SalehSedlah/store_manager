
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Prepare Google AI plugin configuration
const googleAIPluginOptions: { apiKey?: string } = {};
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (geminiApiKey) {
  googleAIPluginOptions.apiKey = geminiApiKey;
}

if (!googleAIPluginOptions.apiKey) {
  // This warning will now show in all environments if the key is missing
  console.error("CRITICAL: GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment variables. Genkit Google AI features will likely fail, potentially causing server errors.");
}


export const ai = genkit({
  plugins: [googleAI(googleAIPluginOptions)],
  model: 'googleai/gemini-2.0-flash',
});

