import React from 'react';
import { SeverityLevel, AnalysisStatus } from '../../types';

export interface StatusIndicatorProps {
  level: SeverityLevel | AnalysisStatus | 'pending' | 'active' | 'archived';
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  level,
  label,
  showIcon = true,
  className = ''
}) => {
  // Configured cleanly without candy pill containers: unboxed text with geometric symbol
  let dotColor = 'bg-neutral-400';
  let textColor = 'text-neutral-700';
  let defaultLabel = String(level);

  switch (level) {
    case 'nominal':
    case 'complete':
      dotColor = 'bg-emerald-600 dark:bg-emerald-400';
      textColor = 'text-emerald-800 dark:text-emerald-400';
      defaultLabel = level === 'complete' ? 'Completed' : 'Nominal';
      break;
    case 'elevated':
    case 'needs_attention':
      dotColor = 'bg-amber-500 dark:bg-amber-400';
      textColor = 'text-amber-800 dark:text-amber-400';
      defaultLabel = level === 'needs_attention' ? 'Needs Attention' : 'Elevated';
      break;
    case 'significant':
      dotColor = 'bg-orange-600 dark:bg-orange-400';
      textColor = 'text-orange-900 dark:text-orange-400';
      defaultLabel = 'Significant';
      break;
    case 'critical':
    case 'failed':
      dotColor = 'bg-red-600 dark:bg-red-400';
      textColor = 'text-red-800 dark:text-red-400';
      defaultLabel = level === 'failed' ? 'Failed' : 'Critical SIF';
      break;
    case 'validating':
    case 'preparing':
    case 'evaluating':
    case 'generating':
      dotColor = 'bg-blue-600 dark:bg-blue-400 animate-pulse';
      textColor = 'text-blue-800 dark:text-blue-400';
      defaultLabel = 'Processing';
      break;
    case 'not_started':
      dotColor = 'bg-neutral-300 dark:bg-neutral-600';
      textColor = 'text-neutral-500 dark:text-neutral-400';
      defaultLabel = 'Not Started';
      break;
  }

  const displayLabel = label || defaultLabel;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${textColor} ${className}`}>
      {showIcon && (
        <span 
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} 
          aria-hidden="true" 
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
};
