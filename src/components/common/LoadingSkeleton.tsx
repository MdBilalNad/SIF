import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; type?: 'table' | 'card' | 'chart' }> = ({
  rows = 4,
  type = 'table'
}) => {
  if (type === 'card') {
    return (
      <div className="bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-md p-5 animate-pulse">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-4" />
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 mb-3" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-md p-5 animate-pulse">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 mb-6" />
        <div className="h-48 bg-neutral-100 dark:bg-neutral-800/50 rounded flex items-end gap-3 p-4">
          <div className="w-1/6 bg-neutral-200 dark:bg-neutral-800 h-2/3 rounded-t" />
          <div className="w-1/6 bg-neutral-200 dark:bg-neutral-800 h-1/2 rounded-t" />
          <div className="w-1/6 bg-neutral-200 dark:bg-neutral-800 h-3/4 rounded-t" />
          <div className="w-1/6 bg-neutral-200 dark:bg-neutral-800 h-4/5 rounded-t" />
          <div className="w-1/6 bg-neutral-200 dark:bg-neutral-800 h-1/3 rounded-t" />
          <div className="w-1/6 bg-neutral-200 dark:bg-neutral-800 h-full rounded-t" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 rounded-md overflow-hidden animate-pulse">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 flex gap-4">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/6" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ErrorNotice: React.FC<{
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ title, message, onRetry, className = '' }) => {
  return (
    <div className={`p-4 border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 rounded-md text-red-900 dark:text-red-300 text-sm ${className}`} role="alert">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-xs tracking-wide uppercase text-red-800 dark:text-red-400">{title}</h4>
          <p className="mt-1 text-xs text-red-700 dark:text-red-300 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-2.5 py-1 text-xs font-medium text-red-800 dark:text-red-300 bg-white dark:bg-neutral-900 border border-red-300 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-950/50 shrink-0"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
