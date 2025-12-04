export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
}

export interface Record {
  id: number;
  serial: string;
  productId: string;
  customer: string;
  shipDate: string;
  memo: string;
  status: string;
}

export interface RestoreData {
  products?: Product[];
  records?: Record[];
  exportedAt?: string;
}

export type TabType = 'search' | 'register' | 'products' | 'dashboard';

export interface StatItem {
  name: string;
  count: number;
}