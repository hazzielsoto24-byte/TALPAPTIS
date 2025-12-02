
export interface DiagnosisResult {
  diagnosis: string;
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  estimatedCostMin: number;
  estimatedCostMax: number;
  advice: string;
  requiredTools: string[];
}

export interface LocationState {
  lat: number | null;
  lng: number | null;
  address?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  date: string; // ISO string
  description: string;
  result: DiagnosisResult;
  rating?: number; // 1-5 stars
  review?: string; // User comment
}

export interface UserProfile {
  name: string;
  carModel: string;
  joinDate: string;
  paymentMethod?: 'cash' | 'card' | 'transfer';
  billingInfo?: BillingInfo;
}

export interface BillingInfo {
  rfc: string;
  razonSocial: string;
  cp: string;
  regimen: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Oils' | 'Brakes' | 'Batteries' | 'Cleaning' | 'Accessories' | 'Engine' | 'Suspension' | 'Electrical' | 'Cooling';
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  REQUEST = 'REQUEST',
  PROFILE = 'PROFILE', // Replaces HISTORY
  SERVICES = 'SERVICES',
  STORE = 'STORE',
  CONTACT = 'CONTACT',
}
