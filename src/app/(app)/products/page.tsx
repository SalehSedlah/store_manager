
"use client";

import { ProductForm } from "@/components/products/product-form";
import { ProductList } from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bot } from "lucide-react";
import { ProductAIChatInterface } from "@/components/products/product-ai-chat-interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function ProductsPage() {
  const pageTitle = "إدارة المنتجات الذكية"; 
  const pageDescription = "تساعدك هذه الميزة على تتبع كل ما يخص المنتجات من حيث المخزون، الأرباح، والخسائر، مع الاستفادة من الذكاء الاصطناعي لتحسين الأداء واتخاذ قرارات ذكية.";
  const addNewProductButtonText = "إضافة صنف جديد"; 
  const aiSectionTitle = "🤖 رؤى وتحليلات المنتجات بالذكاء الاصطناعي";
  const aiSectionDescription = "استفد من قوة الذكاء الاصطناعي للحصول على تحليلات متقدمة، توقعات دقيقة، واقتراحات مخصصة لتحسين إدارة منتجاتك وزيادة أرباحك.";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">{pageDescription}</p>
        </div>
        <ProductForm 
          triggerButton={
            <Button className="shrink-0">
              <PlusCircle className="ml-2 rtl:mr-0 rtl:ml-2 h-4 w-4" /> {addNewProductButtonText}
            </Button>
          }
        />
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>✅ المهام والقدرات الرئيسية في إدارة المنتجات:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 rtl:mr-4 rtl:ml-0">
            <li><strong>إضافة وتعديل الأصناف:</strong> أدخل اسم الصنف، الفئة، وحدة القياس، سعر البيع، سعر الشراء، الكمية المتوفرة، حد المخزون المنخفض، عدد القطع بالوحدة (إن وجدت)، تاريخ الانتهاء (إن وجد)، والكمية المباعة.</li>
            <li><strong>عرض قائمة الأصناف المفصلة (كشف المخزون الحالي):</strong> يتم عرض جميع الأصناف مع تفاصيلها الكاملة، بما في ذلك الكمية المباعة، حالة المخزون (متوفر، منخفض، نفد) وحالة الصلاحية (صالح، قارب على الانتهاء، منتهي). توفر هذه القائمة نظرة شاملة على وضع المخزون الحالي.</li>
            <li><strong>حسابات مالية للمخزون الحالي:</strong>
                <ul className="list-disc list-inside ml-6 rtl:mr-6 rtl:ml-0 mt-1">
                    <li>إجمالي قيمة المخزون (بسعر البيع)</li>
                    <li>إجمالي تكلفة المخزون (بسعر الشراء)</li>
                    <li>إجمالي الربح المحتمل من المخزون الحالي</li>
                </ul>
            </li>
            <li><strong>تتبع الكميات المباعة:</strong> يتم عرض الكمية المباعة لكل منتج. (ملاحظة: يمكن تعديل هذا الرقم يدويًا عند تعديل المنتج. للحصول على تتبع دقيق للمبيعات، يتطلب الأمر نظامًا لتسجيل كل معاملة بيع).</li>
            <li><strong>تنبيهات المخزون الآلية:</strong> يتم تمييز المنتجات التي وصلت لحد المخزون المنخفض أو نفدت كميتها.</li>
            <li><strong>تتبع صلاحية المنتج:</strong> تمييز المنتجات منتهية الصلاحية أو التي قاربت على الانتهاء.</li>
            <li><strong>حساب الأرباح على مستوى الوحدة والقطعة:</strong> إذا كان للمنتج عدد قطع محدد بالوحدة (مثل علب داخل كرتون أو أكياس داخل شوال)، يمكن للذكاء الاصطناعي حساب وعرض الربح لكل قطعة فرعية عند سؤاله. ويمكنه أيضًا حساب الربح بناءً على سيناريوهات أسعار تقدمها أنت.</li>
             <li><strong>كشوفات حساب المبيعات والمشتريات (تطوير مستقبلي):</strong>
                <ul className="list-disc list-inside ml-6 rtl:mr-6 rtl:ml-0 mt-1">
                    <li>لعرض كشوفات حساب مفصلة للمبيعات والمشتريات لفترات محددة (يومية، شهرية، سنوية)، يتطلب النظام بناء ميزة لتسجيل كل معاملة بيع وشراء فردية. هذا تطوير هام ومخطط له مستقبلاً.</li>
                    <li>حالياً، يمكن للمساعد الذكي تحليل المبيعات أو المشتريات إذا قمت بتزويده بملخصات لهذه البيانات خلال الدردشة.</li>
                </ul>
            </li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground pt-3">🚀 قدرات الذكاء الاصطناعي (AI):</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 rtl:mr-4 rtl:ml-0">
                <li><strong>تحليل الأرباح والخسائر (المحتملة من المخزون الحالي):</strong> يقوم الذكاء الاصطناعي بتحليل أسعار البيع والشراء للمخزون الحالي والكميات المباعة لتقدير الربحية. يمكنه أيضًا تحليل سيناريوهات ربح تقدمها أنت.</li>
                <li><strong>توقّع نفاد المنتجات (مبني على الحدود):</strong> بناءً على حدود المخزون المنخفض، يساعدك AI في معرفة متى يجب إعادة الطلب. (التوقعات المتقدمة المبنية على معدل البيع الفعلي تتطلب بيانات مبيعات تاريخية مفصلة).</li>
                <li><strong>الجرد الذكي (مستقبلي):</strong> المساعدة في مقارنة البيانات واكتشاف الخلل.</li>
                <li><strong>دردشة مساعدة للمدير (متاحة الآن!):</strong> اطرح أسئلة باللغة العربية حول منتجاتك (مثل: "ما هي المنتجات الأكثر ربحية؟"، "كم أربح من الحليب إذا كان سعر شراء الكرتون X وأبيع العلبة Y والكرتون فيه Z علبة؟"، "هل مخزون الطماطم منخفض؟") واحصل على إجابات فورية من المساعد الذكي أدناه. يمكن للمساعد الذكي تقديم معلومات عن "كشف المخزون الحالي" بناءً على البيانات المتوفرة.</li>
            </ul>
        </CardContent>
      </Card>

      <ProductList />

      <Card className="shadow-lg border-primary border-2">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center text-primary">
            <Bot className="ml-2 rtl:mr-0 rtl:ml-2 h-6 w-6" />
            {aiSectionTitle}
          </CardTitle>
          <CardDescription>{aiSectionDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductAIChatInterface />
        </CardContent>
      </Card>

    </div>
  );
}

    

    