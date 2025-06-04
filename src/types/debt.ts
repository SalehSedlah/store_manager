export interface Debtor {
  id: string;
  name: string;
  amountOwed: number;
  creditLimit: number;
  paymentHistory: string; // For AI analysis, can be simple like "good", "fair", "poor"
  phoneNumber?: string; // Optional phone number
  userId?: string; // To associate with a Firebase user
  lastUpdated: string; // ISO date string
}
