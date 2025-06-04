
"use client";

import { ProductForm } from "@/components/products/product-form";
import { ProductList } from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProductsPage() {
  const pageTitle = "Product Management"; 
  const addNewProductButtonText = "Add New Product"; 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold text-foreground">{pageTitle}</h1>
        <ProductForm 
          triggerButton={
            <Button>
              <PlusCircle className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {addNewProductButtonText}
            </Button>
          }
        />
      </div>
      <ProductList />
    </div>
  );
}
