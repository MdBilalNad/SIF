import React, { useState } from 'react';
import { MetricTimeSeriesPoint } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export interface TrendLineChartProps {
  data: MetricTimeSeriesPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  title = 'Precursor Trajectory Over Time',
  subtitle = 'Temporal progression of composite precursor index and barrier degradation curve',
  height = 240
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900">
        No longitudinal time series data recorded for this run.
      </div>
    );
  }

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = 600;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const yMax = 100;
  const yMin = 0;

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + innerWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    return paddingTop + innerHeight - ((clamped - yMin) / (yMax - yMin)) * innerHeight;
  };

  // Build SVG path strings
  const precursorPoints = data.map((d, i) => `${getX(i)},${getY(d.precursorScore)}`).join(' ');
  const barrierPoints = data.map((d, i) => `${getX(i)},${getY(d.barrierIntegrityScore)}`).join(' ');
  const thresholdY = data[0] ? getY(data[0].threshold) : getY(70);

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(data.length - 1);

  const gridStroke = isDark ? '#262626' : '#e5e5e5';
  const textFill = isDark ? '#a3a3a3' : '#737373';
  const precursorStroke = isDark ? '#f8fafc' : '#0f172a';
  const thresholdStroke = isDark ? '#ef4444' : '#b91c1c';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        {activePoint && (
          <div className="text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{activePoint.label}</span>: Precursor Score{' '}
            <span className="font-bold text-red-700 dark:text-red-400">{activePoint.precursorScore}</span> | Barrier Decay{' '}
            <span className="text-amber-700 dark:text-amber-400">{activePoint.barrierIntegrityScore}</span>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[500px] select-none"
        >
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke={gridStroke}
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '2,2'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill={textFill}
                  className="font-mono tabular-nums"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Critical Threshold line */}
          <line
            x1={paddingLeft}
            y1={thresholdY}
            x2={chartWidth - paddingRight}
            y2={thresholdY}
            stroke={thresholdStroke}
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <text
            x={chartWidth - paddingRight}
            y={thresholdY - 5}
            textAnchor="end"
            fontSize="9"
            fill={thresholdStroke}
            fontWeight="600"
          >
            Threshold ({data[0]?.threshold || 70})
          </text>

          {/* Barrier Decay Polyline */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            points={barrierPoints}
          />

          {/* Precursor Index Polyline */}
          <polyline
            fill="none"
            stroke={precursorStroke}
            strokeWidth="2.5"
            points={precursorPoints}
          />

          {/* Data points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.precursorScore);
            const isHover = hoverIndex === i;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHover ? 5 : 3.5}
                  fill={precursorStroke}
                  stroke={isDark ? '#0f172a' : '#ffffff'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
                {/* X axis labels */}
                <text
                  x={cx}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill={textFill}
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Active hover crosshair */}
          {hoverIndex !== null && (
            <line
              x1={activeX}
              y1={paddingTop}
              x2={activeX}
              y2={chartHeight - paddingBottom}
              stroke={precursorStroke}
              strokeWidth="1"
              strokeDasharray="2,2"
              pointerEvents="none"
            />
          )}
        </svg>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-neutral-900 dark:bg-neutral-100 inline-block" /> Composite Precursor Score (P_I)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block" /> Barrier Decay Index
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-600 border-dashed border-t inline-block" /> Critical Trigger Limit
          </span>
        </div>
        <span className="text-neutral-400 dark:text-neutral-500">Hover over points to inspect temporal measurements</span>
      </div>
    </div>
  );
};
