
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Prepare Google AI plugin configuration
const googleAIPluginOptions: { apiKey?: string } = {};
if (process.env.GEMINI_API_KEY) {
  googleAIPluginOptions.apiKey = process.env.GEMINI_API_KEY;
} else if (process.env.GOOGLE_API_KEY) { // Also check for GOOGLE_API_KEY as a fallback
  googleAIPluginOptions.apiKey = process.env.GOOGLE_API_KEY;
}

if (!googleAIPluginOptions.apiKey && process.env.NODE_ENV !== 'production') {
  console.warn("GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment variables. Genkit Google AI features may not work.");
}


export const ai = genkit({
  plugins: [googleAI(googleAIPluginOptions)],
  model: 'googleai/gemini-2.0-flash',
});
