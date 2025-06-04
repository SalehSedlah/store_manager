
"use client";

import type { Debtor, Transaction, TransactionType } from "@/types/debt";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { toast } from "@/hooks/use-toast";
import { generateWhatsappReminder, type WhatsappReminderInput, prepareTransactionsForReminder } from "@/ai/flows/whatsapp-reminder-flow";
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
  payment: "دفعة",
  new_credit: "دين جديد",
  adjustment_increase: "تسوية (زيادة)",
  adjustment_decrease: "تسوية (نقصان)",
  full_settlement: "دفع كامل سداد",
  // 'initial_balance' removed as initial debt is now 'new_credit'
};

const calculateAmountOwedInternal = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, tx) => {
    let newBalance = balance;
    const amount = Number(tx.amount); 

    if (isNaN(amount) || !isFinite(amount)) {
      console.error(`Invalid or non-finite amount in transaction, skipping:`, tx);
      return balance; 
    }

    switch (tx.type) {
      case 'new_credit': // Includes initial debt recorded as 'new_credit'
      case 'adjustment_increase':
        newBalance += amount;
        break;
      case 'payment':
      case 'adjustment_decrease':
      case 'full_settlement':
        newBalance -= amount;
        break;
      default:
        console.warn(`Unknown transaction type: ${tx.type}`);
        return balance; 
    }
    return parseFloat(newBalance.toFixed(2));
  }, 0);
};


export function DebtorsProvider({ children }: { children: ReactNode }) {
  const { user, businessName: appBusinessName } = useAuth(); // Get businessName from AuthContext
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
            transactions: (d.transactions || []).map(tx => ({...tx, amount: Number(tx.amount) || 0})),
            amountOwed: calculateAmountOwedInternal(d.transactions || []),
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

    if ((justExceededLimit || newDebtorOverLimit) && debtor.phoneNumber) { // Only proceed if phone number exists
      try {
        const transactionsForReminder = await prepareTransactionsForReminder(debtor.transactions || []);

        const input: WhatsappReminderInput = {
          debtorName: debtor.name,
          amountOwed: debtor.amountOwed,
          creditLimit: debtor.creditLimit,
          transactions: transactionsForReminder,
          debtorPhoneNumber: debtor.phoneNumber,
          businessName: appBusinessName || "متجرك", 
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
    } else if (justExceededLimit || newDebtorOverLimit) {
        // Debtor exceeded limit but no phone number
        setTimeout(() => {
            toast({
                title: `تنبيه: ${debtor.name} تجاوز(ت) الحد الائتماني`,
                description: `المبلغ المستحق: ${debtor.amountOwed.toLocaleString('ar-EG')}، الحد الائتماني: ${debtor.creditLimit.toLocaleString('ar-EG')}. لا يوجد رقم هاتف مسجل لإرسال تذكير واتساب.`,
                variant: "default",
                duration: 10000,
            });
        }, 0);
    }
  };

  const addDebtor = (debtorData: Omit<Debtor, "id" | "lastUpdated" | "userId" | "transactions" | "amountOwed">, initialAmount: number) => {
    const initialTransactionAmount = Number(initialAmount) || 0;
    const newTransactions: Transaction[] = [];

    if (initialTransactionAmount > 0) {
      newTransactions.push({
        id: Date.now().toString() + "_tx_init_credit", 
        date: new Date().toISOString(),
        type: 'new_credit', 
        amount: initialTransactionAmount,
        description: undefined, // Makes it appear as a standard new credit without special description
      });
    }

    const newDebtor: Debtor = {
      ...debtorData,
      id: Date.now().toString(),
      userId: user?.uid,
      lastUpdated: new Date().toISOString(),
      transactions: newTransactions,
      amountOwed: calculateAmountOwedInternal(newTransactions),
    };
    setDebtors((prevDebtors) => [...prevDebtors, newDebtor]);
    setTimeout(() => {
        toast({ title: toastDebtorAddedTitle, description: `تمت إضافة ${newDebtor.name}.` });
    }, 0);
    
    // Check if new debtor is over limit after creation
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
            id: Date.now().toString() + "_tx_" + Math.random().toString(36).substring(2, 7),
            date: new Date().toISOString(),
            amount: Number(transactionData.amount) || 0, 
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
            toast({ title: toastTransactionAdded, description: `تمت إضافة معاملة (${transactionTypeArabic[transactionData.type] || transactionData.type}) بمبلغ ${newTransaction.amount.toLocaleString('ar-EG')} لـ ${debtor.name}.` });
          }, 0);
          
          debtorForReminder = updatedDebtor;
          return updatedDebtor;
        }
        return debtor;
      })
    );

    if (debtorForReminder && (transactionData.type === 'new_credit' || transactionData.type === 'adjustment_increase')) {
        triggerWhatsappReminderIfNeeded(debtorForReminder, wasOverLimitBeforeTransaction);
    }
  };

  const deleteDebtor = (id: string) => {
    setDebtors((prevDebtors) => prevDebtors.filter((debtor) => debtor.id !== id));
  };

  const getDebtorById = useCallback((id: string): Debtor | undefined => {
    return debtors.find(debtor => debtor.id === id);
  }, [debtors]);

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

