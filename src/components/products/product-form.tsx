
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
import { Textarea } from "../ui/textarea"; // Assuming you might need textarea for category or description later

const productFormSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }).max(100),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }).max(50),
  unit: z.string().min(1, { message: "Unit is required."}).max(20), // e.g., piece, kg, liter, pack
  currentStock: z.coerce.number().min(0, { message: "Stock cannot be negative." }),
  lowStockThreshold: z.coerce.number().min(0, { message: "Low stock threshold cannot be negative." }),
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

  const addTitle = "Add New Product";
  const addDescription = "Enter the details for the new product.";
  const editTitle = "Edit Product";
  const editDescription = "Update the product details.";
  
  const nameLabel = "Product Name";
  const namePlaceholder = "e.g., Apples, Rice";
  const categoryLabel = "Category";
  const categoryPlaceholder = "e.g., Fruits, Grains, Dairy";
  const unitLabel = "Unit of Measurement";
  const unitPlaceholder = "e.g., piece, kg, liter, pack";
  const currentStockLabel = "Current Stock";
  const lowStockThresholdLabel = "Low Stock Threshold";
  
  const cancelButton = "Cancel";
  const addButtonText = "Add Product";
  const saveButtonText = "Save Changes";
  const savingButtonText = "Saving...";

  const toastErrorTitle = "Error";

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
                  <FormDescription>e.g., piece, kg, liter, pack, box</FormDescription>
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
