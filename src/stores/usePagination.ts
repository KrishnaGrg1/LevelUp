import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PaginationState {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const usePaginationStore = create<PaginationState>()(
  persist(
    (set) => ({
      page: 1,
      pageSize: 10,
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => {
        console.log('Setting page size to:', pageSize); // Debug log
        set({ pageSize, page: 1 }); // Reset to page 1 when changing size
      },
      reset: () => set({ page: 1, pageSize: 10 }),
    }),
    {
      name: 'user-pagination-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);