// lib/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error response structures
    let message = 'Something went wrong';
    
    if (error?.response?.data) {
      // Handle structure: { statusCode: 400, body: { message: "...", error: "..." } }
      if (error.response.data.body?.message) {
        message = error.response.data.body.message;
      } else if (error.response.data.body?.error) {
        message = error.response.data.body.error;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      }
    } else if (error.message) {
      message = error.message;
    }
    
    // Return the full error response data for proper handling in the calling code
    return Promise.reject({
      message,
      statusCode: error?.response?.status,
      body: error?.response?.data?.body || error?.response?.data,
      originalError: error
    });
  }
);

// Client-side API function (for use in client components)
export const clientApi = async <T, V>(
  url: string,
  config: AxiosRequestConfig & { data?: T; lang?: string } = {},
  cookies?: { get: (name: string) => { value?: string } | undefined },
): Promise<AxiosResponse<{ message: string; data: V }>> => {
  let token: string | undefined;
  const lang = config.lang || "eng";
  
  if (cookies) {
    const cookie = cookies.get('auth-token');
    token = cookie ? cookie.value : undefined;
  } else if (typeof document !== 'undefined') {
    // Client-side fallback: read from document.cookie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
    token = cookieValue;
  }
  // If we're on the server and no cookies are provided, token remains undefined
  
  const headers = {
    ...config.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'X-Language': lang,
  };

  return axiosInstance.request<T, AxiosResponse<{ message: string; data: V }>>({
    url,
    ...config,
    headers,
  });
};

// Server-side API function (for use in server components and API routes)
export const api = async <T, V>(
  url: string,
  config: AxiosRequestConfig & { data?: T } = {}
): Promise<AxiosResponse<{ message: string; data: V }>> => {
  // This will only work on the server side
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  const lang = cookieStore.get('lang')?.value || 'eng';

  const headers = {
    ...config.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'X-Language': lang,
  };

  return axiosInstance.request<T, AxiosResponse<{ message: string; data: V }>>({
    url,
    ...config,
    headers,
  });
};

export default axiosInstance;
