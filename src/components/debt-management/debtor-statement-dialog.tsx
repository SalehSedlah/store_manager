
"use client";

import type { Debtor, Transaction } from "@/types/debt";
import { useDebtors } from "@/contexts/debtors-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddTransactionForm } from "./add-transaction-form";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";

interface DebtorStatementDialogProps {
  debtor: Debtor | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DebtorStatementDialog({ debtor: initialDebtor, isOpen, onOpenChange }: DebtorStatementDialogProps) {
  const { getDebtorById } = useDebtors();
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [currentDebtor, setCurrentDebtor] = useState<Debtor | null>(initialDebtor);

  useEffect(() => {
    if (initialDebtor?.id) {
      const updatedDebtorFromContext = getDebtorById(initialDebtor.id);
      setCurrentDebtor(updatedDebtorFromContext || null);
    } else {
      setCurrentDebtor(null);
    }
  }, [initialDebtor, getDebtorById, isOpen]);


  const dialogTitle = "كشف حساب المدين";
  const debtorNameLabel = "المدين:";
  const currentBalanceLabel = "الرصيد الحالي:";
  const transactionsHeader = "المعاملات";
  const dateHeader = "التاريخ";
  const typeHeader = "النوع";
  const descriptionHeader = "الوصف";
  const amountHeader = "المبلغ";
  const runningBalanceHeader = "الرصيد";
  const noTransactionsText = "لا توجد معاملات مسجلة لهذا المدين حتى الآن.";
  const addTransactionButtonText = "إضافة معاملة جديدة";
  const closeButtonText = "إغلاق";

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || !isFinite(amount)) {
      console.error(`Invalid amount passed to formatCurrency: ${amount}`);
      amount = 0; // Default to 0 if amount is not a valid finite number
    }
    return amount.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  const transactionTypeLabels: Record<Transaction['type'], string> = {
    initial_balance: "رصيد افتتاحي",
    payment: "دفعة",
    new_credit: "دين جديد",
    adjustment_increase: "تسوية (زيادة)",
    adjustment_decrease: "تسوية (نقصان)",
    full_settlement: "دفع كامل سداد",
  };
  
  const sortedTransactions = useMemo(() => {
    if (!currentDebtor || !currentDebtor.transactions) return [];
    return [...currentDebtor.transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
            return dateA - dateB;
        }
        return a.id.localeCompare(b.id);
    });
  }, [currentDebtor]);

  const transactionsWithRunningBalance = useMemo(() => {
    let runningBalance = 0;
    return sortedTransactions.map(tx => {
      let newRunningBalance = runningBalance;
      const currentTxAmount = Number(tx.amount); // Ensure tx.amount is treated as a number

      if (isNaN(currentTxAmount) || !isFinite(currentTxAmount)) {
        console.error('Invalid or non-finite amount in transaction for running balance calculation:', tx);
        // Keep runningBalance as is for this erroneous transaction
        // The 'amount' field in the returned object will reflect the (potentially NaN) original tx.amount
      } else {
        switch (tx.type) {
          case 'initial_balance':
          case 'new_credit':
          case 'adjustment_increase':
            newRunningBalance += currentTxAmount;
            break;
          case 'payment':
          case 'adjustment_decrease':
          case 'full_settlement':
            newRunningBalance -= currentTxAmount;
            break;
        }
      }
      runningBalance = parseFloat(newRunningBalance.toFixed(2));
      return { ...tx, runningBalance, amount: currentTxAmount }; // Pass numeric amount
    });
  }, [sortedTransactions]);

  const handleTransactionAdded = () => {
    setShowAddTransactionForm(false);
    if (currentDebtor?.id) {
      const updatedDebtor = getDebtorById(currentDebtor.id);
      setCurrentDebtor(updatedDebtor || null);
    }
  };

  if (!currentDebtor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{dialogTitle}</DialogTitle>
          <DialogDescription>
            {debtorNameLabel} <span className="font-semibold">{currentDebtor.name}</span> | {currentBalanceLabel} <span className="font-semibold text-lg">{formatCurrency(currentDebtor.amountOwed)}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <Button onClick={() => setShowAddTransactionForm(!showAddTransactionForm)} variant="outline">
            {showAddTransactionForm ? "إلغاء إضافة معاملة" : addTransactionButtonText}
          </Button>
          {showAddTransactionForm && (
            <AddTransactionForm 
                debtorId={currentDebtor.id} 
                currentAmountOwed={currentDebtor.amountOwed} 
                onTransactionAdded={handleTransactionAdded} 
            />
          )}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">{transactionsHeader}</h3>
        {transactionsWithRunningBalance.length > 0 ? (
          <ScrollArea className="h-[300px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dateHeader}</TableHead>
                  <TableHead>{typeHeader}</TableHead>
                  <TableHead>{descriptionHeader}</TableHead>
                  <TableHead className="text-left rtl:text-right">{amountHeader}</TableHead>
                  <TableHead className="text-left rtl:text-right">{runningBalanceHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsWithRunningBalance.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(tx.date)}</TableCell>
                    <TableCell>
                       <Badge variant={tx.type === 'payment' || tx.type === 'adjustment_decrease' || tx.type === 'full_settlement' ? 'secondary' : 'outline'}
                              className={tx.type === 'payment' || tx.type === 'adjustment_decrease' || tx.type === 'full_settlement' ? 'text-green-700 dark:text-green-400 border-green-500' : (tx.type === 'new_credit' || tx.type === 'adjustment_increase' || tx.type === 'initial_balance' ? 'text-red-700 dark:text-red-400 border-red-500' : '')}
                       >
                         {transactionTypeLabels[tx.type] || tx.type}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{tx.description || "غير متاح"}</TableCell>
                    <TableCell className={`text-left rtl:text-right font-medium ${ (typeof tx.amount === 'number' && !isNaN(tx.amount)) ? (tx.type === 'payment' || tx.type === 'adjustment_decrease' || tx.type === 'full_settlement' ? 'text-green-600' : 'text-red-600') : 'text-muted-foreground'}`}>
                      { (typeof tx.amount === 'number' && !isNaN(tx.amount)) ? (tx.type === 'payment' || tx.type === 'adjustment_decrease' || tx.type === 'full_settlement' ? '-' : '+') : ''}
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="text-left rtl:text-right font-semibold">{formatCurrency(tx.runningBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-4">{noTransactionsText}</p>
        )}
        <DialogClose asChild className="mt-6">
          <Button type="button" variant="outline">{closeButtonText}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
