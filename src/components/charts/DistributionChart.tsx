import React from 'react';
import { DistributionPoint } from '../../types';

export interface DistributionChartProps {
  data: DistributionPoint[];
  title?: string;
  subtitle?: string;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  title = 'Precursor Variance Distribution',
  subtitle = 'Observed incident/permit frequency vs. standard baseline operational distribution'
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900">
        No distribution histogram data available.
      </div>
    );
  }

  const maxVal = Math.max(
    1,
    ...data.map(d => Math.max(d.observedCount, d.expectedBaseline))
  );

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
        {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-3">
        {data.map((item, idx) => {
          const obsPct = (item.observedCount / maxVal) * 100;
          const expPct = (item.expectedBaseline / maxVal) * 100;
          const isExcess = item.observedCount > item.expectedBaseline;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.range}</span>
                <span className="font-mono text-[11px] tabular-nums text-neutral-600 dark:text-neutral-400">
                  Observed: <strong className={isExcess ? 'text-red-700 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-100'}>{item.observedCount}</strong>
                  <span className="text-neutral-400 dark:text-neutral-600 mx-1.5">|</span>
                  Baseline: {item.expectedBaseline}
                </span>
              </div>

              <div className="space-y-1">
                {/* Observed Bar */}
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-sm overflow-hidden flex">
                  <div
                    className={`h-full ${isExcess ? 'bg-red-700 dark:bg-red-500' : 'bg-neutral-800 dark:bg-neutral-200'} transition-all`}
                    style={{ width: `${Math.max(2, obsPct)}%` }}
                    title={`Observed: ${item.observedCount}`}
                  />
                </div>
                {/* Baseline Bar */}
                <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-sm overflow-hidden flex">
                  <div
                    className="h-full bg-neutral-400 dark:bg-neutral-600"
                    style={{ width: `${Math.max(2, expPct)}%` }}
                    title={`Baseline: ${item.expectedBaseline}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-neutral-800 dark:bg-neutral-200 inline-block rounded-xs" /> Observed Data Density
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-neutral-400 dark:bg-neutral-600 inline-block rounded-xs" /> Standard Industry Baseline
          </span>
        </div>
        <span className="text-neutral-400 dark:text-neutral-500">Higher observed values in 61-100 indicate critical precursor clustering</span>
      </div>
    </div>
  );
};
