/**
 * Shared Stores Module
 *
 * Common Zustand stores used across features
 *
 * @module shared/stores
 */

// Language Store
export {
  useLanguageStore,
  selectLanguage,
  selectLanguageActions,
} from './languageStore';
export type { Language } from './languageStore';

// Pagination Store
export {
  usePaginationStore,
  selectPage,
  selectPageSize,
  selectPaginationActions,
} from './paginationStore';

// Toast Store
export {
  toastActions,
  addToast,
  setupToastListener,
} from './toastStore';
export type { ToastType, ToastData } from './toastStore';
