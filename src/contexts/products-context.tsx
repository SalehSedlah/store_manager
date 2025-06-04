
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
  updateStock: (productId: string, newStock: number) => void; // For direct stock updates initially
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = "debtvision_products_";

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const toastProductAdded = "Product Added";
  const toastProductUpdated = "Product Updated";
  const toastProductDeleted = "Product Deleted";
  const toastStockUpdated = "Stock Updated";
  const toastError = "Error";

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
        console.error("Failed to load products from localStorage:", error);
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
        console.error("Failed to save products to localStorage:", error);
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
    toast({ title: toastProductAdded, description: `${newProduct.name} has been added.` });
  };

  const updateProduct = (productId: string, productData: Omit<Product, "id" | "lastUpdated" | "userId">) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, ...productData, lastUpdated: new Date().toISOString() }
          : p
      )
    );
    toast({ title: toastProductUpdated, description: `${productData.name} has been updated.` });
  };

  const deleteProduct = (id: string) => {
    const productName = products.find(p => p.id === id)?.name || "Product";
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    toast({ title: toastProductDeleted, description: `${productName} has been deleted.` });
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
    const productName = products.find(p => p.id === productId)?.name || "Product";
    toast({ title: toastStockUpdated, description: `Stock for ${productName} updated to ${newStock}.` });
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
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
