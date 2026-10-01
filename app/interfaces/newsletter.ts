export type NewsletterLanguage = 'en' | 'es';

export interface Subscriber {
  id: number;
  documentId: string;
  email: string;
  confirmationToken: string | null;
  unsubscribeToken: string | null;
  confirmed: boolean;
  language: NewsletterLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeRequest {
  email: string;
  locale?: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

export interface ConfirmResponse {
  success: boolean;
  message: string;
}

export interface UnsubscribeResponse {
  success: boolean;
}
