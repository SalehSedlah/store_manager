
"use client";

import type { Debtor } from "@/types/debt";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./auth-context";
import { toast } from "@/hooks/use-toast"; // Import the toast function

// For a real app, you'd use Firebase Firestore here
// For this example, we'll use localStorage for persistence to simulate a backend
// and make data available across sessions and pages.

interface DebtorsContextType {
  debtors: Debtor[];
  addDebtor: (debtor: Omit<Debtor, "id" | "lastUpdated" | "userId">) => void;
  updateDebtor: (debtor: Debtor) => void;
  deleteDebtor: (id: string) => void;
  loadingDebtors: boolean;
  getDebtorById: (id: string) => Debtor | undefined;
}

const DebtorsContext = createContext<DebtorsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = "debtvision_debtors_";

export function DebtorsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loadingDebtors, setLoadingDebtors] = useState(true);

  // Hardcoded toast messages in English
  const toastAutoAlertTitle = "Automatic Alert Triggered";
  const toastDebtorAddedOverLimit = (name: string, phone?: string) => 
    `${name} was added exceeding the credit limit. ${phone ? `A notification to ${phone} has been simulated.` : 'A notification has been simulated (phone number missing).'}`;
  const toastDebtorExceededLimit = (name: string, phone?: string) =>
    `${name} has now exceeded the credit limit. ${phone ? `A notification to ${phone} has been simulated.` : 'A notification has been simulated (phone number missing).'}`;


  const getStorageKey = () => user ? `${LOCAL_STORAGE_KEY_PREFIX}${user.uid}` : null;

  useEffect(() => {
    setLoadingDebtors(true);
    const storageKey = getStorageKey();
    if (typeof window !== "undefined" && storageKey) {
      try {
        const storedDebtors = localStorage.getItem(storageKey);
        if (storedDebtors) {
          setDebtors(JSON.parse(storedDebtors));
        } else {
          setDebtors([]); // Initialize if nothing is stored for this user
        }
      } catch (error) {
        console.error("Failed to load debtors from localStorage:", error);
        setDebtors([]);
      }
    } else if (!user) {
        setDebtors([]); // Clear debtors if no user
    }
    setLoadingDebtors(false);
  }, [user]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (typeof window !== "undefined" && storageKey && !loadingDebtors) { // Only save if not initially loading
      try {
        localStorage.setItem(storageKey, JSON.stringify(debtors));
      } catch (error) {
        console.error("Failed to save debtors to localStorage:", error);
      }
    }
  }, [debtors, user, loadingDebtors]);

  const addDebtor = (debtorData: Omit<Debtor, "id" | "lastUpdated" | "userId">) => {
    const newDebtor: Debtor = {
      ...debtorData,
      id: Date.now().toString(), // Simple ID generation
      userId: user?.uid,
      lastUpdated: new Date().toISOString(),
    };
    setDebtors((prevDebtors) => [...prevDebtors, newDebtor]);

    if (newDebtor.amountOwed > newDebtor.creditLimit) {
      toast({
        title: toastAutoAlertTitle,
        description: toastDebtorAddedOverLimit(newDebtor.name, newDebtor.phoneNumber),
        variant: newDebtor.phoneNumber ? "default" : "destructive", // Destructive if no phone for alert
      });
    }
  };

  const updateDebtor = (updatedDebtorData: Debtor) => {
    const existingDebtor = debtors.find(d => d.id === updatedDebtorData.id);
    const newDebtorState: Debtor = {
        ...updatedDebtorData,
        lastUpdated: new Date().toISOString(),
        userId: user?.uid
    };

    setDebtors((prevDebtors) =>
      prevDebtors.map((debtor) =>
        debtor.id === newDebtorState.id ? newDebtorState : debtor
      )
    );

    if (existingDebtor) {
      const wasOverLimit = existingDebtor.amountOwed > existingDebtor.creditLimit;
      const isNowOverLimit = newDebtorState.amountOwed > newDebtorState.creditLimit;

      if (!wasOverLimit && isNowOverLimit) {
        toast({
          title: toastAutoAlertTitle,
          description: toastDebtorExceededLimit(newDebtorState.name, newDebtorState.phoneNumber),
          variant: newDebtorState.phoneNumber ? "default" : "destructive",
        });
      }
    }
  };

  const deleteDebtor = (id: string) => {
    setDebtors((prevDebtors) => prevDebtors.filter((debtor) => debtor.id !== id));
  };

  const getDebtorById = (id: string): Debtor | undefined => {
    return debtors.find(debtor => debtor.id === id);
  };


  return (
    <DebtorsContext.Provider value={{ debtors, addDebtor, updateDebtor, deleteDebtor, loadingDebtors, getDebtorById }}>
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
