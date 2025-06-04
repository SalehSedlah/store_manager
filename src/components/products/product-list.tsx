
"use client";

import type { Product } from "@/types/grocery";
import { useProducts } from "@/contexts/products-context";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductForm } from "./product-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

export function ProductList() {
  const { products, deleteProduct, loadingProducts } = useProducts();
  const { toast } = useToast();

  const noProductsText = "No products found. Add a new product to get started.";
  const nameHeader = "Name";
  const categoryHeader = "Category";
  const unitHeader = "Unit";
  const currentStockHeader = "Current Stock";
  const lowStockThresholdHeader = "Low Stock Threshold";
  const statusHeader = "Status";
  const lastUpdatedHeader = "Last Updated";
  const actionsHeader = "Actions";
  
  const statusLowStock = "Low Stock";
  const statusInStock = "In Stock";
  const statusOutOfStock = "Out of Stock";

  const editActionText = "Edit Product";
  const deleteActionText = "Delete Product";
  const deleteDialogTitle = "Are you sure?";
  const deleteDialogDescription = (name: string) => `This action cannot be undone. This will permanently delete the product: ${name}.`;
  const deleteDialogCancel = "Cancel";
  const deleteDialogConfirm = "Delete";

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    // Toast is handled by context
  };

  if (loadingProducts) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">{noProductsText}</p>;
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{nameHeader}</TableHead>
            <TableHead>{categoryHeader}</TableHead>
            <TableHead>{unitHeader}</TableHead>
            <TableHead className="text-right rtl:text-left">{currentStockHeader}</TableHead>
            <TableHead className="text-right rtl:text-left">{lowStockThresholdHeader}</TableHead>
            <TableHead>{statusHeader}</TableHead>
            <TableHead className="text-right rtl:text-left">{lastUpdatedHeader}</TableHead>
            <TableHead className="text-right rtl:text-left">{actionsHeader}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isLowStock = product.currentStock <= product.lowStockThreshold && product.currentStock > 0;
            const isOutOfStock = product.currentStock === 0;
            const lastUpdatedFormatted = new Date(product.lastUpdated).toLocaleDateString();
            
            let statusBadge;
            if (isOutOfStock) {
                statusBadge = <Badge variant="destructive" className="flex items-center gap-1 w-fit"><AlertTriangle className="h-3 w-3" />{statusOutOfStock}</Badge>;
            } else if (isLowStock) {
                statusBadge = <Badge variant="secondary" className="flex items-center gap-1 w-fit bg-yellow-500 text-black hover:bg-yellow-600"><AlertTriangle className="h-3 w-3" />{statusLowStock}</Badge>;
            } else {
                statusBadge = <Badge variant="default" className="bg-green-600 hover:bg-green-700">{statusInStock}</Badge>;
            }
            
            return (
              <TableRow key={product.id} className={isOutOfStock ? "bg-destructive/10" : (isLowStock ? "bg-yellow-500/10" : "")}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.category}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.unit}</TableCell>
                <TableCell className="text-right rtl:text-left font-semibold">{product.currentStock}</TableCell>
                <TableCell className="text-right rtl:text-left">{product.lowStockThreshold}</TableCell>
                <TableCell>{statusBadge}</TableCell>
                <TableCell className="text-right rtl:text-left text-sm text-muted-foreground">{lastUpdatedFormatted}</TableCell>
                <TableCell className="text-right rtl:text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu for {product.name}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <ProductForm
                        product={product}
                        triggerButton={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {editActionText}
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {deleteActionText}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {deleteDialogDescription(product.name)}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{deleteDialogCancel}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id, product.name)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              {deleteDialogConfirm}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
