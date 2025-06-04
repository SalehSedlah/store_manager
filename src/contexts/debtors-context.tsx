
"use client";

import type { Debtor, Transaction, TransactionType } from "@/types/debt";
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

// Helper function to calculate amount owed from transactions
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

  const toastAutoAlertTitle = "Automatic Alert Triggered";
  const toastDebtorAddedOverLimit = (name: string, phone?: string) => 
    `${name} was added exceeding the credit limit. ${phone ? `A notification to ${phone} has been simulated.` : 'A notification has been simulated (phone number missing).'}`;
  const toastDebtorExceededLimit = (name: string, phone?: string) =>
    `${name} has now exceeded the credit limit. ${phone ? `A notification to ${phone} has been simulated.` : 'A notification has been simulated (phone number missing).'}`;
  const toastTransactionAdded = "Transaction Added";
  const toastTransactionFailed = "Failed to Add Transaction";
  const toastDebtorInfoUpdated = "Debtor Info Updated";


  const getStorageKey = useCallback(() => user ? `${LOCAL_STORAGE_KEY_PREFIX}${user.uid}` : null, [user]);

  useEffect(() => {
    setLoadingDebtors(true);
    const storageKey = getStorageKey();
    if (typeof window !== "undefined" && storageKey) {
      try {
        const storedDebtorsString = localStorage.getItem(storageKey);
        if (storedDebtorsString) {
          const storedDebtors: Debtor[] = JSON.parse(storedDebtorsString);
          // Recalculate amountOwed for each debtor upon loading
          const debtorsWithCalculatedAmounts = storedDebtors.map(d => ({
            ...d,
            amountOwed: calculateAmountOwedInternal(d.transactions || []),
            transactions: d.transactions || [] // Ensure transactions array exists
          }));
          setDebtors(debtorsWithCalculatedAmounts);
        } else {
          setDebtors([]);
        }
      } catch (error) {
        console.error("Failed to load debtors from localStorage:", error);
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
        console.error("Failed to save debtors to localStorage:", error);
      }
    }
  }, [debtors, user, loadingDebtors, getStorageKey]);

  const addDebtor = (debtorData: Omit<Debtor, "id" | "lastUpdated" | "userId" | "transactions" | "amountOwed">, initialAmount: number) => {
    const initialTransaction: Transaction = {
      id: Date.now().toString() + "_tx",
      date: new Date().toISOString(),
      type: 'initial_balance',
      amount: initialAmount,
      description: 'Initial balance',
    };

    const newDebtor: Debtor = {
      ...debtorData,
      id: Date.now().toString(),
      userId: user?.uid,
      lastUpdated: new Date().toISOString(),
      transactions: [initialTransaction],
      amountOwed: calculateAmountOwedInternal([initialTransaction]), // Calculated from the initial transaction
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
          const updatedDebtor = {
            ...d,
            ...debtorInfo,
            lastUpdated: new Date().toISOString(),
          };
          // Check for credit limit alert only if creditLimit or related info changes
          // AmountOwed doesn't change here, so alert logic is based on new creditLimit
          const wasOverLimit = d.amountOwed > d.creditLimit;
          const isNowOverLimit = updatedDebtor.amountOwed > updatedDebtor.creditLimit;
          if (!wasOverLimit && isNowOverLimit) {
             toast({
                title: toastAutoAlertTitle,
                description: toastDebtorExceededLimit(updatedDebtor.name, updatedDebtor.phoneNumber),
                variant: updatedDebtor.phoneNumber ? "default" : "destructive",
             });
          } else if (wasOverLimit && !isNowOverLimit) {
            // Optional: Notify if debtor is no longer over limit due to credit limit increase
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

          // Credit limit alert logic
          const wasOverLimit = calculateAmountOwedInternal(debtor.transactions) > debtor.creditLimit;
          const isNowOverLimit = newAmountOwed > debtor.creditLimit;

          if (!wasOverLimit && isNowOverLimit && (newTransaction.type === 'new_credit' || newTransaction.type === 'adjustment_increase' || newTransaction.type === 'initial_balance')) {
            toast({
              title: toastAutoAlertTitle,
              description: toastDebtorExceededLimit(updatedDebtor.name, updatedDebtor.phoneNumber),
              variant: updatedDebtor.phoneNumber ? "default" : "destructive",
            });
          }
          toast({ title: toastTransactionAdded, description: `${transactionData.type} of $${transactionData.amount} for ${debtor.name}.` });
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
        calculateAmountOwed: calculateAmountOwedInternal // Expose the internal calculation function
    }}>
      {children}
    </DebtorsContext.Provider>
  );
}

export function useDebtors() {
  const context = useContext(DebtorsContext);
  if (context === undefined) {
    throw new Error("useDebtors must be used within a DebtorsProvider");
  }
  return context;
}
