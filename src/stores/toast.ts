export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  type: ToastType;
  message: string;
  id: number;
}

const TOAST_EVENT = 'app:toast';

export function addToast(type: ToastType, message: string): void {
  if (typeof window !== 'undefined') {
    const id = Date.now();
    window.dispatchEvent(
      new CustomEvent<ToastData>(TOAST_EVENT, {
        detail: { type, message, id },
      }),
    );
  }
}

export const toastActions = {
  success: (message: string) => addToast('success', message),
  error: (message: string) => addToast('error', message),
  info: (message: string) => addToast('info', message),
  warning: (message: string) => addToast('warning', message),
};

export function setupToastListener(callback: (data: ToastData) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleToast = (event: Event) => {
    const customEvent = event as CustomEvent<ToastData>;
    callback(customEvent.detail);
  };

  window.addEventListener(TOAST_EVENT, handleToast);

  return () => {
    window.removeEventListener(TOAST_EVENT, handleToast);
  };
}
