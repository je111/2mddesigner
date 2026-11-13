import { ref as dbRef, push, set } from 'firebase/database';
import { database } from '../lib/firebase';
import type { ContactMessage } from '../types/firebase';

interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  projectType?: string;
}

export async function createContact(input: CreateContactInput): Promise<string> {
  const contactsRef = dbRef(database, 'contacts');
  const newRef = push(contactsRef);

  const contact: Omit<ContactMessage, 'id'> = {
    name: input.name.trim(),
    email: input.email?.trim() || '',
    phone: input.phone?.trim() || '',
    message: input.message.trim(),
    projectType: input.projectType || 'Devis depuis le site',
    status: 'new',
    createdAt: Date.now(),
  };

  await set(newRef, contact);
  return newRef.key!;
}