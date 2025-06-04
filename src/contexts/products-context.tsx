
"use client";

import type { Product } from "@/types/grocery";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";

interface ProductsContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, "id" | "lastUpdated" | "userId" | "quantitySold">) => Promise<void>;
  updateProduct: (productId: string, productData: Omit<Product, "id" | "lastUpdated" | "userId">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadingProducts: boolean;
  getProductById: (id: string) => Product | undefined;
  updateStock: (productId: string, newStock: number) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const toastProductAddedTitle = "تمت إضافة المنتج";
  const toastProductUpdatedTitle = "تم تحديث المنتج";
  const toastProductDeletedTitle = "تم حذف المنتج";
  const toastStockUpdatedTitle = "تم تحديث المخزون";
  const firestoreErrorToastTitle = "خطأ في قاعدة البيانات";

  const convertToProductType = (docSnap: any): Product => {
    const data = docSnap.data();
    const pricePerUnitVal = Number(data.pricePerUnit);
    const purchasePricePerUnitVal = data.purchasePricePerUnit !== undefined ? Number(data.purchasePricePerUnit) : undefined;
    const currentStockVal = Number(data.currentStock);
    const lowStockThresholdVal = Number(data.lowStockThreshold);
    const quantitySoldVal = Number(data.quantitySold);
    let piecesInUnitVal: number | undefined = undefined;
    if (data.piecesInUnit !== undefined && data.piecesInUnit !== null) {
        const numPieces = Number(data.piecesInUnit);
        if (!isNaN(numPieces)) {
            piecesInUnitVal = numPieces;
        } else {
            console.warn(`Product ID ${docSnap.id} ('${data.name}') has invalid piecesInUnit: '${data.piecesInUnit}'. Treating as no pieces info.`);
        }
    }

    if (isNaN(pricePerUnitVal)) {
      console.warn(`Product ID ${docSnap.id} ('${data.name}') has invalid pricePerUnit: '${data.pricePerUnit}'. Defaulting to 0.`);
    }
    if (purchasePricePerUnitVal !== undefined && isNaN(purchasePricePerUnitVal)) {
        console.warn(`Product ID ${docSnap.id} ('${data.name}') has invalid purchasePricePerUnit: '${data.purchasePricePerUnit}'. Defaulting to undefined.`);
    }
    if (isNaN(currentStockVal)) {
      console.warn(`Product ID ${docSnap.id} ('${data.name}') has invalid currentStock: '${data.currentStock}'. Defaulting to 0.`);
    }
    if (isNaN(lowStockThresholdVal)) {
      console.warn(`Product ID ${docSnap.id} ('${data.name}') has invalid lowStockThreshold: '${data.lowStockThreshold}'. Defaulting to 0.`);
    }
    if (isNaN(quantitySoldVal)) {
      console.warn(`Product ID ${docSnap.id} ('${data.name}') has invalid quantitySold: '${data.quantitySold}'. Defaulting to 0.`);
    }
    
    return {
      id: docSnap.id,
      ...data,
      pricePerUnit: isNaN(pricePerUnitVal) ? 0 : pricePerUnitVal,
      purchasePricePerUnit: purchasePricePerUnitVal !== undefined && isNaN(purchasePricePerUnitVal) ? undefined : purchasePricePerUnitVal,
      currentStock: isNaN(currentStockVal) ? 0 : currentStockVal,
      lowStockThreshold: isNaN(lowStockThresholdVal) ? 0 : lowStockThresholdVal,
      piecesInUnit: piecesInUnitVal,
      quantitySold: isNaN(quantitySoldVal) ? 0 : quantitySoldVal,
      lastUpdated: (data.lastUpdated as Timestamp)?.toDate ? (data.lastUpdated as Timestamp).toDate().toISOString() : new Date().toISOString(),
    } as Product;
  };


  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);
    const productsColRef = collection(db, `users/${user.uid}/products`);
    const q = query(productsColRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts: Product[] = snapshot.docs.map(convertToProductType);
      setProducts(fetchedProducts);
      setLoadingProducts(false);
    }, (error) => {
      console.error("Error fetching products from Firestore:", error);
      toast({ title: firestoreErrorToastTitle, description: "فشل تحميل بيانات المنتجات. " + error.message, variant: "destructive"});
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addProduct = async (productData: Omit<Product, "id" | "lastUpdated" | "userId" | "quantitySold">) => {
    if (!user) {
        toast({title: firestoreErrorToastTitle, description: "يجب تسجيل الدخول لإضافة منتج.", variant: "destructive"});
        return;
    }
    
    const newProductDataForFirestore: Record<string, any> = { // Use Record<string, any> for easier manipulation before sending
      ...productData,
      pricePerUnit: Number(productData.pricePerUnit) || 0,
      purchasePricePerUnit: productData.purchasePricePerUnit !== undefined ? (Number(productData.purchasePricePerUnit) || 0) : undefined,
      currentStock: Number(productData.currentStock) || 0,
      lowStockThreshold: Number(productData.lowStockThreshold) || 0,
      piecesInUnit: (productData.piecesInUnit !== undefined && productData.piecesInUnit !== null) ? (Number(productData.piecesInUnit) || 0) : undefined,
      quantitySold: 0, 
      userId: user.uid,
      lastUpdated: serverTimestamp(),
    };

    // Remove undefined fields before sending to Firestore
    Object.keys(newProductDataForFirestore).forEach(key => {
      if (newProductDataForFirestore[key] === undefined) {
        delete newProductDataForFirestore[key];
      }
    });

    try {
      const productsColRef = collection(db, `users/${user.uid}/products`);
      await addDoc(productsColRef, newProductDataForFirestore);
      setTimeout(() => {
          toast({ title: toastProductAddedTitle, description: `تمت إضافة ${productData.name}.` });
      }, 0);
    } catch (error: any) {
      console.error("Error adding product to Firestore:", error);
      toast({title: firestoreErrorToastTitle, description: "فشل إضافة المنتج. " + error.message, variant: "destructive"});
    }
  };

  const updateProduct = async (productId: string, productData: Omit<Product, "id" | "lastUpdated" | "userId">) => {
    if (!user) {
        toast({title: firestoreErrorToastTitle, description: "يجب تسجيل الدخول لتحديث المنتج.", variant: "destructive"});
        return;
    }
    const productDocRef = doc(db, `users/${user.uid}/products`, productId);
    
    const updatedProductDataForFirestore: Record<string, any> = { // Use Record<string, any> for easier manipulation
      ...productData,
      pricePerUnit: Number(productData.pricePerUnit) || 0,
      purchasePricePerUnit: productData.purchasePricePerUnit !== undefined ? (Number(productData.purchasePricePerUnit) || 0) : undefined,
      currentStock: Number(productData.currentStock) || 0,
      lowStockThreshold: Number(productData.lowStockThreshold) || 0,
      piecesInUnit: (productData.piecesInUnit !== undefined && productData.piecesInUnit !== null) ? (Number(productData.piecesInUnit) || 0) : undefined,
      quantitySold: productData.quantitySold !== undefined ? (Number(productData.quantitySold) || 0) : 0, 
      lastUpdated: serverTimestamp(),
    };

    Object.keys(updatedProductDataForFirestore).forEach(key => {
      if (updatedProductDataForFirestore[key] === undefined) {
        delete updatedProductDataForFirestore[key];
      }
    });

    try {
      await updateDoc(productDocRef, updatedProductDataForFirestore);
      setTimeout(() => {
          toast({ title: toastProductUpdatedTitle, description: `تم تحديث ${productData.name}.` });
      },0);
    } catch (error: any) {
      console.error("Error updating product in Firestore:", error);
      toast({title: firestoreErrorToastTitle, description: "فشل تحديث المنتج. " + error.message, variant: "destructive"});
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) {
        toast({title: firestoreErrorToastTitle, description: "يجب تسجيل الدخول لحذف المنتج.", variant: "destructive"});
        return;
    }
    const productDocRef = doc(db, `users/${user.uid}/products`, id);
    const productName = products.find(p => p.id === id)?.name || "المنتج";
    try {
      await deleteDoc(productDocRef);
      setTimeout(() => {
        toast({ title: toastProductDeletedTitle, description: `تم حذف ${productName}.` });
      }, 0);
    } catch (error: any) {
      console.error("Error deleting product from Firestore:", error);
      toast({title: firestoreErrorToastTitle, description: "فشل حذف المنتج. " + error.message, variant: "destructive"});
    }
  };

  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(product => product.id === id);
  }, [products]);

  const updateStock = async (productId: string, newStock: number) => {
    if (!user) {
        toast({title: firestoreErrorToastTitle, description: "يجب تسجيل الدخول لتحديث المخزون.", variant: "destructive"});
        return;
    }
    const productDocRef = doc(db, `users/${user.uid}/products`, productId);
    const productName = products.find(p => p.id === productId)?.name || "المنتج";
    try {
      await updateDoc(productDocRef, {
        currentStock: Number(newStock) || 0,
        lastUpdated: serverTimestamp(),
      });
      setTimeout(() => {
        toast({ title: toastStockUpdatedTitle, description: `تم تحديث مخزون ${productName} إلى ${newStock}.` });
      }, 0);
    } catch (error: any) {
      console.error("Error updating stock in Firestore:", error);
      toast({title: firestoreErrorToastTitle, description: "فشل تحديث المخزون. " + error.message, variant: "destructive"});
    }
  };

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      loadingProducts,
      getProductById,
      updateStock,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useProducts ضمن ProductsProvider");
  }
  return context;
}

