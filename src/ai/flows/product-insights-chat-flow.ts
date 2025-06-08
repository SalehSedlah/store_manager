
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
  pricePerUnit: z.number().describe('سعر بيع الوحدة الواحدة من المنتج (الوحدة الرئيسية مثل الكرتون)'),
  purchasePricePerUnit: z.number().describe('سعر شراء الوحدة الواحدة من المنتج (الوحدة الرئيسية مثل الكرتون)'),
  currentStock: z.number().describe('الكمية الحالية المتوفرة في المخزون من المنتج (بالوحدة الرئيسية)'),
  lowStockThreshold: z.number().describe('حد المخزون المنخفض الذي عنده يتم التنبيه (بالوحدة الرئيسية)'),
  quantitySold: z.number().describe('الكمية المباعة من هذا المنتج (بالوحدة الرئيسية)'),
  expiryDate: z.string().optional().describe('تاريخ انتهاء صلاحية المنتج (YYYY-MM-DD), إن وجد'),
  piecesInUnit: z.number().optional().describe('عدد القطع الفرعية داخل الوحدة الرئيسية, إن وجد (مثال: عدد العلب في الكرتون)'),
});

const ProductInsightsChatInputSchema = z.object({
  question: z.string().describe('سؤال المستخدم حول المنتجات باللغة العربية'),
  products: z.array(AISingleProductSchema).describe('قائمة بجميع المنتجات الحالية في المخزن مع تفاصيلها'),
  businessName: z.string().optional().describe('اسم النشاط التجاري للمستخدم'),
});
export type ProductInsightsChatInput = z.infer<typeof ProductInsightsChatInputSchema>;

const ProductInsightsChatOutputSchema = z.object({
  answer: z.string().describe('إجابة الذكاء الاصطناعي على سؤال المستخدم باللغة العربية. يجب أن تكون الإجابة مفصلة ومفيدة.'),
});
export type ProductInsightsChatOutput = z.infer<typeof ProductInsightsChatOutputSchema>;

export async function chatWithProductInsightsAI(input: ProductInsightsChatInput): Promise<ProductInsightsChatOutput> {
  try {
    if (!input.products || input.products.length === 0) {
      return { answer: "لا توجد بيانات منتجات متاحة حاليًا للإجابة على سؤالك. يرجى إضافة بعض المنتجات أولاً." };
    }
    const result = await productInsightsChatFlow(input);
    return result;
  } catch (error) {
    console.error(`[Flow Error Handler: chatWithProductInsightsAI] Caught error: ${error instanceof Error ? error.message : String(error)}`, {input, errorDetails: error instanceof Error ? error.stack : error});
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
3.  **حساب الأرباح وأسعار القطع:**
    *   الربح المحتمل للمنتج (بالوحدة الرئيسية) = (\`pricePerUnit\` - \`purchasePricePerUnit\`) * \`currentStock\`.
    *   إذا كان للمنتج \`piecesInUnit\` وكان \`piecesInUnit\` أكبر من 0:
        *   سعر بيع القطعة = \`pricePerUnit\` / \`piecesInUnit\`.
        *   سعر شراء القطعة = \`purchasePricePerUnit\` / \`piecesInUnit\`.
        *   ربح القطعة = سعر بيع القطعة - سعر شراء القطعة.
        *   عند ذكر سعر القطعة أو ربحها، وضح أن هذا الحساب تم بناءً على \`piecesInUnit\`. إذا لم يكن \`piecesInUnit\` متاحًا أو كان صفرًا، اذكر أنه لا يمكن حساب سعر/ربح القطعة.
    *   عند السؤال عن الأرباح، وضح أن الأرباح المحسوبة هي "أرباح محتملة" بناءً على المخزون الحالي وأسعار البيع والشراء للوحدات الرئيسية. إذا كان السؤال عن ربح القطع، استخدم الحسابات أعلاه مع مراعاة صحة \`piecesInUnit\`.
4.  **المنتجات الأكثر ربحية:** عند السؤال عن المنتجات الأكثر ربحية، اذكر أفضل 3-5 منتجات. إذا لم يحدد المستخدم (وحدة رئيسية أم قطعة)، افترض الربح بناءً على الوحدة الرئيسية. يمكنك توضيح الربح لكل قطعة أيضًا إذا كان ذلك مناسبًا و\`piecesInUnit\` يسمح بذلك.
5.  **مبيعات القطع الفردية (إذا ذكر المستخدم أنه باع قطعًا):**
    *   إذا قال المستخدم شيئًا مثل "بعت 10 علب تونة" (وكان للمنتج "تونة" \`piecesInUnit\` مناسب وليكن 24):
        *   أكّد المعلومة: "مفهوم، تم بيع 10 علب تونة."
        *   لكل منتج ذُكر في سياق البيع بالقطعة: ابحث عن المنتج في قائمة \`products\` المقدمة لك. إذا وجدته وكان لديه \`piecesInUnit\` وكان \`piecesInUnit\` > 0:
            *   اشرح المتبقي في الوحدة الرئيسية الافتراضية التي تم فتحها: "إذا تم أخذ هذه الـ 10 علب من كرتونة واحدة من منتج {{name}} (والتي تحتوي على {{piecesInUnit}} علبة)، فسيتبقى في تلك الكرتونة (\`piecesInUnit\` - 10) علبة." (استبدل 10 بعدد القطع المذكورة، و name و piecesInUnit بتفاصيل المنتج).
            *   اذكر سعر القطعة: "سعر العلبة الواحدة من {{name}} هو (\`pricePerUnit\` / \`piecesInUnit\`) ريال."
        *   إذا لم يكن للمنتج \`piecesInUnit\` أو كان صفرًا، اذكر أنه لا يمكن تحديد المتبقي في الكرتونة بهذه الطريقة أو سعر القطعة بدقة.
        *   **تذكير مهم:** ذكّر المستخدم بأن تتبع المخزون (\`currentStock\`) والكميات المباعة (\`quantitySold\`) في النظام يتم بالوحدة الرئيسية (مثلاً، بالكرتون). لا تقم بتعديل هذه القيم تلقائيًا بناءً على الدردشة. يمكنك أن تقترح عليه تعديلها يدويًا إذا أراد.
6.  إذا سأل عن منتجات قاربت على النفاد، تحقق من حقل "currentStock" مقابل "lowStockThreshold".
7.  إذا سأل عن منتجات منتهية الصلاحية أو قاربت على الانتهاء، تحقق من حقل "expiryDate". افترض أن اليوم هو {{currentDate}}.
8.  إذا كان السؤال عامًا جدًا أو غير واضح، يمكنك طلب توضيح.
9.  إذا لم تكن البيانات كافية للإجابة، وضح ذلك. على سبيل المثال، لا يمكنك التنبؤ بموعد نفاد المخزون بدقة دون معرفة معدلات البيع الفعلية (المسجلة في \`quantitySold\` أو من خلال تحليل تاريخي للمبيعات إذا توفر).
10. كن ودودًا واحترافيًا.

مثال للإجابة على "ما هي المنتجات الأكثر ربحية؟":
"بناءً على المخزون الحالي، هذه هي المنتجات التي لديها أعلى ربح محتمل إذا تم بيع كل الكمية المتوفرة (بالوحدة الرئيسية):
1.  اسم المنتج أ: ربح محتمل X ريال (Y وحدة متوفرة) - ربح القطعة الواحدة Z ريال إذا كان المنتج مقسمًا و \`piecesInUnit\` > 0.
2.  اسم المنتج ب: ربح محتمل W ريال (V وحدة متوفرة)
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
    console.log('[Flow Log: productInsightsChatFlow] Received input:', JSON.stringify(input, null, 2));
    
    // Add current date to the prompt context for expiry calculations
    const promptInput = {
      ...input,
      currentDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    try {
      const {output, usage} = await prompt(promptInput);
      console.log('[Flow Log: productInsightsChatFlow] Successfully received output from prompt.', {output, usage});
      if (!output) {
        console.error('[Flow Log: productInsightsChatFlow] Prompt output was null or undefined.');
        throw new Error('Prompt returned no output.');
      }
      return output;
    } catch (error) {
      console.error(`[Flow Log: productInsightsChatFlow] Error during prompt execution: ${error instanceof Error ? error.message : String(error)}`, {promptInput, errorDetails: error instanceof Error ? error.stack : error});
      // Re-throw the error to be caught by the calling function's error handler which returns a user-friendly message
      throw error;
    }
  }
);

    