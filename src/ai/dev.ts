import { config } from 'dotenv';
config();

import '@/ai/flows/debt-summary.ts';
import '@/ai/flows/debt-suggestions.ts';
import '@/ai/flows/debtor-risk-assessment.ts';