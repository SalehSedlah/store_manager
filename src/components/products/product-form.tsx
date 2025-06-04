
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Product } from "@/types/grocery";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useProducts } from "@/contexts/products-context";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const productFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يتكون اسم المنتج من حرفين على الأقل." }).max(100),
  category: z.string().min(2, { message: "يجب أن تتكون الفئة من حرفين على الأقل." }).max(50),
  unit: z.string().min(1, { message: "وحدة القياس مطلوبة."}).max(20),
  pricePerUnit: z.coerce.number().min(0, { message: "يجب أن يكون سعر الوحدة موجبًا أو صفرًا." }),
  currentStock: z.coerce.number().min(0, { message: "لا يمكن أن يكون المخزون سالبًا." }),
  lowStockThreshold: z.coerce.number().min(0, { message: "لا يمكن أن يكون حد المخزون المنخفض سالبًا." }),
  piecesInUnit: z.coerce.number().min(0, {message: "عدد القطع يجب أن يكون موجباً أو صفراً."}).optional().nullable(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  onFormSubmit?: () => void;
  triggerButton?: React.ReactNode;
}

export function ProductForm({ product, onFormSubmit, triggerButton }: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const isEditing = !!product;

  const addTitle = "إضافة صنف جديد";
  const addDescription = "أدخل تفاصيل الصنف الجديد، بما في ذلك اسمه، سعره، والكمية المتوفرة.";
  const editTitle = "تعديل الصنف";
  const editDescription = "قم بتحديث تفاصيل الصنف.";
  
  const nameLabel = "اسم الصنف";
  const namePlaceholder = "مثال: سكر، دقيق، زيت";
  const categoryLabel = "الفئة";
  const categoryPlaceholder = "مثال: فواكه، حبوب، ألبان";
  const unitLabel = "وحدة القياس";
  const unitPlaceholder = "مثال: قطعة، كجم، لتر، علبة، كرتون";
  const pricePerUnitLabel = "سعر الوحدة الرئيسية (بالعملة المحلية)";
  const pricePerUnitPlaceholder = "مثال: 100";
  const pricePerUnitDescription = "أدخل سعر الوحدة الرئيسية المحددة (مثال: سعر الكرتون كاملاً، سعر الكيس). إذا كانت الوحدة تحتوي على قطع (مثل كرتون به علب)، فهذا هو سعر الكرتون كاملاً، وليس سعر العلبة الواحدة.";
  const currentStockLabel = "الكمية المتوفرة في المخزون (بالوحدة الرئيسية)";
  const lowStockThresholdLabel = "حد المخزون المنخفض للتنبيه (بالوحدة الرئيسية)";
  const piecesInUnitLabel = "عدد القطع بالوحدة الرئيسية (إن وجدت)";
  const piecesInUnitDescription = "مثال: إذا كانت الوحدة 'كرتونة شاي' وتحتوي على 12 علبة، أدخل 12. اترك فارغاً إذا كانت الوحدة هي القطعة نفسها.";
  const piecesInUnitPlaceholder = "12";
  
  const cancelButton = "إلغاء";
  const addButtonText = "إضافة";
  const saveButtonText = "حفظ التغييرات";
  const savingButtonText = "جاري الحفظ...";

  const toastErrorTitle = "خطأ";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEditing ? {
      name: product.name,
      category: product.category,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
      currentStock: product.currentStock,
      lowStockThreshold: product.lowStockThreshold,
      piecesInUnit: product.piecesInUnit ?? null,
    } : {
      name: "",
      category: "",
      unit: "",
      pricePerUnit: 0,
      currentStock: 0,
      lowStockThreshold: 0,
      piecesInUnit: null,
    },
  });

  useEffect(() => {
    if (isOpen) { 
      if (isEditing && product) {
        form.reset({
          name: product.name,
          category: product.category,
          unit: product.unit,
          pricePerUnit: product.pricePerUnit,
          currentStock: product.currentStock,
          lowStockThreshold: product.lowStockThreshold,
          piecesInUnit: product.piecesInUnit ?? null,
        });
      } else {
        form.reset({ name: "", category: "", unit: "", pricePerUnit: 0, currentStock: 0, lowStockThreshold: 0, piecesInUnit: null });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isEditing, isOpen]);

  function onSubmit(data: ProductFormValues) {
    try {
      const productDataToSave = {
        ...data,
        piecesInUnit: data.piecesInUnit === null ? undefined : data.piecesInUnit, // Convert null to undefined for storage if needed
      };

      if (isEditing && product) {
        updateProduct(product.id, productDataToSave);
      } else {
        addProduct(productDataToSave);
      }
      setIsOpen(false);
      if (onFormSubmit) onFormSubmit();
      form.reset(); 
    } catch (error: any) {
      toast({ title: toastErrorTitle, description: error.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button>{addTitle}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? editTitle : addTitle}</DialogTitle>
          <DialogDescription>
            {isEditing ? editDescription : addDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{nameLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={namePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{categoryLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={categoryPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{unitLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={unitPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{pricePerUnitLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={pricePerUnitPlaceholder} {...field} step="0.01" />
                  </FormControl>
                  <FormDescription>{pricePerUnitDescription}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="piecesInUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{piecesInUnitLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={piecesInUnitPlaceholder} 
                           {...field} 
                           onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                           value={field.value ?? ""} 
                    />
                  </FormControl>
                  <FormDescription>{piecesInUnitDescription}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{currentStockLabel}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{lowStockThresholdLabel}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => { form.reset(); setIsOpen(false); }}>{cancelButton}</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? savingButtonText : (isEditing ? saveButtonText : addButtonText)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
