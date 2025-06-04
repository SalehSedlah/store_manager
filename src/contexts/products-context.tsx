
"use client";

import type { Product } from "@/types/grocery";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { toast } from "@/hooks/use-toast";

interface ProductsContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, "id" | "lastUpdated" | "userId">) => void;
  updateProduct: (productId: string, productData: Omit<Product, "id" | "lastUpdated" | "userId">) => void;
  deleteProduct: (id: string) => void;
  loadingProducts: boolean;
  getProductById: (id: string) => Product | undefined;
  updateStock: (productId: string, newStock: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = "debtvision_products_";

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const toastProductAdded = "تمت إضافة المنتج";
  const toastProductUpdated = "تم تحديث المنتج";
  const toastProductDeleted = "تم حذف المنتج";
  const toastStockUpdated = "تم تحديث المخزون";
  // const toastError = "خطأ"; // Not currently used with specific message

  const getStorageKey = useCallback(() => user ? `${LOCAL_STORAGE_KEY_PREFIX}${user.uid}` : null, [user]);

  useEffect(() => {
    setLoadingProducts(true);
    const storageKey = getStorageKey();
    if (typeof window !== "undefined" && storageKey) {
      try {
        const storedProductsString = localStorage.getItem(storageKey);
        if (storedProductsString) {
          setProducts(JSON.parse(storedProductsString));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("فشل تحميل المنتجات من localStorage:", error);
        setProducts([]);
      }
    } else if (!user) {
      setProducts([]);
    }
    setLoadingProducts(false);
  }, [user, getStorageKey]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (typeof window !== "undefined" && storageKey && !loadingProducts) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(products));
      } catch (error) {
        console.error("فشل حفظ المنتجات في localStorage:", error);
      }
    }
  }, [products, user, loadingProducts, getStorageKey]);

  const addProduct = (productData: Omit<Product, "id" | "lastUpdated" | "userId">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      userId: user?.uid,
      lastUpdated: new Date().toISOString(),
    };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    toast({ title: toastProductAdded, description: `تمت إضافة ${newProduct.name}.` });
  };

  const updateProduct = (productId: string, productData: Omit<Product, "id" | "lastUpdated" | "userId">) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, ...productData, lastUpdated: new Date().toISOString() }
          : p
      )
    );
    toast({ title: toastProductUpdated, description: `تم تحديث ${productData.name}.` });
  };

  const deleteProduct = (id: string) => {
    const productName = products.find(p => p.id === id)?.name || "المنتج";
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    toast({ title: toastProductDeleted, description: `تم حذف ${productName}.` });
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, currentStock: newStock, lastUpdated: new Date().toISOString() }
          : p
      )
    );
    const productName = products.find(p => p.id === productId)?.name || "المنتج";
    toast({ title: toastStockUpdated, description: `تم تحديث مخزون ${productName} إلى ${newStock}.` });
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
