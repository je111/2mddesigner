import { ref as dbRef, push, set } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Order, OrderFile, PaymentMode } from '../types/firebase';

interface CreateOrderInput {
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
  paymentMode: PaymentMode;
}

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const ordersRef = dbRef(database, 'orders');
  const newRef = push(ordersRef);

  // Calcul du montant à payer et de la remise
  const isFullPayment = input.paymentMode === 'full';
  const discountRate = isFullPayment ? 0.05 : 0; // -5% si paiement total
  const discountAmount = Math.round(input.total * discountRate);
  const totalAfterDiscount = input.total - discountAmount;
  const paymentAmount = isFullPayment
    ? totalAfterDiscount
    : Math.round(input.total / 2);
  const remaining = isFullPayment ? 0 : input.total - paymentAmount;

  const order: Omit<Order, 'id'> = {
    clientName: input.clientName.trim(),
    clientPhone: input.clientPhone.trim(),
    clientEmail: input.clientEmail?.trim() || '',
    clientAddress: input.clientAddress?.trim() || '',
    product: input.product.trim(),
    category: input.category || 'Autre',
    quantity: input.quantity,
    format: input.format || '',
    style: input.style || '',
    customText: input.customText || '',
    delivery: input.delivery || '',
    deliveryDate: input.deliveryDate || '',
    notes: input.notes || '',
    files: input.files || [],
    total: input.total,
    status: 'pending',

    // Paiement
    paymentMode: input.paymentMode,
    paymentAmount,
    paymentStatus: 'pending',
    paymentDiscount: discountAmount,
    remaining,

    createdAt: Date.now(),
  };

  await set(newRef, order);
  return newRef.key!;
}