export type TransactionType = 
  | 'initial_balance' 
  | 'payment' 
  | 'new_credit' 
  | 'adjustment_increase' 
  | 'adjustment_decrease';

export interface Transaction {
  id: string;
  date: string; // ISO date string
  type: TransactionType;
  amount: number;
  description?: string;
}

export interface Debtor {
  id: string;
  name: string;
  amountOwed: number; // This will be calculated from transactions
  creditLimit: number;
  paymentHistory: string; // General summary, transactions provide details
  phoneNumber?: string;
  userId?: string;
  lastUpdated: string; // ISO date string
  transactions: Transaction[];
}
