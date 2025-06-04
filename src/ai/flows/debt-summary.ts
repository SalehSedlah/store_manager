'use server';

/**
 * @fileOverview AI flow to provide a summary of total debts, breakdown by debtor, and overall risk assessment.
 *
 * - getDebtSummary - A function that returns the debt summary.
 * - DebtSummaryInput - The input type for the getDebtSummary function.
 * - DebtSummaryOutput - The return type for the getDebtSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebtSummaryInputSchema = z.object({
  totalDebt: z.number().describe('The total debt amount.'),
  numberOfDebtors: z.number().describe('The number of debtors.'),
  averageDebtPerDebtor: z.number().describe('The average debt per debtor.'),
  largestDebt: z.number().describe('The largest single debt amount.'),
  creditLimitUtilization: z
    .number()
    .describe(
      'The percentage of total credit limit that is currently utilized.'
    ),
});
export type DebtSummaryInput = z.infer<typeof DebtSummaryInputSchema>;

const DebtSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the total debt situation.'),
  riskAssessment: z
    .string()
    .describe('An assessment of the overall risk level.'),
  recommendations: z
    .string()
    .describe('Recommendations for managing the debt.'),
});
export type DebtSummaryOutput = z.infer<typeof DebtSummaryOutputSchema>;

export async function getDebtSummary(input: DebtSummaryInput): Promise<DebtSummaryOutput> {
  return debtSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'debtSummaryPrompt',
  input: {schema: DebtSummaryInputSchema},
  output: {schema: DebtSummaryOutputSchema},
  prompt: `You are a financial advisor providing debt summaries and risk assessments.

  Based on the following information, provide a summary of the total debt situation, a risk assessment, and recommendations for managing the debt.

  Total Debt: {{{totalDebt}}}
  Number of Debtors: {{{numberOfDebtors}}}
  Average Debt Per Debtor: {{{averageDebtPerDebtor}}}
  Largest Debt: {{{largestDebt}}}
  Credit Limit Utilization: {{{creditLimitUtilization}}}%
  `,
});

const debtSummaryFlow = ai.defineFlow(
  {
    name: 'debtSummaryFlow',
    inputSchema: DebtSummaryInputSchema,
    outputSchema: DebtSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
