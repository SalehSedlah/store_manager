
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
// import { Textarea } from "../ui/textarea"; // Assuming you might need textarea for category or description later

const productFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يتكون اسم المنتج من حرفين على الأقل." }).max(100),
  category: z.string().min(2, { message: "يجب أن تتكون الفئة من حرفين على الأقل." }).max(50),
  unit: z.string().min(1, { message: "وحدة القياس مطلوبة."}).max(20),
  currentStock: z.coerce.number().min(0, { message: "لا يمكن أن يكون المخزون سالبًا." }),
  lowStockThreshold: z.coerce.number().min(0, { message: "لا يمكن أن يكون حد المخزون المنخفض سالبًا." }),
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

  const addTitle = "إضافة منتج جديد";
  const addDescription = "أدخل تفاصيل المنتج الجديد.";
  const editTitle = "تعديل المنتج";
  const editDescription = "قم بتحديث تفاصيل المنتج.";
  
  const nameLabel = "اسم المنتج";
  const namePlaceholder = "مثال: تفاح، أرز";
  const categoryLabel = "الفئة";
  const categoryPlaceholder = "مثال: فواكه، حبوب، ألبان";
  const unitLabel = "وحدة القياس";
  const unitPlaceholder = "مثال: قطعة، كجم، لتر، علبة";
  const currentStockLabel = "المخزون الحالي";
  const lowStockThresholdLabel = "حد المخزون المنخفض";
  
  const cancelButton = "إلغاء";
  const addButtonText = "إضافة منتج";
  const saveButtonText = "حفظ التغييرات";
  const savingButtonText = "جاري الحفظ...";

  const toastErrorTitle = "خطأ";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEditing ? {
      name: product.name,
      category: product.category,
      unit: product.unit,
      currentStock: product.currentStock,
      lowStockThreshold: product.lowStockThreshold,
    } : {
      name: "",
      category: "",
      unit: "",
      currentStock: 0,
      lowStockThreshold: 0,
    },
  });

  useEffect(() => {
    if (isOpen) { 
      if (isEditing && product) {
        form.reset({
          name: product.name,
          category: product.category,
          unit: product.unit,
          currentStock: product.currentStock,
          lowStockThreshold: product.lowStockThreshold,
        });
      } else {
        form.reset({ name: "", category: "", unit: "", currentStock: 0, lowStockThreshold: 0 });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isEditing, isOpen]);

  function onSubmit(data: ProductFormValues) {
    try {
      if (isEditing && product) {
        updateProduct(product.id, data);
      } else {
        addProduct(data);
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
                  <FormDescription>مثال: قطعة، كجم، لتر، علبة، صندوق</FormDescription>
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
                <Button type="button" variant="outline" onClick={() => form.reset()}>{cancelButton}</Button>
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
