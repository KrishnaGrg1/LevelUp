// components/BetterPagination.tsx
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PaginationMetadata {
  total: number;
  page: number;
  pageSize?: number;
  totalPages: number;
  total_pages?: number;
  previous_page?: number | null;
  next_page?: number | null;
}

interface BetterPaginationProps {
  paginationMetadata: PaginationMetadata;
  className?: string;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  useUrlParams?: boolean;
}

export const BetterPagination: React.FC<BetterPaginationProps> = ({
  paginationMetadata,
  className = '',
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  useUrlParams = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const total = paginationMetadata?.total ?? 0;
  const totalPages = paginationMetadata?.totalPages ?? paginationMetadata?.total_pages ?? 1;
  const currentPage = paginationMetadata?.page ?? 1;
  const previousPage = paginationMetadata?.previous_page;
  const nextPage = paginationMetadata?.next_page;
  const pageSize =
    paginationMetadata?.pageSize ?? parseInt(searchParams?.get('pageSize') || '10', 10);

  // Generate page numbers for pagination UI
  const generatePageNumbers = React.useMemo((): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = Math.max(totalPages - 4, 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Handle page change with URL params or callback
  const handlePageChange = React.useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;

      if (useUrlParams && pathname) {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }

      onPageChange?.(page);
    },
    [useUrlParams, pathname, searchParams, router, onPageChange, totalPages],
  );

  // Handle page size change
  const handlePageSizeChange = React.useCallback(
    (newPageSize: string) => {
      const size = parseInt(newPageSize, 10);
      if (isNaN(size) || size < 1) return;

      if (useUrlParams && pathname) {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('pageSize', size.toString());
        params.set('page', '1'); // Reset to first page
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }

      onPageSizeChange?.(size);
    },
    [useUrlParams, pathname, searchParams, router, onPageSizeChange],
  );

  const buttonClass =
    'inline-flex items-center justify-center rounded-md w-10 h-10 text-sm font-medium transition-all duration-200 border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';
  const activeButtonClass =
    'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-500 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50 scale-110 font-bold';

  // Early return if no data
  if (!paginationMetadata || totalPages === 0) {
    return null;
  }

  return (
    <div className={`flex w-full flex-col items-center gap-4 ${className}`}>
      {/* Page Navigation */}
      <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
        {/* First Page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={buttonClass}
          aria-label="Go to first page"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => previousPage && handlePageChange(previousPage)}
          disabled={!previousPage || currentPage === 1}
          className={buttonClass}
          aria-label="Go to previous page"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        {generatePageNumbers.map((pageNumber, idx) => {
          if (pageNumber === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="inline-flex h-10 w-10 items-center justify-center text-sm text-slate-500"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={isActive}
              className={`${buttonClass} ${isActive ? activeButtonClass : ''}`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
              title={isActive ? `Current page ${pageNumber}` : `Go to page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          onClick={() => nextPage && handlePageChange(nextPage)}
          disabled={!nextPage || currentPage === totalPages}
          className={buttonClass}
          aria-label="Go to next page"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={buttonClass}
          aria-label="Go to last page"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </nav>

      {/* Pagination Info & Page Size Selector */}
      <div className="flex flex-col items-center justify-center gap-4 text-sm text-slate-400 sm:flex-row">
        <div className="text-center sm:text-left">
          Showing{' '}
          <span className="font-semibold text-indigo-400">
            {Math.min((currentPage - 1) * pageSize + 1, total)}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-indigo-400">
            {Math.min(currentPage * pageSize, total)}
          </span>{' '}
          of <span className="font-semibold text-white">{total.toLocaleString()}</span> results
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="page-size-select" className="text-sm font-medium">
            Items per page:
          </label>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger
              className="h-8 w-[70px] border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
              id="page-size-select"
            >
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent className="border-slate-700 bg-slate-800 text-white">
              {pageSizeOptions.map(option => (
                <SelectItem
                  key={option}
                  value={option.toString()}
                  className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
