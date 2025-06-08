
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
            <li><strong>إضافة وتعديل الأصناف:</strong> أدخل اسم الصنف، الفئة، وحدة القياس، سعر البيع، سعر الشراء، الكمية المتوفرة، حد المخزون المنخفض، عدد القطع بالوحدة (إن وجدت)، وتاريخ الانتهاء (إن وجد).</li>
            <li><strong>عرض قائمة الأصناف المفصلة:</strong> يتم عرض جميع الأصناف مع تفاصيلها الكاملة، بما في ذلك الكمية المباعة، حالة المخزون (متوفر، منخفض، نفد) وحالة الصلاحية (صالح، قارب على الانتهاء، منتهي).</li>
            <li><strong>حسابات مالية للمخزون:</strong>
                <ul className="list-disc list-inside ml-6 rtl:mr-6 rtl:ml-0 mt-1">
                    <li>إجمالي قيمة المخزون (بسعر البيع)</li>
                    <li>إجمالي تكلفة المخزون (بسعر الشراء)</li>
                    <li>إجمالي الربح المحتمل من المخزون الحالي</li>
                </ul>
            </li>
            <li><strong>تتبع الكميات المباعة:</strong> يتم عرض الكمية المباعة لكل منتج. (ملاحظة: يتطلب نظام تسجيل مبيعات لتحديث هذا الرقم تلقائيًا، حاليًا يتم تهيئته بـ 0 ويمكن تعديله يدويًا أو من خلال عمليات مستقبلية).</li>
            <li><strong>تنبيهات المخزون الآلية:</strong> يتم تمييز المنتجات التي وصلت لحد المخزون المنخفض أو نفدت كميتها.</li>
            <li><strong>تتبع صلاحية المنتج:</strong> تمييز المنتجات منتهية الصلاحية أو التي قاربت على الانتهاء.</li>
            <li><strong>حساب الأرباح على مستوى الوحدة والقطعة:</strong> إذا كان للمنتج عدد قطع محدد بالوحدة (مثل علب داخل كرتون)، يمكن للذكاء الاصطناعي حساب وعرض الربح لكل قطعة فرعية.</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground pt-3">🚀 قدرات الذكاء الاصطناعي (AI):</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 rtl:mr-4 rtl:ml-0">
                <li><strong>تحليل الأرباح والخسائر (المحتملة):</strong> يقوم الذكاء الاصطناعي بتحليل أسعار البيع والشراء للمخزون الحالي والكميات المباعة لتقدير الربحية.</li>
                <li><strong>توقّع نفاد المنتجات (مبني على الحدود):</strong> بناءً على حدود المخزون المنخفض، يساعدك AI في معرفة متى يجب إعادة الطلب. (التوقعات المتقدمة تتطلب بيانات مبيعات).</li>
                <li><strong>اقتراح منتجات جديدة (مستقبلي):</strong> بناءً على التحليلات، يمكن للنظام اقتراح منتجات مربحة.</li>
                <li><strong>الجرد الذكي (مستقبلي):</strong> المساعدة في مقارنة البيانات واكتشاف الخلل.</li>
                <li><strong>دردشة مساعدة للمدير (متاحة الآن!):</strong> اطرح أسئلة باللغة العربية حول منتجاتك (مثل: "ما هي المنتجات الأكثر ربحية؟"، "كم ربحت من الحليب هذا الشهر على مستوى العلبة؟"، "هل مخزون الطماطم منخفض؟") واحصل على إجابات فورية من المساعد الذكي أدناه.</li>
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

    