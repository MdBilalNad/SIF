import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  className = ''
}) => {
  return (
    <div className={`p-10 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-md bg-neutral-50/50 dark:bg-neutral-900/40 max-w-xl mx-auto my-6 ${className}`}>
      {icon && (
        <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-md">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto leading-relaxed">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {actionLabel && onAction && (
            <Button size="sm" variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button size="sm" variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
