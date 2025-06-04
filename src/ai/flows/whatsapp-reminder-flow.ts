
'use server';
/**
 * @fileOverview Generates a polite WhatsApp reminder message for a debtor who has exceeded their credit limit.
 *
 * - generateWhatsappReminder - A function that generates the WhatsApp reminder message.
 * - WhatsappReminderInput - The input type for the generateWhatsappReminder function.
 * - WhatsappReminderOutput - The return type for the generateWhatsappReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Transaction } from '@/types/debt';

const TransactionDetailSchema = z.object({
  date: z.string().describe('تاريخ المعاملة'),
  type: z.string().describe('نوع المعاملة (مثال: دين جديد, دفعة)'),
  amount: z.number().describe('مبلغ المعاملة'),
  description: z.string().optional().describe('وصف المعاملة'),
});

const WhatsappReminderInputSchema = z.object({
  debtorName: z.string().describe('اسم المدين'),
  amountOwed: z.number().describe('المبلغ الإجمالي المستحق على المدين'),
  creditLimit: z.number().describe('الحد الائتماني للمدين'),
  transactions: z.array(TransactionDetailSchema).describe('قائمة بمعاملات المدين، خاصة تلك التي أدت إلى الدين الحالي. يجب أن تكون باللغة العربية إذا كانت نصية.'),
  debtorPhoneNumber: z.string().optional().describe('رقم هاتف المدين لإدراجه في الرسالة إذا لزم الأمر'),
});
export type WhatsappReminderInput = z.infer<typeof WhatsappReminderInputSchema>;

const WhatsappReminderOutputSchema = z.object({
  whatsappMessage: z.string().describe('رسالة التذكير الجاهزة للإرسال عبر واتساب باللغة العربية.'),
});
export type WhatsappReminderOutput = z.infer<typeof WhatsappReminderOutputSchema>;

export async function generateWhatsappReminder(input: WhatsappReminderInput): Promise<WhatsappReminderOutput> {
  return whatsappReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whatsappReminderPrompt',
  input: {schema: WhatsappReminderInputSchema},
  output: {schema: WhatsappReminderOutputSchema},
  prompt: `أنت مساعد ودود ومحترف. مهمتك هي إنشاء رسالة تذكير مهذبة عبر واتساب باللغة العربية للمدين التالي الذي تجاوز حده الائتماني.

اسم المدين: {{{debtorName}}}
المبلغ الإجمالي المستحق: {{{amountOwed}}} ريال
الحد الائتماني: {{{creditLimit}}} ريال
{{#if debtorPhoneNumber}}رقم هاتف المدين: {{{debtorPhoneNumber}}}{{/if}}

الرجاء تضمين العناصر التالية في الرسالة:
1.  تحية ودية للمدين باسمه.
2.  إشعار بأنه قد تجاوز حده الائتماني.
3.  ذكر المبلغ الإجمالي المستحق والحد الائتماني.
4.  ملخص موجز للمعاملات الرئيسية (من قائمة المعاملات المقدمة) التي ساهمت في الدين الحالي. ركز على المعاملات التي زادت الدين.
    المعاملات المقدمة:
    {{#each transactions}}
    - تاريخ: {{{date}}}, النوع: {{{type}}}, المبلغ: {{{amount}}} ريال{{#if description}}, الوصف: {{{description}}}{{/if}}
    {{/each}}
5.  طلب مهذب لسداد المبلغ المستحق أو جزء منه في أقرب وقت ممكن.
6.  خاتمة مناسبة.

اجعل الرسالة واضحة وموجزة ومهنية. يجب أن تكون الرسالة بالكامل باللغة العربية.
`,
});

const whatsappReminderFlow = ai.defineFlow(
  {
    name: 'whatsappReminderFlow',
    inputSchema: WhatsappReminderInputSchema,
    outputSchema: WhatsappReminderOutputSchema,
  },
  async input => {
    // Format transaction dates for better readability if needed, or pass as is.
    // For simplicity, passing as is for now. The AI can interpret ISO dates.
    const {output} = await prompt(input);
    return output!;
  }
);

// Helper function to select relevant transactions (e.g., last 5 debt-increasing ones)
// This can be used in the context before calling the flow if needed,
// but for now, we pass all transactions and let the prompt guide the AI.
export async function prepareTransactionsForReminder(transactions: Transaction[]): Promise<WhatsappReminderInput['transactions']> {
  return transactions
    .filter(tx => tx.type === 'initial_balance' || tx.type === 'new_credit' || tx.type === 'adjustment_increase')
    .slice(-5) // Take last 5, for example
    .map(tx => ({
      date: new Date(tx.date).toLocaleDateString('ar-EG'), // Format date
      type: tx.type, // The AI prompt can translate this if needed, or map to Arabic here
      amount: tx.amount,
      description: tx.description,
    }));
}

