// Payment and Subscription Types

export interface SubscriptionPlan {
  id: string;
  planName: string;
  durationMonth: number;
  price: number;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchasedPlan {
  id: string;
  userId: string;
  planId: string;
  paymentMethod: string;
  totalPrice: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  purchaseId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface KhaltiPaymentResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export interface KhaltiInitializeResponse {
  success: boolean;
  purchasedItemData: PurchasedPlan;
  payment: KhaltiPaymentResponse;
}

export interface PaymentVerificationData {
  pidx: string;
  total_amount: number;
  status: 'Completed' | 'Pending' | 'Expired' | 'Failed';
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  body: {
    message: string;
    data: T;
  };
}

export interface SubscriptionPlans {
  id: string;
  planName: string;
  durationMonth: number;
  price: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlans {
  id: string;
  planName: string;
  durationMonth: number;
  price: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// Update this to represent the "data" level of your response
export interface SubscriptionPlansResponse {
  subscriptionPlans: SubscriptionPlan[];
}
