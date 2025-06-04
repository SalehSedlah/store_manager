// src/ai/flows/debtor-risk-assessment.ts
'use server';

/**
 * @fileOverview Assesses the risk associated with a debtor based on their payment behavior, credit score, and debt amount.
 *
 * - assessDebtorRisk - A function that assesses the risk associated with a debtor.
 * - DebtorRiskAssessmentInput - The input type for the assessDebtorRisk function.
 * - DebtorRiskAssessmentOutput - The return type for the assessDebtorRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebtorRiskAssessmentInputSchema = z.object({
  paymentBehavior: z
    .string()
    .describe(
      'Description of the debtor payment behavior like payment history and consistency.'
    ),
  creditScore: z
    .number()
    .optional()
    .describe('The credit score of the debtor, if available.'),
  debtAmount: z.number().describe('The total debt amount owed by the debtor.'),
  creditLimit: z.number().optional().describe('The credit limit assigned to the debtor.'),
});
export type DebtorRiskAssessmentInput = z.infer<typeof DebtorRiskAssessmentInputSchema>;

const DebtorRiskAssessmentOutputSchema = z.object({
  riskLevel: z
    .string()
    .describe(
      'The risk level associated with the debtor (e.g., High, Medium, Low).' + 
      'Consider payment behavior, debt amount, and credit score when determining risk. ' +
      'If a credit limit is provided, also assess if the debt amount exceeds the credit limit.'
    ),
  riskFactors: z
    .string()
    .describe(
      'The key factors contributing to the assigned risk level, with justification.'
    ),
  suggestedActions: z
    .string()
    .describe(
      'Suggested actions for managing the debtor based on their risk level like adjusting credit limit or contacting the debtor.'
    ),
});
export type DebtorRiskAssessmentOutput = z.infer<typeof DebtorRiskAssessmentOutputSchema>;

export async function assessDebtorRisk(input: DebtorRiskAssessmentInput): Promise<DebtorRiskAssessmentOutput> {
  return debtorRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'debtorRiskAssessmentPrompt',
  input: {schema: DebtorRiskAssessmentInputSchema},
  output: {schema: DebtorRiskAssessmentOutputSchema},
  prompt: `You are an AI assistant specializing in assessing debtor risk.

  Based on the debtor's payment behavior, credit score (if available), debt amount, and credit limit(if available), you will assess the risk level associated with the debtor.

  Payment Behavior: {{{paymentBehavior}}}
  Credit Score: {{#if creditScore}}{{{creditScore}}}{{else}}N/A{{/if}}
  Debt Amount: {{{debtAmount}}}
  Credit Limit: {{#if creditLimit}}{{{creditLimit}}}{{else}}N/A{{/if}}

  Risk Level: Determine a risk level (High, Medium, Low) based on the provided information. Consider a high debt amount compared to the credit limit as a significant risk factor.
  Risk Factors: List the key factors contributing to the assigned risk level.
  Suggested Actions: Provide suggested actions for managing the debtor based on their risk level.

  Output:
  Risk Level: (High, Medium, Low)
  Risk Factors: (Factors contributing to the risk level)
  Suggested Actions: (Actions for managing the debtor)
  `,
});

const debtorRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'debtorRiskAssessmentFlow',
    inputSchema: DebtorRiskAssessmentInputSchema,
    outputSchema: DebtorRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
