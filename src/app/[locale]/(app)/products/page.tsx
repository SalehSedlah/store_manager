"use client";

import { ProductForm } from "@/components/products/product-form";
import { ProductList } from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
// import {useTranslations} from 'next-intl'; // Placeholder for translations

export default function ProductsPage() {
  // const t = useTranslations('ProductsPage'); // Placeholder

  // Using hardcoded Arabic text for now
  const pageTitle = "صفحة إدارة البقالة!"; 
  const pageDescription = "هنا يمكنك إدارة جميع تفاصيل المنتجات الموجودة في متجرك بكل سهولة، بما في ذلك إدخال الأصناف، تتبع الكميات، معرفة الأرباح (قيمة المخزون)، والقيام بالجرد اليومي أو الأسبوعي.";
  const addNewProductButtonText = "إضافة صنف جديد"; 

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{pageDescription}</p>
        </div>
        <ProductForm 
          triggerButton={
            <Button className="shrink-0">
              <PlusCircle className="ml-2 rtl:mr-0 rtl:ml-2 h-4 w-4" /> {addNewProductButtonText}
            </Button>
          }
        />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-foreground mb-2">✅ المهام المتاحة في هذه الصفحة:</h2>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 rtl:mr-4 rtl:ml-0">
          <li><strong>إضافة صنف جديد:</strong> أدخل اسم الصنف، سعر الوحدة، والكمية المتوفرة.</li>
          <li><strong>عرض قائمة الأصناف:</strong> يتم عرض جميع الأصناف مع الاسم، السعر، الكمية، والقيمة الإجمالية.</li>
          <li><strong>حساب قيمة المخزون:</strong> في أسفل القائمة، يمكنك رؤية "إجمالي قيمة الأصناف"، وهو مجموع القيمة الإجمالية لكل الأصناف المخزنة.</li>
          <li><strong>جرد البقالة:</strong> معرفة كمية كل صنف للمساعدة في إعادة التعبئة.</li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">📝 <strong>ملاحظات:</strong> تأكد من إدخال البيانات بدقة. يمكنك تعديل أو حذف الأصناف من القائمة أدناه.</p>
      </div>
      <ProductList />
    </div>
  );
}
