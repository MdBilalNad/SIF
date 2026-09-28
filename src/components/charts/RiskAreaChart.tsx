import React, { useState } from 'react';
import { MetricTimeSeriesPoint } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export interface RiskAreaChartProps {
  data: MetricTimeSeriesPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export const RiskAreaChart: React.FC<RiskAreaChartProps> = ({
  data,
  title = 'Cumulative Precursor Risk Exposure (Area Analysis)',
  subtitle = 'Continuous volumetric area mapping of composite risk and safe operational threshold over time',
  height = 280
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<'composite' | 'barrier' | 'energy'>('composite');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900">
        No time-series telemetry available for area projection.
      </div>
    );
  }

  const width = 640;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const yMin = 0;
  const yMax = 100;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * innerWidth;
  const getY = (value: number) => paddingTop + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;

  // Build SVG Path for Area & Line based on selected metric
  const points = data.map((d, i) => {
    let val = d.precursorScore;
    if (activeMetric === 'barrier') val = d.barrierIntegrityScore;
    else if (activeMetric === 'energy') val = d.energyExposureScore;
    return { x: getX(i), y: getY(val), raw: val, point: d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const baselineY = getY(0);
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY.toFixed(1)} L ${points[0].x.toFixed(1)} ${baselineY.toFixed(1)} Z`;

  // Threshold line from data or default 45
  const thresholdVal = data[0]?.threshold || 45;
  const thresholdY = getY(thresholdVal);

  const gridColor = isDark ? '#262626' : '#f0f0f0';
  const axisTextColor = isDark ? '#a3a3a3' : '#737373';

  let areaFill = isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(220, 38, 38, 0.15)';
  let strokeColor = isDark ? '#ef4444' : '#dc2626';

  if (activeMetric === 'barrier') {
    areaFill = isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.15)';
    strokeColor = isDark ? '#3b82f6' : '#2563eb';
  } else if (activeMetric === 'energy') {
    areaFill = isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(217, 119, 6, 0.15)';
    strokeColor = isDark ? '#f59e0b' : '#d97706';
  }

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveMetric('composite')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              activeMetric === 'composite'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Composite Area
          </button>
          <button
            onClick={() => setActiveMetric('barrier')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              activeMetric === 'barrier'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Barrier Area
          </button>
          <button
            onClick={() => setActiveMetric('energy')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              activeMetric === 'energy'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Energy Area
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[520px] select-none">
          {/* Horizontal gridlines */}
          {[0, 25, 50, 75, 100].map(yVal => {
            const yCoord = getY(yVal);
            return (
              <g key={yVal}>
                <line
                  x1={paddingLeft}
                  y1={yCoord}
                  x2={width - paddingRight}
                  y2={yCoord}
                  stroke={gridColor}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={yCoord + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fill={axisTextColor}
                >
                  {yVal}
                </text>
              </g>
            );
          })}

          {/* Critical Threshold line */}
          <line
            x1={paddingLeft}
            y1={thresholdY}
            x2={width - paddingRight}
            y2={thresholdY}
            stroke={isDark ? '#e11d48' : '#e11d48'}
            strokeWidth="1.5"
            strokeDasharray="4,3"
            opacity={0.8}
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
            Threshold Boundary (45)
          </text>

          {/* Area Fill */}
          <path d={areaPath} fill={areaFill} className="transition-all duration-300" />

          {/* Top Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill={strokeColor}
                  stroke={isDark ? '#0f172a' : '#ffffff'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}

          {/* X Axis Date Labels */}
          {points.map((p, i) => {
            if (i % 2 !== 0 && i !== points.length - 1) return null;
            return (
              <text
                key={i}
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fill={axisTextColor}
              >
                {p.point.timestamp.slice(5)}
              </text>
            );
          })}

          {/* Hover Guideline & Detail Flag */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={baselineY}
                stroke={isDark ? '#737373' : '#a3a3a3'}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <rect
                x={Math.min(width - 120, Math.max(paddingLeft, activePoint.x - 55))}
                y={paddingTop - 5}
                width="110"
                height="22"
                rx="3"
                fill={isDark ? '#171717' : '#ffffff'}
                stroke={isDark ? '#404040' : '#d4d4d4'}
                strokeWidth="1"
              />
              <text
                x={Math.min(width - 120, Math.max(paddingLeft, activePoint.x - 55)) + 55}
                y={paddingTop + 10}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="700"
                fill={isDark ? '#f8fafc' : '#0f172a'}
              >
                {activePoint.point.timestamp}: {activePoint.raw} pts
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs inline-block" style={{ backgroundColor: strokeColor }} />
            <span>Active Area: {activeMetric.toUpperCase()}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-rose-600 dark:border-rose-400 inline-block" />
            <span>Engineering Tolerance Limit (45)</span>
          </span>
        </div>
        <span>Hover coordinates for deterministic interval scores</span>
      </div>
    </div>
  );
};
