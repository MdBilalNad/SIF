import React, { useState } from 'react';
import { PrecursorIndicator } from '../../types';

export interface IndicatorBarChartProps {
  indicators: PrecursorIndicator[];
  title?: string;
  subtitle?: string;
}

export const IndicatorBarChart: React.FC<IndicatorBarChartProps> = ({
  indicators,
  title = 'Indicator Evaluation vs. Engineering Benchmark',
  subtitle = 'Observed metric value normalized against threshold tolerance limit (100% = threshold)'
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!indicators || indicators.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900">
        No precursor indicators selected for graphical display.
      </div>
    );
  }

  // Find maximum percentage for scale
  const maxRatio = Math.max(
    1.6,
    ...indicators.map(ind => (ind.threshold > 0 ? ind.currentValue / ind.threshold : 1))
  );

  const breachedCount = indicators.filter(ind => ind.threshold > 0 && ind.currentValue >= ind.threshold).length;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
            breachedCount > 0
              ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 font-semibold'
              : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400'
          }`}>
            {breachedCount} breached / {indicators.length} total
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1.5 focus:outline-none">
        {indicators.map(ind => {
          const ratio = ind.threshold > 0 ? ind.currentValue / ind.threshold : 0;
          const pctOfMax = Math.min(100, Math.max(4, (ratio / maxRatio) * 100));
          const thresholdPctOfMax = (1.0 / maxRatio) * 100;
          const isBreached = ind.currentValue >= ind.threshold;
          const isHovered = hoveredId === ind.id;

          let barColor = 'bg-emerald-600 dark:bg-emerald-500';
          if (ind.status === 'critical') barColor = 'bg-red-600 dark:bg-red-500';
          else if (ind.status === 'significant') barColor = 'bg-orange-600 dark:bg-orange-500';
          else if (ind.status === 'elevated') barColor = 'bg-amber-500 dark:bg-amber-400';

          return (
            <div
              key={ind.id}
              className={`p-2.5 rounded transition-colors border border-transparent ${
                isHovered
                  ? 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/60'
                  : 'hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30'
              }`}
              onMouseEnter={() => setHoveredId(ind.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-baseline justify-between text-xs mb-1.5 gap-x-2 gap-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate" title={ind.name}>
                    {ind.name}
                  </span>
                  <span className="text-neutral-400 dark:text-neutral-500 shrink-0">·</span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px] truncate shrink-0">
                    {ind.categoryLabel}
                  </span>
                </div>
                <div className="text-right shrink-0 font-mono text-[11px] tabular-nums flex items-center gap-1">
                  <span className={isBreached ? 'font-semibold text-red-700 dark:text-red-400' : 'text-neutral-700 dark:text-neutral-300'}>
                    {ind.currentValue} {ind.unit}
                  </span>
                  <span className="text-neutral-400 dark:text-neutral-600">/</span>
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Limit: {ind.threshold} {ind.unit}
                  </span>
                  {isBreached && ratio > 1 && (
                    <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 ml-0.5">
                      (+{((ratio - 1) * 100).toFixed(0)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Progress track */}
              <div className="relative h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm overflow-visible">
                {/* Benchmark threshold reference marker */}
                <div
                  className="absolute top-[-2px] bottom-[-2px] z-10 w-0.5 bg-neutral-900 dark:bg-neutral-100 pointer-events-none"
                  style={{ left: `${thresholdPctOfMax}%` }}
                  title="Benchmark Threshold (100%)"
                />

                {/* Metric value bar */}
                <div
                  className={`h-full rounded-sm transition-all duration-300 ${barColor}`}
                  style={{ width: `${pctOfMax}%` }}
                />
              </div>

              {/* Detail drawer when hovered */}
              {isHovered && (
                <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 flex flex-wrap items-center justify-between gap-2">
                  <span className="truncate flex-1 min-w-0">{ind.relevance}</span>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
                    Delta: {ind.historicalDeltaPct > 0 ? `+${ind.historicalDeltaPct}%` : `${ind.historicalDeltaPct}%`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-500 inline-block" /> Nominal
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 dark:bg-amber-400 inline-block" /> Elevated
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-xs bg-orange-600 dark:bg-orange-500 inline-block" /> Significant
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-600 dark:bg-red-500 inline-block" /> Critical
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
          <span className="w-1 h-3 bg-neutral-900 dark:bg-neutral-100 inline-block rounded-xs" />
          <span>Marker = Benchmark Limit</span>
        </div>
      </div>
    </div>
  );
};
