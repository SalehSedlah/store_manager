
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string; // e.g., 'piece', 'kg', 'liter', 'pack'
  pricePerUnit: number; // سعر الوحدة الواحدة
  currentStock: number;
  lowStockThreshold: number;
  userId?: string; // To associate with the logged-in user
  lastUpdated: string; // ISO date string
}

