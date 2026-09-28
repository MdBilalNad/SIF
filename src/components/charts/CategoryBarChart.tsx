import React, { useState } from 'react';
import { PrecursorIndicator } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export interface CategoryBarChartProps {
  indicators: PrecursorIndicator[];
  title?: string;
  subtitle?: string;
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({
  indicators,
  title = 'Domain Risk Magnitude (Vertical Bar Comparison)',
  subtitle = 'Aggregate precursor risk magnitude across key safeguard operational categories'
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const categories = [
    { key: 'barrier_integrity', label: 'Barrier', fullLabel: 'Barrier Integrity' },
    { key: 'energy_exposure', label: 'Energy', fullLabel: 'Energy Exposure' },
    { key: 'operational_drift', label: 'Drift', fullLabel: 'Operational Drift' },
    { key: 'pre_incident_conditions', label: 'Pre-Inc', fullLabel: 'Pre-Incident Conditions' },
    { key: 'systems_governance', label: 'Govern', fullLabel: 'Systems Governance' }
  ];

  const data = categories.map(cat => {
    const matches = indicators.filter(i => i.category === cat.key);
    if (matches.length === 0) return { ...cat, score: 20, count: 0, criticalCount: 0 };

    let totalBreach = 0;
    let criticalCount = 0;
    matches.forEach(m => {
      const ratio = m.threshold > 0 ? m.currentValue / m.threshold : 1;
      totalBreach += ratio * 45;
      if (m.currentValue >= m.threshold) criticalCount++;
    });

    const score = Math.min(100, Math.max(15, Math.round(totalBreach / matches.length)));
    return {
      ...cat,
      score,
      count: matches.length,
      criticalCount
    };
  });

  const width = 540;
  const height = 260;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const getY = (val: number) => paddingTop + innerHeight - (val / 100) * innerHeight;
  const thresholdY = getY(45);

  const barWidth = 45;
  const gap = (innerWidth - barWidth * data.length) / (data.length + 1);

  const gridColor = isDark ? '#262626' : '#f0f0f0';
  const axisTextColor = isDark ? '#a3a3a3' : '#737373';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[460px] select-none">
          {/* Horizontal gridlines */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={gridColor}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fill={axisTextColor}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Benchmark line at 45 */}
          <line
            x1={paddingLeft}
            y1={thresholdY}
            x2={width - paddingRight}
            y2={thresholdY}
            stroke={isDark ? '#e11d48' : '#e11d48'}
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <text
            x={width - paddingRight - 4}
            y={thresholdY - 5}
            textAnchor="end"
            fontSize="9"
            fontWeight="600"
            fontFamily="monospace"
            fill={isDark ? '#fb7185' : '#e11d48'}
          >
            Tolerance Baseline (45)
          </text>

          {/* Bars */}
          {data.map((d, i) => {
            const x = paddingLeft + gap + i * (barWidth + gap);
            const barH = (d.score / 100) * innerHeight;
            const y = paddingTop + innerHeight - barH;
            const isHovered = hoveredKey === d.key;
            const isExceeded = d.score > 45;

            let fill = isDark ? '#22c55e' : '#16a34a';
            if (d.score >= 70) fill = isDark ? '#ef4444' : '#dc2626';
            else if (d.score > 45) fill = isDark ? '#f97316' : '#ea580c';

            return (
              <g
                key={d.key}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredKey(d.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                {/* Bar rect */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="3"
                  fill={fill}
                  opacity={isHovered ? 1 : 0.88}
                  stroke={isHovered ? (isDark ? '#f8fafc' : '#0f172a') : 'none'}
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />

                {/* Score label on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="700"
                  fill={isDark ? '#f8fafc' : '#0f172a'}
                >
                  {d.score}
                </text>

                {/* Domain Category Label under bar */}
                <text
                  x={x + barWidth / 2}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  fill={isHovered ? (isDark ? '#f8fafc' : '#0f172a') : axisTextColor}
                >
                  {d.label}
                </text>

                <text
                  x={x + barWidth / 2}
                  y={height - paddingBottom + 28}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill={isExceeded ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#737373' : '#a3a3a3')}
                >
                  {d.criticalCount > 0 ? `${d.criticalCount} breach` : `${d.count} OK`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-600 dark:bg-red-500 inline-block" /> Elevated / Breached
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-500 inline-block" /> Safeguards Intact
          </span>
        </div>
        <span>Bars exceeding horizontal dashed line indicate degraded operational barrier controls</span>
      </div>
    </div>
  );
};
