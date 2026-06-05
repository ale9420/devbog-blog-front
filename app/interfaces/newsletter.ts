export interface Subscriber {
  id: number;
  email: string;
  confirmationToken: string;
  confirmed: boolean;
  locale: string;
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
