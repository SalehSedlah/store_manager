
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
  unit: z.string().describe('وحدة قياس المنتج (مثال: قطعة، كجم, كرتون, شوال)'),
  pricePerUnit: z.number().describe('سعر بيع الوحدة الواحدة من المنتج (الوحدة الرئيسية مثل الكرتون أو الشوال)'),
  purchasePricePerUnit: z.number().describe('سعر شراء الوحدة الواحدة من المنتج (الوحدة الرئيسية مثل الكرتون أو الشوال)'),
  currentStock: z.number().describe('الكمية الحالية المتوفرة في المخزون من المنتج (بالوحدة الرئيسية)'),
  lowStockThreshold: z.number().describe('حد المخزون المنخفض الذي عنده يتم التنبيه (بالوحدة الرئيسية)'),
  quantitySold: z.number().describe('الكمية المباعة من هذا المنتج (بالوحدة الرئيسية)'),
  expiryDate: z.string().optional().describe('تاريخ انتهاء صلاحية المنتج (YYYY-MM-DD), إن وجد'),
  piecesInUnit: z.number().optional().describe('عدد القطع الفرعية داخل الوحدة الرئيسية, إن وجد (مثال: عدد العلب في الكرتون، أو عدد الأكياس الصغيرة في الشوال)'),
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

تاريخ اليوم: {{currentDate}}

إرشادات لك:
1.  قدم إجابات واضحة، دقيقة، ومفيدة باللغة العربية.
2.  استخدم بيانات المنتجات المقدمة فقط في تحليلاتك. لا تخترع بيانات.
3.  **حساب الأرباح وأسعار القطع من بيانات المنتج المخزنة:**
    *   الربح المحتمل للمنتج (بالوحدة الرئيسية مثل الكرتون أو الشوال) = (\`pricePerUnit\` - \`purchasePricePerUnit\`) * \`currentStock\`.
    *   إذا كان للمنتج \`piecesInUnit\` وكان \`piecesInUnit\` > 0:
        *   سعر بيع القطعة الفرعية (مثل علبة داخل كرتون، أو كيس صغير داخل شوال) = \`pricePerUnit\` / \`piecesInUnit\`.
        *   سعر شراء القطعة الفرعية = \`purchasePricePerUnit\` / \`piecesInUnit\`.
        *   ربح القطعة الفرعية = سعر بيع القطعة الفرعية - سعر شراء القطعة الفرعية.
        *   عند ذكر سعر القطعة أو ربحها، وضح أن هذا الحساب تم بناءً على \`piecesInUnit\` من بيانات المنتج المخزنة. إذا لم يكن \`piecesInUnit\` متاحًا أو كان صفرًا، اذكر أنه لا يمكن حساب سعر/ربح القطعة بهذه الطريقة.
    *   عند السؤال عن الأرباح، وضح أن الأرباح المحسوبة هي "أرباح محتملة" بناءً على المخزون الحالي وأسعار البيع والشراء للوحدات الرئيسية من بيانات المنتج المخزنة. إذا كان السؤال عن ربح القطع، استخدم الحسابات أعلاه مع مراعاة صحة \`piecesInUnit\`.
4.  **حساب الأرباح بناءً على سيناريو يقدمه المستخدم (مثال: "سعر شراء الكرتون/الشوال X، وأبيع العلبة/الكيس Y، والكرتون/الشوال فيه Z علبة/كيس"):**
    *   إذا قدم المستخدم سيناريو مشابه، قم بتحليل الأرقام المقدمة.
    *   لتوضيح، إذا قال المستخدم "سعر الكرتون 15000"، افترض أن هذا هو **سعر شراء الكرتون** ما لم يحدد المستخدم صراحة أنه سعر بيع. يمكنك أن تسأله "هل تقصد 15000 ريال كسعر شراء للكرتون؟" إذا كان السياق غير واضح.
    *   بناءً على المعطيات:
        *   احسب **تكلفة شراء القطعة الواحدة** (علبة/كيس) = (سعر شراء الوحدة الرئيسية المعطى) / (عدد القطع في الوحدة الرئيسية المعطى).
        *   احسب **ربح القطعة الواحدة** = (سعر بيع القطعة المعطى) - (تكلفة شراء القطعة الواحدة المحسوبة).
        *   احسب **الربح الإجمالي المتوقع من الوحدة الرئيسية** = (ربح القطعة الواحدة) * (عدد القطع في الوحدة الرئيسية المعطى).
        *   احسب **سعر بيع الوحدة الرئيسية المتوقع** (إذا بيعت كل القطع بالسعر المعطى للقطعة) = (سعر بيع القطعة المعطى) * (عدد القطع في الوحدة الرئيسية المعطى).
    *   اشرح هذه الحسابات للمستخدم خطوة بخطوة. مثال: "بناءً على أن سعر شراء الكرتون 15000 ريال ويحتوي على 24 علبة، فإن تكلفة شراء العلبة الواحدة هي 15000 / 24 = 625 ريال. وبما أنك تبيع العلبة بـ 1500 ريال، فإن ربحك في العلبة الواحدة هو 1500 - 625 = 875 ريال. وبالتالي، الربح المتوقع من الكرتون كاملاً هو 875 * 24 = 21000 ريال."
5.  **المنتجات الأكثر ربحية:** عند السؤال عن المنتجات الأكثر ربحية، اذكر أفضل 3-5 منتجات. إذا لم يحدد المستخدم (وحدة رئيسية أم قطعة)، افترض الربح بناءً على الوحدة الرئيسية من بيانات المنتج المخزنة. يمكنك توضيح الربح لكل قطعة أيضًا إذا كان ذلك مناسبًا و\`piecesInUnit\` يسمح بذلك.
6.  **مبيعات القطع الفردية (إذا ذكر المستخدم أنه باع قطعًا):**
    *   إذا قال المستخدم شيئًا مثل "بعت 10 علب تونة" (وكان للمنتج "تونة" \`piecesInUnit\` مناسب وليكن 24):
        *   أكّد المعلومة: "مفهوم، تم بيع 10 علب تونة."
        *   لكل منتج ذُكر في سياق البيع بالقطعة: ابحث عن المنتج في قائمة \`products\` المقدمة لك. إذا وجدته وكان لديه \`piecesInUnit\` وكان \`piecesInUnit\` > 0:
            *   اشرح المتبقي في الوحدة الرئيسية الافتراضية التي تم فتحها: "إذا تم أخذ هذه الـ 10 علب من وحدة رئيسية واحدة من منتج {{name}} (والتي تحتوي على {{piecesInUnit}} علبة/قطعة)، فسيتبقى في تلك الوحدة (\`piecesInUnit\` - 10) علبة/قطعة." (استبدل 10 بعدد القطع المذكورة، و name و piecesInUnit بتفاصيل المنتج).
            *   اذكر سعر القطعة: "سعر القطعة الواحدة من {{name}} هو (\`pricePerUnit\` / \`piecesInUnit\`) ريال، محسوب من بيانات المنتج المخزنة."
        *   إذا لم يكن للمنتج \`piecesInUnit\` أو كان صفرًا، اذكر أنه لا يمكن تحديد المتبقي في الوحدة الرئيسية بهذه الطريقة أو سعر القطعة بدقة من بيانات المنتج.
        *   **تذكير مهم:** ذكّر المستخدم بأن تتبع المخزون (\`currentStock\`) والكميات المباعة (\`quantitySold\`) في النظام يتم بالوحدة الرئيسية (مثلاً، بالكرتون، بالشوال). لا تقم بتعديل هذه القيم تلقائيًا بناءً على الدردشة. يمكنك أن تقترح عليه تعديلها يدويًا إذا أراد.
7.  **التقارير وكشوفات الحساب:**
    *   **كشف المخزون الحالي:** يمكنك تقديم معلومات حول المخزون الحالي بناءً على قائمة المنتجات (الاسم، الكمية، السعر، إلخ).
    *   **كشوفات المبيعات والمشتريات التاريخية:** إذا سألك المستخدم عن كشوفات حساب تاريخية للمبيعات أو المشتريات (مثلاً "تقرير مبيعات الشهر الماضي")، وضح أن النظام الحالي لا يسجل كل معاملة بيع أو شراء فردية بشكل مفصل. يمكنك أن تقول: "النظام الحالي لا يسجل تفاصيل كل عملية بيع أو شراء تاريخية، لذا لا يمكنني تقديم كشف حساب تاريخي مفصل للمبيعات أو المشتريات. لكن يمكنني تحليل بيانات المنتجات الحالية، أو يمكنك تزويدي بملخص للمبيعات أو المشتريات التي تمت خلال فترة معينة وسأقوم بتحليلها لك."
8.  إذا سأل عن منتجات قاربت على النفاد، تحقق من حقل "currentStock" مقابل "lowStockThreshold".
9.  إذا سأل عن منتجات منتهية الصلاحية أو قاربت على الانتهاء، تحقق من حقل "expiryDate". افترض أن اليوم هو {{currentDate}}.
10. إذا كان السؤال عامًا جدًا أو غير واضح، يمكنك طلب توضيح.
11. إذا لم تكن البيانات كافية للإجابة، وضح ذلك. على سبيل المثال، لا يمكنك التنبؤ بموعد نفاد المخزون بدقة دون معرفة معدلات البيع الفعلية (المسجلة في \`quantitySold\` أو من خلال تحليل تاريخي للمبيعات إذا توفر).
12. كن ودودًا واحترافيًا.

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
    
    const promptInput = {
      ...input,
      currentDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    try {
      const {output, usage} = await prompt(promptInput);
      console.log('[Flow Log: productInsightsChatFlow] Successfully received output from prompt.', {output, usage});
      if (!output || typeof output.answer !== 'string' || output.answer.trim() === "") {
        console.error('[Flow Log: productInsightsChatFlow] Prompt output was null, undefined, or answer was empty.');
         // Log the raw response from the model if possible and available in usage or a debug log
        const modelResponseText = usage?.custom?.rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (modelResponseText) {
            console.error('[Flow Log: productInsightsChatFlow] Raw model response text (if available):', modelResponseText);
        }
        throw new Error('Prompt returned no valid answer.');
      }
      return output;
    } catch (error) {
      console.error(`[Flow Log: productInsightsChatFlow] Error during prompt execution: ${error instanceof Error ? error.message : String(error)}`, {promptInput, errorDetails: error instanceof Error ? error.stack : error});
      throw error;
    }
  }
);


    