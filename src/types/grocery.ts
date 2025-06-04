
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string; // e.g., 'piece', 'kg', 'liter', 'pack'
  pricePerUnit: number; // سعر الوحدة الواحدة
  currentStock: number;
  lowStockThreshold: number;
  piecesInUnit?: number; // Number of sub-pieces in the main unit (e.g., 12 pieces in a carton)
  userId?: string; // To associate with the logged-in user
  lastUpdated: string; // ISO date string
}

