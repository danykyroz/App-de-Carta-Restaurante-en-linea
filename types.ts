export type Currency = 'COP' | 'USD' | 'EUR';
export type Language = 'es' | 'en' | 'fr';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  priceCOP: number; // Base price in Colombian Pesos
  category: string; // Links to Category.name or Category.id
  imageUrl: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  zoneId?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'waiter' | 'chef';
  email?: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'served' | 'paid';
  timestamp: number;
  totalCOP: number;
}

export interface Zone {
  id: string;
  name: string; // e.g., "Terraza", "Salón Principal"
  tables: string[]; // Table IDs
  assignedWaiterId: string;
}

export interface ExchangeRates {
  COP: number;
  USD: number;
  EUR: number;
}

export const EXCHANGE_RATES: ExchangeRates = {
  COP: 1,
  USD: 0.00026, // Approx: 1 USD = 3850 COP
  EUR: 0.00024, // Approx: 1 EUR = 4150 COP
};

// Deprecated in favor of dynamic categories, but kept for fallback
export const CATEGORIES = ['Entradas', 'Platos Fuertes', 'Postres', 'Bebidas', 'Vinos'];