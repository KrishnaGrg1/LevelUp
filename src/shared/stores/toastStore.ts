/**
 * Toast Store
 *
 * Centralized toast notification management using custom events.
 * This allows toast notifications to be triggered from anywhere in the app,
 * including non-React contexts.
 *
 * @module shared/stores/toastStore
 */

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast data structure
 */
export interface ToastData {
  type: ToastType;
  message: string;
  id: number;
}

/**
 * Custom event name for toast notifications
 */
const TOAST_EVENT = 'app:toast' as const;

/**
 * Add a toast notification
 *
 * @param type - Type of toast (success, error, info, warning)
 * @param message - Message to display
 *
 * @example
 * ```typescript
 * addToast('success', 'User created successfully');
 * addToast('error', 'Failed to save changes');
 * ```
 */
export function addToast(type: ToastType, message: string): void {
  if (typeof window === 'undefined') return;

  const id = Date.now();

  window.dispatchEvent(
    new CustomEvent<ToastData>(TOAST_EVENT, {
      detail: { type, message, id },
    }),
  );
}

/**
 * Toast action helpers
 * Convenient methods for showing different toast types
 *
 * @example
 * ```typescript
 * import { toastActions } from '@/shared/stores';
 *
 * toastActions.success('Saved successfully!');
 * toastActions.error('Something went wrong');
 * toastActions.info('New message received');
 * toastActions.warning('This action cannot be undone');
 * ```
 */
export const toastActions = {
  success: (message: string) => addToast('success', message),
  error: (message: string) => addToast('error', message),
  info: (message: string) => addToast('info', message),
  warning: (message: string) => addToast('warning', message),
} as const;

/**
 * Set up a listener for toast events
 *
 * @param callback - Function to call when a toast is triggered
 * @returns Cleanup function to remove the listener
 *
 * @example
 * ```typescript
 * useEffect(() => {
 *   const cleanup = setupToastListener((toast) => {
 *     console.log('Toast:', toast);
 *   });
 *
 *   return cleanup;
 * }, []);
 * ```
 */
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
