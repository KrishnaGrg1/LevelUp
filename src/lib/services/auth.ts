import { clientApi, api } from '../fetch';
import type { Async, Err, RequestEvent, Language } from '../generated';
import type { UserLoginInput, UserLoginResponse } from '../generated';

// Client-side login function that handles cookies manually
export const login = async (
  email: string,
  password: string,
  lang: Language = 'eng',
  event: RequestEvent
): Async<UserLoginResponse, Err> => {
  try {
    const response = await clientApi<UserLoginInput, { message: string; data: string }>(
      'auth/login',
      {
        data: { email, password },
        method: 'POST',
        lang: String(lang),
      },
      event.cookies
    );

    return [
      {
       statusCode: response.status,
         body: {
            message: response.data.message,
            data: String(response.data.data), // This is the token
         }
      },
      null,
    ];
  } catch (error: any) {
    if (error.response?.data?.body) {
      const backendError = error.response.data.body;
      console.log('Backend error:', backendError);
      return [
        null,
        {
          message: backendError.message || backendError.error || 'Unexpected error',
        },
      ];
    }
    return [
      null,
      {
        message: error.message,
      },
    ];
  }
};

// Server-side login function that uses the api function with server cookies
export const serverLogin = async (
  email: string,
  password: string
): Async<UserLoginResponse, Err> => {
  try {
    const response = await api<UserLoginInput, { message: string; data: string }>(
      'auth/login',
      {
        data: { email, password },
        method: 'POST',
      }
    );

    return [
      {
       statusCode: response.status,
         body: {
            message: response.data.message,
            data: String(response.data.data), // This is the token
         }
      },
      null,
    ];
  } catch (error: any) {
    return [
      null,
      {
        message: error.message,
      },
    ];
  }
};
