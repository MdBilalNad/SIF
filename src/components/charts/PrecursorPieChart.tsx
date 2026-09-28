import React, { useState } from 'react';
import { PrecursorIndicator } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export interface PrecursorPieChartProps {
  indicators: PrecursorIndicator[];
  title?: string;
  subtitle?: string;
}

export const PrecursorPieChart: React.FC<PrecursorPieChartProps> = ({
  indicators,
  title = 'Precursor Distribution (Pie & Donut Analysis)',
  subtitle = 'Categorical share and proportional decomposition of evaluated risk precursor signals'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<'category' | 'severity'>('category');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (!indicators || indicators.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900">
        No indicators available for pie decomposition.
      </div>
    );
  }

  // Calculate slices based on mode
  let slices: {
    key: string;
    label: string;
    count: number;
    color: string;
    darkColor: string;
    pct: number;
  }[] = [];

  const total = indicators.length;

  if (mode === 'category') {
    const categories = [
      { key: 'barrier_integrity', label: 'Barrier Integrity', color: '#dc2626', darkColor: '#ef4444' },
      { key: 'energy_exposure', label: 'Energy Exposure', color: '#ea580c', darkColor: '#f97316' },
      { key: 'operational_drift', label: 'Operational Drift', color: '#d97706', darkColor: '#f59e0b' },
      { key: 'pre_incident_conditions', label: 'Pre-Incident Conditions', color: '#2563eb', darkColor: '#3b82f6' },
      { key: 'systems_governance', label: 'Systems Governance', color: '#059669', darkColor: '#10b981' }
    ];

    slices = categories.map(c => {
      const count = indicators.filter(i => i.category === c.key).length;
      return {
        ...c,
        count,
        pct: total > 0 ? (count / total) * 100 : 0
      };
    }).filter(s => s.count > 0);
  } else {
    const severities = [
      { key: 'critical', label: 'Critical Risk', color: '#dc2626', darkColor: '#ef4444' },
      { key: 'significant', label: 'Significant Alert', color: '#ea580c', darkColor: '#f97316' },
      { key: 'elevated', label: 'Elevated Precursor', color: '#d97706', darkColor: '#f59e0b' },
      { key: 'nominal', label: 'Nominal Margin', color: '#059669', darkColor: '#10b981' }
    ];

    slices = severities.map(s => {
      const count = indicators.filter(i => i.status === s.key).length;
      return {
        ...s,
        count,
        pct: total > 0 ? (count / total) * 100 : 0
      };
    }).filter(s => s.count > 0);
  }

  // Geometry for Donut SVG
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const innerRadius = 55;

  let cumulativeAngle = -Math.PI / 2;

  const arcSlices = slices.map((s, idx) => {
    const angle = (s.pct / 100) * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const isHovered = hoveredIdx === idx;
    const currentRadius = isHovered ? radius + 5 : radius;

    // Outer arc coordinates
    const x1 = center + currentRadius * Math.cos(startAngle);
    const y1 = center + currentRadius * Math.sin(startAngle);
    const x2 = center + currentRadius * Math.cos(endAngle);
    const y2 = center + currentRadius * Math.sin(endAngle);

    // Inner arc coordinates
    const ix1 = center + innerRadius * Math.cos(endAngle);
    const iy1 = center + innerRadius * Math.sin(endAngle);
    const ix2 = center + innerRadius * Math.cos(startAngle);
    const iy2 = center + innerRadius * Math.sin(startAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${currentRadius} ${currentRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2}`,
      'Z'
    ].join(' ');

    return {
      ...s,
      pathData,
      isHovered
    };
  });

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded self-start sm:self-auto text-xs">
          <button
            onClick={() => setMode('category')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mode === 'category'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            By Hazard Domain
          </button>
          <button
            onClick={() => setMode('severity')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mode === 'severity'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            By Severity State
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* Donut / Pie SVG */}
        <div className="relative w-[240px] h-[240px] shrink-0 flex items-center justify-center">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none">
            {arcSlices.map((slice, idx) => (
              <path
                key={slice.key}
                d={slice.pathData}
                fill={isDark ? slice.darkColor : slice.color}
                stroke={isDark ? '#171717' : '#ffffff'}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
                opacity={hoveredIdx !== null && hoveredIdx !== idx ? 0.45 : 1}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {activeSlice ? (
              <>
                <span className="font-mono text-xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {activeSlice.pct.toFixed(0)}%
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 max-w-[85px] truncate">
                  {activeSlice.count} items
                </span>
              </>
            ) : (
              <>
                <span className="font-mono text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {total}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 dark:text-neutral-500">
                  Total Signals
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend & Breakdown List */}
        <div className="flex-1 w-full space-y-2">
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={slice.key}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-2 rounded transition-colors cursor-pointer border ${
                  isHovered
                    ? 'bg-neutral-100/80 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                    : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: isDark ? slice.darkColor : slice.color }}
                  />
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {slice.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono text-xs tabular-nums">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    {slice.count} ({slice.pct.toFixed(1)}%)
                  </span>
                  <div className="w-12 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${slice.pct}%`,
                        backgroundColor: isDark ? slice.darkColor : slice.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>Click or hover sectors to inspect segment proportion</span>
        <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
          Proportional Area Partition
        </span>
      </div>
    </div>
  );
};
