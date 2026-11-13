// ============================================
// PRODUIT
// ============================================
export interface Product {
  id?: string;
  slug?: string;               // ← NOUVEAU
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description?: string;
  format?: string;
  delay?: string;
  stock: 'Disponible' | 'Sur commande' | 'Épuisé';
  featured?: boolean;
  isNew?: boolean;
  image?: string;
  publicId?: string;
  createdAt?: number;
  updatedAt?: number;
}

// ============================================
// COMMANDE
// ============================================
export interface OrderFile {
  name: string;
  url: string;
  publicId: string;
}

export type PaymentMode = 'deposit' | 'full';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientAddress?: string;
  product: string;
  category?: string;
  quantity: number;
  format?: string;
  style?: string;
  customText?: string;
  delivery?: string;
  deliveryDate?: string;
  notes?: string;
  files?: OrderFile[];
  total: number;
  status: 'pending' | 'confirmed' | 'progress' | 'delivered' | 'cancelled';

  // ============ PAIEMENT ============
  paymentMode: PaymentMode;           // 'deposit' (50%) ou 'full' (100%)
  paymentAmount: number;              // Montant à payer maintenant
  paymentStatus: PaymentStatus;       // 'pending', 'paid', 'failed'
  paymentDiscount: number;            // Remise appliquée (0 ou 5%)
  remaining: number;                  // Ce qui reste à la livraison
  paymentReference?: string;          // Ex : TX-7823492
  paymentNote?: string;               // Note libre
  paymentConfirmedAt?: number;        // Timestamp de confirmation

  createdAt: number;
  updatedAt?: number;
}

// ============================================
// MESSAGE DE CONTACT
// ============================================
export interface ContactMessage {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  projectType?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: number;
}

// ============================================
// UTILISATEUR ADMIN
// ============================================
export interface AdminUser {
  uid: string;
  email: string | null;
}