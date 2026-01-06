import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';
import type {
  ApiResponse,
  SubscriptionPlansResponse,
  KhaltiInitializeResponse,
} from '../types/payment';

// Get all subscription plans
export const getSubscriptionPlans = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<ApiResponse<SubscriptionPlansResponse>>(
      `/subscription/subscriptionPlans`,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
        },
      },
    );

    response.data.body.data.subscriptionPlans;
    return;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to load subscription plans';
    throw new Error(errorMessage);
  }
};

// Initialize Khalti payment
export const initializeKhaltiPayment = async (
  planId: string,
  totalPrice: number,
  lang: Language,
) => {
  try {
    const response = await axiosInstance.post<KhaltiInitializeResponse>(
      `/payment/initialize-khalti`,
      {
        itemId: planId,
        totalPrice: totalPrice,
        websiteUrl: window.location.origin,
      },
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          'Content-Type': 'application/json',
        },
      },
    );

    response.data.payment.payment_url;
    return;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to initialize payment. Please try again.';
    throw new Error(errorMessage);
  }
};
