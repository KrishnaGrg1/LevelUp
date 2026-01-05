interface ApiError {
  response?: {
    data?: {
      body?: {
        message?: string;
        error?: string;
      };
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

export function extractErrorMessage(error: unknown, fallbackMessage: string): string {
  const err = error as ApiError;
  return (
    err.response?.data?.body?.message ||
    err.response?.data?.message ||
    err.message ||
    fallbackMessage
  );
}

export function extractErrorWithDetail(error: unknown, fallbackMessage: string) {
  const err = error as ApiError;
  const errorMessage =
    err.response?.data?.body?.message ||
    err.response?.data?.message ||
    err.message ||
    fallbackMessage;
  const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

  return { message: errorMessage, error: errorDetail };
}

export function handleServiceError(error: unknown, fallbackMessage: string): never {
  const errorMessage = extractErrorMessage(error, fallbackMessage);
  throw new Error(errorMessage);
}

export function handleServiceErrorWithDetail(error: unknown, fallbackMessage: string): never {
  const errorData = extractErrorWithDetail(error, fallbackMessage);
  throw errorData;
}
