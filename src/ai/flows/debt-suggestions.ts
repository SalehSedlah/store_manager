// debt-suggestions.ts
'use server';

/**
 * @fileOverview AI assistant for debt management, providing credit limit suggestions based on debtor data.
 *
 * - suggestCreditLimits - Analyzes debt data and suggests optimal credit limits for each debtor.
 * - SuggestCreditLimitsInput - Input type for the suggestCreditLimits function.
 * - SuggestCreditLimitsOutput - Output type for the suggestCreditLimits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebtorSchema = z.object({
  debtorName: z.string().describe('Name of the debtor'),
  paymentHistory: z.string().describe('Payment history of the debtor'),
  overallDebtAmount: z.number().describe('Overall debt amount owed by the debtor'),
  currentCreditLimit: z.number().describe('Current credit limit for the debtor'),
});

const SuggestCreditLimitsInputSchema = z.array(DebtorSchema).describe('Array of debtor objects with their debt information.');
export type SuggestCreditLimitsInput = z.infer<typeof SuggestCreditLimitsInputSchema>;

const CreditLimitSuggestionSchema = z.object({
  debtorName: z.string().describe('Name of the debtor'),
  suggestedCreditLimit: z.number().describe('Suggested credit limit for the debtor'),
  reasoning: z.string().describe('Reasoning behind the suggested credit limit'),
});

const SuggestCreditLimitsOutputSchema = z.array(CreditLimitSuggestionSchema).describe('Array of credit limit suggestions for each debtor.');
export type SuggestCreditLimitsOutput = z.infer<typeof SuggestCreditLimitsOutputSchema>;

export async function suggestCreditLimits(input: SuggestCreditLimitsInput): Promise<SuggestCreditLimitsOutput> {
  return suggestCreditLimitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCreditLimitsPrompt',
  input: {schema: SuggestCreditLimitsInputSchema},
  output: {schema: SuggestCreditLimitsOutputSchema},
  prompt: `You are an AI assistant specializing in debt management and risk assessment.
  Analyze the provided debt data for each debtor and suggest an optimal credit limit based on their payment history and overall debt amount.
  Provide a clear reasoning for each suggested credit limit.

  Debtor Data: {{{json input}}}

  Based on this data, provide an array of credit limit suggestions. Ensure the suggestions minimize risk and maximize returns.
  Format your response as a JSON array of CreditLimitSuggestion objects.
  `,
});

const suggestCreditLimitsFlow = ai.defineFlow(
  {
    name: 'suggestCreditLimitsFlow',
    inputSchema: SuggestCreditLimitsInputSchema,
    outputSchema: SuggestCreditLimitsOutputSchema,
  },
  async input => {
    const {output} = await prompt({input});
    return output!;
  }
);
