
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Prepare Google AI plugin configuration
const googleAIPluginOptions: { apiKey?: string } = {};
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (geminiApiKey) {
  googleAIPluginOptions.apiKey = geminiApiKey;
}

if (!googleAIPluginOptions.apiKey) {
  const errorMessage = "CRITICAL_STARTUP_ERROR: GEMINI_API_KEY or GOOGLE_API_KEY is not set in environment variables. Genkit Google AI features cannot be initialized, and the application server will now terminate. Please set this environment variable in your Google Cloud Run service configuration for Firebase Hosting.";
  console.error(errorMessage);
  // Throw an error to ensure the server process stops and logs this critical failure.
  throw new Error(errorMessage);
}


export const ai = genkit({
  plugins: [googleAI(googleAIPluginOptions)],
  model: 'googleai/gemini-2.0-flash',
});
