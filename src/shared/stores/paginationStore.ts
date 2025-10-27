/**
 * Pagination Store
 *
 * Manages pagination state for list views with persistence
 *
 * @module shared/stores/paginationStore
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

/**
 * Pagination store state
 */
interface PaginationState {
  /** Current page number (1-indexed) */
  page: number;

  /** Number of items per page */
  pageSize: number;
}

/**
 * Pagination store actions
 */
interface PaginationActions {
  /** Set the current page */
  setPage: (page: number) => void;

  /** Set the page size and reset to page 1 */
  setPageSize: (pageSize: number) => void;

  /** Reset pagination to defaults */
  reset: () => void;

  /** Go to next page */
  nextPage: () => void;

  /** Go to previous page */
  prevPage: () => void;
}

/**
 * Complete pagination store type
 */
type PaginationStore = PaginationState & PaginationActions;

/**
 * Default pagination values
 */
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

/**
 * Pagination store hook
 *
 * @example
 * ```typescript
 * const { page, pageSize, setPage, setPageSize } = usePaginationStore();
 *
 * // Change page
 * setPage(2);
 *
 * // Change page size
 * setPageSize(20);
 *
 * // Navigate
 * nextPage();
 * prevPage();
 * ```
 */
export const usePaginationStore = create<PaginationStore>()(
  devtools(
    persist(
      set => ({
        // State
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,

        // Actions
        setPage: (page: number) => {
          if (page < 1) return;
          set({ page }, false, 'pagination/setPage');
        },

        setPageSize: (pageSize: number) => {
          if (pageSize < 1) return;

          // Log for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('Setting page size to:', pageSize);
          }

          // Reset to page 1 when changing page size
          set({ pageSize, page: DEFAULT_PAGE }, false, 'pagination/setPageSize');
        },

        reset: () => {
          set({ page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE }, false, 'pagination/reset');
        },

        nextPage: () => {
          set(state => ({ page: state.page + 1 }), false, 'pagination/nextPage');
        },

        prevPage: () => {
          set(state => ({ page: Math.max(1, state.page - 1) }), false, 'pagination/prevPage');
        },
      }),
      {
        name: 'user-pagination-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: 'PaginationStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

/**
 * Selectors
 */
export const selectPage = (state: PaginationStore) => state.page;
export const selectPageSize = (state: PaginationStore) => state.pageSize;
export const selectPaginationActions = (state: PaginationStore) => ({
  setPage: state.setPage,
  setPageSize: state.setPageSize,
  reset: state.reset,
  nextPage: state.nextPage,
  prevPage: state.prevPage,
});
