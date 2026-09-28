import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((item: T) => string);
  searchPlaceholder?: string;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
  pagination?: boolean;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  searchPlaceholder = 'Search records...',
  onSearchChange,
  searchTerm = '',
  pagination = false,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching the specified criteria.',
  onRowClick,
  actions
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const activeSearch = onSearchChange ? searchTerm : internalSearch;

  // Handle client sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortKey(null);
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Filter
  const filteredData = data.filter(item => {
    if (!activeSearch.trim()) return true;
    const term = activeSearch.toLowerCase();
    return Object.values(item).some(val => {
      if (typeof val === 'string' || typeof val === 'number') {
        return String(val).toLowerCase().includes(term);
      }
      return false;
    });
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;
    const modifier = sortDir === 'asc' ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });

  // Paginate
  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const getKey = (item: T): string => {
    if (typeof keyField === 'function') return keyField(item);
    return String(item[keyField]);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden transition-colors">
      {(searchPlaceholder || actions) && (
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={14} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={activeSearch}
              onChange={e => {
                if (onSearchChange) onSearchChange(e.target.value);
                else setInternalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600"
            />
          </div>
          {actions && <div className="flex items-center gap-2 self-end sm:self-auto">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
              {columns.map(col => {
                const isSorted = sortKey === col.key;
                const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200 select-none ${alignClass} ${
                      col.sortable ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-neutral-400 dark:text-neutral-500">
                          {isSorted ? (
                            sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                          ) : (
                            <span className="opacity-0 group-hover:opacity-100 text-[10px]">↕</span>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-neutral-500 dark:text-neutral-400">
                  <div className="max-w-sm mx-auto">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 text-xs">{emptyTitle}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr
                  key={getKey(item)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60' : 'hover:bg-neutral-50/40 dark:hover:bg-neutral-800/30'
                  }`}
                >
                  {columns.map(col => {
                    const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left';
                    return (
                      <td key={col.key} className={`py-3 px-3.5 align-middle ${alignClass} text-neutral-800 dark:text-neutral-200`}>
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="px-4 py-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <div>
            Showing <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
            <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{sortedData.length}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-[11px]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
