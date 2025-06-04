
"use client";

import type { Debtor, Transaction, TransactionType } from "@/types/debt";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { toast } from "@/hooks/use-toast";
import { generateWhatsappReminder, type WhatsappReminderInput } from "@/ai/flows/whatsapp-reminder-flow";
import { WhatsappReminderToastAction } from "@/components/debt-management/whatsapp-reminder-toast-action";


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

const transactionTypeArabic: Record<TransactionType, string> = {
  initial_balance: "رصيد افتتاحي",
  payment: "دفعة",
  new_credit: "دين جديد",
  adjustment_increase: "تسوية (زيادة)",
  adjustment_decrease: "تسوية (نقصان)",
};

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

  const toastDebtorAddedTitle = "تمت إضافة المدين";
  const toastDebtorInfoUpdated = "تم تحديث معلومات المدين";
  const toastTransactionAdded = "تمت إضافة المعاملة";
  const whatsAppReminderPreparedTitle = (name: string) => `تذكير واتساب جاهز لـ ${name}`;
  const whatsAppReminderFailedTitle = "فشل إنشاء تذكير واتساب";


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

  const triggerWhatsappReminderIfNeeded = async (debtor: Debtor, wasOverLimitBefore?: boolean) => {
    const isCurrentlyOverLimit = debtor.amountOwed > debtor.creditLimit;
    
    let justExceededLimit = false;
    if (wasOverLimitBefore !== undefined) {
      justExceededLimit = wasOverLimitBefore === false && isCurrentlyOverLimit;
    }
    const newDebtorOverLimit = wasOverLimitBefore === undefined && isCurrentlyOverLimit;

    if (justExceededLimit || newDebtorOverLimit) {
      try {
        const relevantTransactions = (debtor.transactions || [])
          .map(tx => ({
            date: new Date(tx.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }),
            type: transactionTypeArabic[tx.type] || tx.type,
            amount: tx.amount,
            description: tx.description,
          }));

        const input: WhatsappReminderInput = {
          debtorName: debtor.name,
          amountOwed: debtor.amountOwed,
          creditLimit: debtor.creditLimit,
          transactions: relevantTransactions,
          debtorPhoneNumber: debtor.phoneNumber,
        };
        const result = await generateWhatsappReminder(input);
        setTimeout(() => {
          toast({
            title: whatsAppReminderPreparedTitle(debtor.name),
            description: result.whatsappMessage,
            duration: 20000, 
            action: <WhatsappReminderToastAction message={result.whatsappMessage} phoneNumber={debtor.phoneNumber} debtorName={debtor.name} />,
          });
        }, 0);
      } catch (error: any) {
        console.error("خطأ في إنشاء تذكير واتساب:", error);
        setTimeout(() => {
          toast({
            title: whatsAppReminderFailedTitle,
            description: error.message || "حدث خطأ غير متوقع.",
            variant: "destructive",
          });
        }, 0);
      }
    }
  };

  const addDebtor = (debtorData: Omit<Debtor, "id" | "lastUpdated" | "userId" | "transactions" | "amountOwed">, initialAmount: number) => {
    const initialTransaction: Transaction = {
      id: Date.now().toString() + "_tx_init",
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
    setTimeout(() => {
        toast({ title: toastDebtorAddedTitle, description: `تمت إضافة ${newDebtor.name}.` });
    }, 0);
    triggerWhatsappReminderIfNeeded(newDebtor); 
  };

  const updateDebtorInfo = (debtorId: string, debtorInfo: Pick<Debtor, "name" | "phoneNumber" | "creditLimit" | "paymentHistory">) => {
    let updatedDebtorForReminder: Debtor | null = null;
    let wasOverLimitBeforeUpdate: boolean | undefined = undefined;

    setDebtors(prevDebtors => 
      prevDebtors.map(d => {
        if (d.id === debtorId) {
          wasOverLimitBeforeUpdate = d.amountOwed > d.creditLimit;
          const updatedDebtor = {
            ...d,
            ...debtorInfo,
            lastUpdated: new Date().toISOString(),
          };
          updatedDebtorForReminder = updatedDebtor;
          return updatedDebtor;
        }
        return d;
      })
    );
    setTimeout(() => {
        toast({title: toastDebtorInfoUpdated, description: `تم تحديث معلومات ${debtorInfo.name}.`});
    },0);
    if (updatedDebtorForReminder) {
      triggerWhatsappReminderIfNeeded(updatedDebtorForReminder, wasOverLimitBeforeUpdate);
    }
  };


  const addTransaction = (debtorId: string, transactionData: Omit<Transaction, "id" | "date">) => {
    let debtorForReminder: Debtor | null = null;
    let wasOverLimitBeforeTransaction: boolean | undefined = undefined;

    setDebtors(prevDebtors => 
      prevDebtors.map(debtor => {
        if (debtor.id === debtorId) {
          wasOverLimitBeforeTransaction = debtor.amountOwed > debtor.creditLimit;
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
          
          setTimeout(() => {
            toast({ title: toastTransactionAdded, description: `تمت إضافة معاملة (${transactionTypeArabic[transactionData.type] || transactionData.type}) بمبلغ ${transactionData.amount} لـ ${debtor.name}.` });
          }, 0);
          
          debtorForReminder = updatedDebtor;
          return updatedDebtor;
        }
        return debtor;
      })
    );

    if (debtorForReminder && (transactionData.type === 'new_credit' || transactionData.type === 'adjustment_increase' || transactionData.type === 'initial_balance')) {
        triggerWhatsappReminderIfNeeded(debtorForReminder, wasOverLimitBeforeTransaction);
    }
  };

  const deleteDebtor = (id: string) => {
    setDebtors((prevDebtors) => prevDebtors.filter((debtor) => debtor.id !== id));
    // No toast here, as it's handled in DebtorList for user confirmation
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

    