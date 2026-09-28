import React, { useState } from 'react';
import { PrecursorIndicator } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export interface BarrierRadarChartProps {
  indicators: PrecursorIndicator[];
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  title?: string;
  subtitle?: string;
}

export const BarrierRadarChart: React.FC<BarrierRadarChartProps> = ({
  indicators,
  selectedCategory = null,
  onSelectCategory,
  title = 'Multi-Domain Barrier Defense Profile',
  subtitle = '5-Axis operational safeguard integrity mapping (Outer perimeter = elevated risk exposure)'
}) => {
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const domains = [
    { key: 'barrier_integrity', label: 'Barrier Integrity', shortLabel: 'Barrier' },
    { key: 'energy_exposure', label: 'Energy Exposure', shortLabel: 'Energy' },
    { key: 'operational_drift', label: 'Operational Drift', shortLabel: 'Drift' },
    { key: 'pre_incident_conditions', label: 'Pre-Incident', shortLabel: 'Pre-Incident' },
    { key: 'systems_governance', label: 'Governance', shortLabel: 'Governance' }
  ];

  // Calculate normalized risk score for each domain (0 to 100)
  const domainScores = domains.map(d => {
    const matches = indicators.filter(i => i.category === d.key);
    if (matches.length === 0) return { ...d, score: 20, thresholdScore: 45, count: 0 };

    let totalBreachSeverity = 0;
    matches.forEach(m => {
      const ratio = m.threshold > 0 ? m.currentValue / m.threshold : 1;
      totalBreachSeverity += ratio * 45;
    });

    const avgScore = Math.min(100, Math.max(15, Math.round(totalBreachSeverity / matches.length)));
    return {
      ...d,
      score: avgScore,
      thresholdScore: 45,
      count: matches.length
    };
  });

  // Responsive viewBox dimensions: 440 wide by 300 tall with centered geometry
  const vbWidth = 440;
  const vbHeight = 300;
  const centerX = vbWidth / 2;
  const centerY = 145;
  const maxRadius = 82;
  const totalAxes = domainScores.length;

  // Geometry coordinate calculation
  const getCoordinates = (axisIndex: number, value: number, customRadius = maxRadius) => {
    const angle = (Math.PI * 2 / totalAxes) * axisIndex - Math.PI / 2;
    const r = (value / 100) * customRadius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      angle
    };
  };

  // Build polygon path for observed values
  const observedPoints = domainScores
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.score);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Build polygon path for baseline safe margin
  const baselinePoints = domainScores
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.thresholdScore);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const gridLevels = [25, 50, 75, 100];
  const gridStroke = isDark ? '#262626' : '#e5e5e5';
  const labelColor = isDark ? '#a3a3a3' : '#525252';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        {selectedCategory && onSelectCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline self-start sm:self-auto shrink-0"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        {/* Radar SVG with responsive scaling and safe boundaries */}
        <div className="w-full max-w-[400px] flex items-center justify-center">
          <svg
            viewBox={`0 0 ${vbWidth} ${vbHeight}`}
            className="w-full h-auto select-none"
          >
            {/* Concentric grid circles */}
            {gridLevels.map(level => {
              const r = (level / 100) * maxRadius;
              return (
                <circle
                  key={level}
                  cx={centerX}
                  cy={centerY}
                  r={r}
                  fill="none"
                  stroke={gridStroke}
                  strokeWidth="1"
                  strokeDasharray={level === 100 ? undefined : '2,2'}
                />
              );
            })}

            {/* Radial axis spokes */}
            {domainScores.map((d, i) => {
              const endCoord = getCoordinates(i, 100);
              const isSelected = selectedCategory === d.key;

              return (
                <line
                  key={d.key}
                  x1={centerX}
                  y1={centerY}
                  x2={endCoord.x}
                  y2={endCoord.y}
                  stroke={isSelected ? (isDark ? '#f8fafc' : '#0f172a') : gridStroke}
                  strokeWidth={isSelected ? '2' : '1'}
                />
              );
            })}

            {/* Safe baseline threshold boundary */}
            <polygon
              points={baselinePoints}
              fill="none"
              stroke={isDark ? '#22c55e' : '#16a34a'}
              strokeWidth="1.5"
              strokeDasharray="3,3"
              opacity={0.8}
            />

            {/* Observed Risk Envelope Polygon */}
            <polygon
              points={observedPoints}
              fill={isDark ? 'rgba(239, 68, 68, 0.22)' : 'rgba(185, 28, 28, 0.12)'}
              stroke={isDark ? '#ef4444' : '#b91c1c'}
              strokeWidth="2.5"
              className="transition-all duration-300"
            />

            {/* Interactive Data Point Handles */}
            {domainScores.map((d, i) => {
              const { x, y } = getCoordinates(i, d.score);
              const isHovered = hoveredAxis === d.key;
              const isSelected = selectedCategory === d.key;

              return (
                <g key={d.key}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected || isHovered ? 5.5 : 4}
                    fill={d.score >= 70 ? (isDark ? '#ef4444' : '#b91c1c') : (isDark ? '#f59e0b' : '#d97706')}
                    stroke={isDark ? '#0f172a' : '#ffffff'}
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredAxis(d.key)}
                    onMouseLeave={() => setHoveredAxis(null)}
                    onClick={() => onSelectCategory && onSelectCategory(selectedCategory === d.key ? null : d.key)}
                  />
                </g>
              );
            })}

            {/* Axis Domain Labels - Two-line compact formatting preventing edge collision */}
            {domainScores.map((d, i) => {
              const labelCoord = getCoordinates(i, 100, maxRadius + 20);
              const isHovered = hoveredAxis === d.key;
              const isSelected = selectedCategory === d.key;
              const isBreached = d.score > d.thresholdScore;

              let textAnchor: 'start' | 'middle' | 'end' = 'middle';
              if (labelCoord.x > centerX + 25) textAnchor = 'start';
              else if (labelCoord.x < centerX - 25) textAnchor = 'end';

              let baseline: 'auto' | 'central' | 'hanging' = 'central';
              if (labelCoord.y < centerY - 35) baseline = 'auto';
              else if (labelCoord.y > centerY + 35) baseline = 'hanging';

              return (
                <text
                  key={d.key}
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor={textAnchor}
                  dominantBaseline={baseline}
                  className="cursor-pointer transition-colors select-none"
                  onClick={() => onSelectCategory && onSelectCategory(selectedCategory === d.key ? null : d.key)}
                  onMouseEnter={() => setHoveredAxis(d.key)}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  <tspan
                    x={labelCoord.x}
                    dy={textAnchor === 'middle' ? '-0.3em' : '0'}
                    fontSize="10"
                    fontWeight={isSelected || isHovered ? '700' : '600'}
                    fill={isSelected ? (isDark ? '#f8fafc' : '#0f172a') : labelColor}
                  >
                    {d.label}
                  </tspan>
                  <tspan
                    x={labelCoord.x}
                    dy="1.2em"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="600"
                    fill={
                      isBreached
                        ? (isDark ? '#f87171' : '#dc2626')
                        : (isDark ? '#4ade80' : '#16a34a')
                    }
                  >
                    {d.score}/100 {isBreached ? '▲' : '✓'}
                  </tspan>
                </text>
              );
            })}
          </svg>
        </div>

        {/* Compact Domain Meters Strip (Never overflows or collides with adjacent card) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs pt-3 border-t border-neutral-100 dark:border-neutral-800">
          {domainScores.map(d => {
            const isSelected = selectedCategory === d.key;
            const isExceeded = d.score > d.thresholdScore;

            return (
              <button
                type="button"
                key={d.key}
                onClick={() => onSelectCategory && onSelectCategory(isSelected ? null : d.key)}
                className={`p-2 rounded text-left transition-colors border select-none min-w-0 ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 border-neutral-900 dark:border-neutral-100 shadow-xs'
                    : 'bg-neutral-50/70 dark:bg-neutral-950/70 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1 min-w-0">
                  <span className="font-medium truncate text-[11px]">{d.shortLabel}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums shrink-0 ${
                      isSelected
                        ? 'text-white dark:text-neutral-950 font-bold'
                        : isExceeded
                        ? 'text-red-700 dark:text-red-400 font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {d.score}
                  </span>
                </div>
                <div className="h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isSelected
                        ? 'bg-white dark:bg-neutral-950'
                        : isExceeded
                        ? 'bg-red-600 dark:bg-red-500'
                        : 'bg-emerald-600 dark:bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, d.score)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-1 bg-red-600 dark:bg-red-400 inline-block rounded-xs" />
              Observed Risk
            </span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-1 bg-emerald-600 dark:bg-emerald-400 border-dashed border-t inline-block" />
              Baseline Safe Margin (45)
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 shrink-0">
            Click domain to filter
          </span>
        </div>
      </div>
    </div>
  );
};
