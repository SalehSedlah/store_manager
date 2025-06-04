
"use client";

import type { Debtor, Transaction } from "@/types/debt";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { toast } from "@/hooks/use-toast";

interface DebtorsContextType {
  debtors: Debtor[];
  addDebtor: (debtorData: Omit<Debtor, "id" | "lastUpdated" | "userId" | "transactions" | "amountOwed">, initialAmount: number) => void;
  updateDebtorInfo: (debtorId: string, debtorInfo: Pick<Debtor, "name" | "phoneNumber" | "creditLimit" | "paymentHistory">) => void;
  deleteDebtor: (id: string) => void;
  addTransaction: (debtorId: string, transactionData: Omit<Transaction, "id" | "date">) => void;
  loadingDebtors: boolean;
  getDebtorById: (id: string) => Debtor | undefined;
  calculateAmountOwed: (transactions: Transaction[]) => number;
}

const DebtorsContext = createContext<DebtorsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = "debtvision_debtors_";

const calculateAmountOwedInternal = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, tx) => {
    switch (tx.type) {
      case 'initial_balance':
      case 'new_credit':
      case 'adjustment_increase':
        return balance + tx.amount;
      case 'payment':
      case 'adjustment_decrease':
        return balance - tx.amount;
      default:
        return balance;
    }
  }, 0);
};


export function DebtorsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loadingDebtors, setLoadingDebtors] = useState(true);

  const toastAutoAlertTitle = "تم تفعيل التنبيه التلقائي";
  const toastDebtorAddedOverLimit = (name: string, phone?: string) => 
    `تمت إضافة ${name} وتجاوز الحد الائتماني. ${phone ? `تم محاكاة إرسال إشعار إلى ${phone}.` : 'تم محاكاة إرسال إشعار (رقم الهاتف مفقود).'}`;
  const toastDebtorExceededLimit = (name: string, phone?: string) =>
    `${name} تجاوز الآن الحد الائتماني. ${phone ? `تم محاكاة إرسال إشعار إلى ${phone}.` : 'تم محاكاة إرسال إشعار (رقم الهاتف مفقود).'}`;
  const toastTransactionAdded = "تمت إضافة المعاملة";
  // const toastTransactionFailed = "فشل في إضافة المعاملة"; // Not currently used with specific message
  const toastDebtorInfoUpdated = "تم تحديث معلومات المدين";


  const getStorageKey = useCallback(() => user ? `${LOCAL_STORAGE_KEY_PREFIX}${user.uid}` : null, [user]);

  useEffect(() => {
    setLoadingDebtors(true);
    const storageKey = getStorageKey();
    if (typeof window !== "undefined" && storageKey) {
      try {
        const storedDebtorsString = localStorage.getItem(storageKey);
        if (storedDebtorsString) {
          const storedDebtors: Debtor[] = JSON.parse(storedDebtorsString);
          const debtorsWithCalculatedAmounts = storedDebtors.map(d => ({
            ...d,
            amountOwed: calculateAmountOwedInternal(d.transactions || []),
            transactions: d.transactions || []
          }));
          setDebtors(debtorsWithCalculatedAmounts);
        } else {
          setDebtors([]);
        }
      } catch (error) {
        console.error("فشل تحميل المدينين من localStorage:", error);
        setDebtors([]);
      }
    } else if (!user) {
        setDebtors([]);
    }
    setLoadingDebtors(false);
  }, [user, getStorageKey]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (typeof window !== "undefined" && storageKey && !loadingDebtors) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(debtors));
      } catch (error) {
        console.error("فشل حفظ المدينين في localStorage:", error);
      }
    }
  }, [debtors, user, loadingDebtors, getStorageKey]);

  const addDebtor = (debtorData: Omit<Debtor, "id" | "lastUpdated" | "userId" | "transactions" | "amountOwed">, initialAmount: number) => {
    const initialTransaction: Transaction = {
      id: Date.now().toString() + "_tx",
      date: new Date().toISOString(),
      type: 'initial_balance',
      amount: initialAmount,
      description: 'رصيد افتتاحي',
    };

    const newDebtor: Debtor = {
      ...debtorData,
      id: Date.now().toString(),
      userId: user?.uid,
      lastUpdated: new Date().toISOString(),
      transactions: [initialTransaction],
      amountOwed: calculateAmountOwedInternal([initialTransaction]),
    };
    setDebtors((prevDebtors) => [...prevDebtors, newDebtor]);

    if (newDebtor.amountOwed > newDebtor.creditLimit) {
      toast({
        title: toastAutoAlertTitle,
        description: toastDebtorAddedOverLimit(newDebtor.name, newDebtor.phoneNumber),
        variant: newDebtor.phoneNumber ? "default" : "destructive",
      });
    }
  };

  const updateDebtorInfo = (debtorId: string, debtorInfo: Pick<Debtor, "name" | "phoneNumber" | "creditLimit" | "paymentHistory">) => {
    setDebtors(prevDebtors => 
      prevDebtors.map(d => {
        if (d.id === debtorId) {
          const wasOverLimit = d.amountOwed > d.creditLimit;
          const updatedDebtor = {
            ...d,
            ...debtorInfo,
            lastUpdated: new Date().toISOString(),
          };
          const isNowOverLimit = updatedDebtor.amountOwed > updatedDebtor.creditLimit;

          if (!wasOverLimit && isNowOverLimit) {
             toast({
                title: toastAutoAlertTitle,
                description: toastDebtorExceededLimit(updatedDebtor.name, updatedDebtor.phoneNumber),
                variant: updatedDebtor.phoneNumber ? "default" : "destructive",
             });
          }
          return updatedDebtor;
        }
        return d;
      })
    );
    toast({title: toastDebtorInfoUpdated});
  };


  const addTransaction = (debtorId: string, transactionData: Omit<Transaction, "id" | "date">) => {
    setDebtors(prevDebtors => 
      prevDebtors.map(debtor => {
        if (debtor.id === debtorId) {
          const newTransaction: Transaction = {
            ...transactionData,
            id: Date.now().toString() + "_tx",
            date: new Date().toISOString(),
          };
          const updatedTransactions = [...(debtor.transactions || []), newTransaction];
          const newAmountOwed = calculateAmountOwedInternal(updatedTransactions);
          
          const updatedDebtor = {
            ...debtor,
            transactions: updatedTransactions,
            amountOwed: newAmountOwed,
            lastUpdated: new Date().toISOString(),
          };

          const wasOverLimit = calculateAmountOwedInternal(debtor.transactions) > debtor.creditLimit;
          const isNowOverLimit = newAmountOwed > debtor.creditLimit;

          if (!wasOverLimit && isNowOverLimit && (newTransaction.type === 'new_credit' || newTransaction.type === 'adjustment_increase' || newTransaction.type === 'initial_balance')) {
            toast({
              title: toastAutoAlertTitle,
              description: toastDebtorExceededLimit(updatedDebtor.name, updatedDebtor.phoneNumber),
              variant: updatedDebtor.phoneNumber ? "default" : "destructive",
            });
          }
          toast({ title: toastTransactionAdded, description: `تمت إضافة معاملة (${transactionData.type}) بمبلغ ${transactionData.amount} لـ ${debtor.name}.` });
          return updatedDebtor;
        }
        return debtor;
      })
    );
  };

  const deleteDebtor = (id: string) => {
    setDebtors((prevDebtors) => prevDebtors.filter((debtor) => debtor.id !== id));
  };

  const getDebtorById = (id: string): Debtor | undefined => {
    return debtors.find(debtor => debtor.id === id);
  };

  return (
    <DebtorsContext.Provider value={{ 
        debtors, 
        addDebtor, 
        updateDebtorInfo, 
        deleteDebtor, 
        addTransaction, 
        loadingDebtors, 
        getDebtorById,
        calculateAmountOwed: calculateAmountOwedInternal
    }}>
      {children}
    </DebtorsContext.Provider>
  );
}

export function useDebtors() {
  const context = useContext(DebtorsContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useDebtors ضمن DebtorsProvider");
  }
  return context;
}
