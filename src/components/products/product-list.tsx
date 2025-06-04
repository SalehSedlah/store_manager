
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
import { Skeleton } from "../ui/skeleton";
import { useMemo } from "react";

export function ProductList() {
  const { products, deleteProduct, loadingProducts } = useProducts();

  const noProductsText = "لم تقم بإضافة أي أصناف بعد. ابدأ بإضافة صنف جديد.";
  const nameHeader = "الاسم";
  const categoryHeader = "الفئة";
  const unitHeader = "الوحدة";
  const priceHeader = "سعر الوحدة";
  const currentStockHeader = "الكمية";
  const totalValueHeader = "القيمة الإجمالية";
  // const lowStockThresholdHeader = "حد المخزون المنخفض"; // Not displayed in table, but used for status
  const statusHeader = "الحالة";
  const lastUpdatedHeader = "آخر تحديث";
  const actionsHeader = "الإجراءات";
  
  const statusLowStock = "مخزون منخفض";
  const statusInStock = "متوفر";
  const statusOutOfStock = "نفد المخزون";

  const editActionText = "تعديل";
  const deleteActionText = "حذف";
  const deleteDialogTitle = "هل أنت متأكد؟";
  const deleteDialogDescription = (name: string) => `لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنتج: ${name} بشكل دائم.`;
  const deleteDialogCancel = "إلغاء";
  const deleteDialogConfirm = "حذف";
  const totalStockValueLabel = "إجمالي قيمة الأصناف في المخزون (الأرباح المحتملة):";

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.pricePerUnit * p.currentStock), 0);
  }, [products]);

  if (loadingProducts) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (products.length === 0 && !loadingProducts) {
    return <p className="text-center text-muted-foreground py-8">{noProductsText}</p>;
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{nameHeader}</TableHead>
              <TableHead>{categoryHeader}</TableHead>
              <TableHead className="text-left rtl:text-right">{priceHeader}</TableHead>
              <TableHead className="text-left rtl:text-right">{currentStockHeader}</TableHead>
              <TableHead className="text-left rtl:text-right">{unitHeader}</TableHead>
              <TableHead className="text-left rtl:text-right">{totalValueHeader}</TableHead>
              <TableHead>{statusHeader}</TableHead>
              <TableHead className="text-left rtl:text-right">{lastUpdatedHeader}</TableHead>
              <TableHead className="text-left rtl:text-right">{actionsHeader}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isLowStock = product.currentStock > 0 && product.currentStock <= product.lowStockThreshold;
              const isOutOfStock = product.currentStock === 0;
              const lastUpdatedFormatted = new Date(product.lastUpdated).toLocaleDateString('ar-EG');
              const productTotalValue = product.pricePerUnit * product.currentStock;
              
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
                  <TableCell className="text-left rtl:text-right">{formatCurrency(product.pricePerUnit)}</TableCell>
                  <TableCell className="text-left rtl:text-right font-semibold">{product.currentStock.toLocaleString('ar-EG')}</TableCell>
                  <TableCell className="text-left rtl:text-right text-sm text-muted-foreground">{product.unit}</TableCell>
                  <TableCell className="text-left rtl:text-right font-semibold">{formatCurrency(productTotalValue)}</TableCell>
                  <TableCell>{statusBadge}</TableCell>
                  <TableCell className="text-left rtl:text-right text-sm text-muted-foreground">{lastUpdatedFormatted}</TableCell>
                  <TableCell className="text-left rtl:text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة لـ {product.name}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <ProductForm
                          product={product}
                          triggerButton={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="ml-2 rtl:mr-0 rtl:ml-2 h-4 w-4" /> {editActionText}
                            </DropdownMenuItem>
                          }
                        />
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="ml-2 rtl:mr-0 rtl:ml-2 h-4 w-4" /> {deleteActionText}
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
      {products.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg font-semibold text-foreground">{totalStockValueLabel}</h3>
          <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(totalStockValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">هذا هو مجموع القيمة الإجمالية لكل الأصناف المخزنة (السعر × الكمية).</p>
        </div>
      )}
    </>
  );
}
