
'use server';
/**
 * @fileOverview AI chat assistant for product management insights.
 *
 * - chatWithProductInsightsAI - A function that handles chat interactions about products.
 * - ProductInsightsChatInput - The input type for the chat function.
 * - ProductInsightsChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Product } from '@/types/grocery'; // Assuming Product type is defined here

// Define the schema for a single product as expected by the AI
const AISingleProductSchema = z.object({
  id: z.string(),
  name: z.string().describe('اسم المنتج'),
  category: z.string().describe('فئة المنتج'),
  unit: z.string().describe('وحدة قياس المنتج (مثال: قطعة، كجم)'),
  pricePerUnit: z.number().describe('سعر بيع الوحدة الواحدة من المنتج'),
  purchasePricePerUnit: z.number().describe('سعر شراء الوحدة الواحدة من المنتج'),
  currentStock: z.number().describe('الكمية الحالية المتوفرة في المخزون من المنتج'),
  lowStockThreshold: z.number().describe('حد المخزون المنخفض الذي عنده يتم التنبيه'),
  quantitySold: z.number().describe('الكمية المباعة من هذا المنتج'),
  expiryDate: z.string().optional().describe('تاريخ انتهاء صلاحية المنتج (YYYY-MM-DD), إن وجد'),
  piecesInUnit: z.number().optional().describe('عدد القطع الفرعية داخل الوحدة الرئيسية, إن وجد'),
});

const ProductInsightsChatInputSchema = z.object({
  question: z.string().describe('سؤال المستخدم حول المنتجات باللغة العربية'),
  products: z.array(AISingleProductSchema).describe('قائمة بجميع المنتجات الحالية في المخزن مع تفاصيلها'),
  businessName: z.string().optional().describe('اسم النشاط التجاري للمستخدم'),
});
export type ProductInsightsChatInput = z.infer<typeof ProductInsightsChatInputSchema>;

const ProductInsightsChatOutputSchema = z.object({
  answer: z.string().describe('إجابة الذكاء الاصطناعي على سؤال المستخدم باللغة العربية. يجب أن تكون الإجابة مفصلة ومفيدة.'),
  // chartData: z.any().optional().describe('بيانات منظمة يمكن استخدامها لإنشاء رسوم بيانية إذا كان السؤال يتطلب ذلك'),
});
export type ProductInsightsChatOutput = z.infer<typeof ProductInsightsChatOutputSchema>;

export async function chatWithProductInsightsAI(input: ProductInsightsChatInput): Promise<ProductInsightsChatOutput> {
  try {
    // Basic validation or transformation before calling the flow if needed
    if (!input.products || input.products.length === 0) {
      return { answer: "لا توجد بيانات منتجات متاحة حاليًا للإجابة على سؤالك. يرجى إضافة بعض المنتجات أولاً." };
    }
    const result = await productInsightsChatFlow(input);
    return result;
  } catch (error) {
    console.error(`[Flow Error: chatWithProductInsightsAI] ${error instanceof Error ? error.message : String(error)}`, {input, error});
    // Return a user-friendly error message
    return { answer: "عذرًا، حدث خطأ أثناء محاولة معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا." };
  }
}

const prompt = ai.definePrompt({
  name: 'productInsightsChatPrompt',
  input: {schema: ProductInsightsChatInputSchema},
  output: {schema: ProductInsightsChatOutputSchema},
  prompt: `أنت مساعد ذكاء اصطناعي خبير في إدارة منتجات البقالة. مهمتك هي تحليل بيانات المنتجات المقدمة والإجابة على أسئلة صاحب المتجر باللغة العربية.
اسم المتجر هو: {{#if businessName}}{{{businessName}}}{{else}}المتجر{{/if}}.

سؤال المستخدم: "{{{question}}}"

بيانات المنتجات الحالية:
{{{json products}}}

إرشادات لك:
1.  قدم إجابات واضحة، دقيقة، ومفيدة باللغة العربية.
2.  استخدم بيانات المنتجات المقدمة فقط في تحليلاتك. لا تخترع بيانات.
3.  إذا سأل المستخدم عن الأرباح، وضح أن الأرباح المحسوبة هي "أرباح محتملة" بناءً على المخزون الحالي وأسعار البيع والشراء، حيث لا تتوفر بيانات مبيعات فعلية مفصلة. الربح المحتمل للمنتج الواحد هو (سعر البيع - سعر الشراء) * الكمية الحالية.
4.  عند السؤال عن المنتجات الأكثر ربحية، اذكر أفضل 3-5 منتجات بناءً على الربح المحتمل الإجمالي للمخزون الحالي ( (سعر البيع - سعر الشراء) * الكمية الحالية ).
5.  إذا سأل عن منتجات قاربت على النفاد، تحقق من حقل "currentStock" مقابل "lowStockThreshold".
6.  إذا سأل عن منتجات منتهية الصلاحية أو قاربت على الانتهاء، تحقق من حقل "expiryDate". افترض أن اليوم هو {{currentDate}}.
7.  إذا كان السؤال عامًا جدًا أو غير واضح، يمكنك طلب توضيح.
8.  إذا لم تكن البيانات كافية للإجابة، وضح ذلك. على سبيل المثال، لا يمكنك التنبؤ بموعد نفاد المخزون بدقة دون معرفة معدلات البيع.
9.  كن ودودًا واحترافيًا.

مثال للإجابة على "ما هي المنتجات الأكثر ربحية؟":
"بناءً على المخزون الحالي، هذه هي المنتجات التي لديها أعلى ربح محتمل إذا تم بيع كل الكمية المتوفرة:
1.  اسم المنتج أ: ربح محتمل X ريال (Y قطعة متوفرة)
2.  اسم المنتج ب: ربح محتمل Z ريال (W قطعة متوفرة)
..."

مثال للإجابة على "هل مخزون الطماطم منخفض؟":
"نعم، مخزون الطماطم (X قطعة) أقل من الحد الأدنى للتنبيه (Y قطعة)." أو "لا، مخزون الطماطم (X قطعة) لا يزال أعلى من الحد الأدنى (Y قطعة)."

الآن، يرجى الإجابة على سؤال المستخدم.
`,
});

const productInsightsChatFlow = ai.defineFlow(
  {
    name: 'productInsightsChatFlow',
    inputSchema: ProductInsightsChatInputSchema,
    outputSchema: ProductInsightsChatOutputSchema,
  },
  async (input) => {
    // Add current date to the prompt context for expiry calculations
    const promptInput = {
      ...input,
      currentDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };
    const {output} = await prompt(promptInput);
    return output!;
  }
);
