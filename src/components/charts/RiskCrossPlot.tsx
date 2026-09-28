import React, { useState } from 'react';
import { PrecursorIndicator } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export interface RiskCrossPlotProps {
  indicators: PrecursorIndicator[];
  selectedIndicatorId?: string | null;
  onSelectIndicator?: (id: string | null) => void;
  title?: string;
  subtitle?: string;
}

export const RiskCrossPlot: React.FC<RiskCrossPlotProps> = ({
  indicators,
  selectedIndicatorId = null,
  onSelectIndicator,
  title = 'Energy vs. Barrier Degradation Cross-Plot',
  subtitle = 'Precursor indicators mapped by barrier degradation (X-axis) and uncontrolled energy exposure (Y-axis)'
}) => {
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const width = 580;
  const height = 300;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const activeId = hoveredPointId || selectedIndicatorId;
  const activeIndicator = indicators.find(i => i.id === activeId);

  // Map each indicator to X (barrier decay 0-100) and Y (energy exposure 0-100)
  const mappedPoints = indicators.map(ind => {
    const ratio = ind.threshold > 0 ? ind.currentValue / ind.threshold : 1;
    // Barrier decay percentage
    const barrierDecay = Math.min(100, Math.max(10, Math.round(ratio * 50)));
    // Energy exposure factor
    const isEnergyRelated = ind.category === 'energy_exposure' || ind.id.includes('energy');
    const energyScore = isEnergyRelated
      ? Math.min(100, Math.max(30, Math.round(ind.currentValue * 1.4)))
      : Math.min(95, Math.max(15, Math.round(ratio * 40 + ind.contributionPct * 1.5)));

    const x = paddingLeft + (barrierDecay / 100) * innerWidth;
    const y = paddingTop + innerHeight - (energyScore / 100) * innerHeight;

    return {
      ...ind,
      barrierDecay,
      energyScore,
      x,
      y
    };
  });

  const midX = paddingLeft + innerWidth / 2;
  const midY = paddingTop + innerHeight / 2;

  const gridColor = isDark ? '#262626' : '#e5e5e5';
  const axisTextColor = isDark ? '#a3a3a3' : '#737373';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        {activeIndicator && (
          <div className="text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px] inline-block align-bottom">{activeIndicator.name}</span>:{' '}
            <span>{activeIndicator.currentValue} {activeIndicator.unit}</span>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px] select-none">
          {/* Quadrant Background Shading */}
          {/* Top Right: Critical SIF Hazard Zone */}
          <rect
            x={midX}
            y={paddingTop}
            width={innerWidth / 2}
            height={innerHeight / 2}
            fill={isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(254, 226, 226, 0.6)'}
          />
          <text
            x={width - paddingRight - 8}
            y={paddingTop + 14}
            textAnchor="end"
            fontSize="9"
            fontWeight="700"
            fill={isDark ? '#f87171' : '#b91c1c'}
            className="uppercase tracking-wider font-mono"
          >
            CRITICAL SIF ZONE (High Energy + Barrier Decay)
          </text>

          {/* Bottom Left: Nominal Operating Zone */}
          <rect
            x={paddingLeft}
            y={midY}
            width={innerWidth / 2}
            height={innerHeight / 2}
            fill={isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(240, 253, 244, 0.6)'}
          />
          <text
            x={paddingLeft + 8}
            y={height - paddingBottom - 10}
            textAnchor="start"
            fontSize="9"
            fontWeight="600"
            fill={isDark ? '#4ade80' : '#15803d'}
            className="uppercase tracking-wider font-mono"
          >
            Nominal Operating Margin
          </text>

          {/* Midline threshold divides */}
          <line
            x1={midX}
            y1={paddingTop}
            x2={midX}
            y2={height - paddingBottom}
            stroke={isDark ? '#404040' : '#d4d4d4'}
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <line
            x1={paddingLeft}
            y1={midY}
            x2={width - paddingRight}
            y2={midY}
            stroke={isDark ? '#404040' : '#d4d4d4'}
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />

          {/* Outer Boundary Axes */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke={gridColor}
            strokeWidth="1.5"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={height - paddingBottom}
            stroke={gridColor}
            strokeWidth="1.5"
          />

          {/* X Axis Labels */}
          <text x={paddingLeft} y={height - 14} textAnchor="start" fontSize="10" fill={axisTextColor}>
            0% (Safeguards Intact)
          </text>
          <text x={midX} y={height - 14} textAnchor="middle" fontSize="10" fontWeight="600" fill={axisTextColor}>
            Barrier Degradation Index (X)
          </text>
          <text x={width - paddingRight} y={height - 14} textAnchor="end" fontSize="10" fill={axisTextColor}>
            100% (Full Barrier Loss)
          </text>

          {/* Y Axis Labels */}
          <text
            x={12}
            y={midY}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill={axisTextColor}
            transform={`rotate(-90 12 ${midY})`}
          >
            High-Energy Potential (Y)
          </text>

          {/* Plotted Indicator Points */}
          {mappedPoints.map(p => {
            const isHovered = hoveredPointId === p.id;
            const isSelected = selectedIndicatorId === p.id;
            const isHighlighted = isHovered || isSelected;

            let pointFill = isDark ? '#22c55e' : '#16a34a';
            if (p.status === 'critical') pointFill = isDark ? '#ef4444' : '#dc2626';
            else if (p.status === 'significant') pointFill = isDark ? '#f97316' : '#ea580c';
            else if (p.status === 'elevated') pointFill = isDark ? '#eab308' : '#ca8a04';

            return (
              <g key={p.id} className="cursor-pointer">
                {isHighlighted && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={14}
                    fill={pointFill}
                    opacity={0.25}
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHighlighted ? 7 : 5}
                  fill={pointFill}
                  stroke={isDark ? '#0f172a' : '#ffffff'}
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPointId(p.id)}
                  onMouseLeave={() => setHoveredPointId(null)}
                  onClick={() => onSelectIndicator && onSelectIndicator(selectedIndicatorId === p.id ? null : p.id)}
                />
                <text
                  x={p.x + 8}
                  y={p.y + 3}
                  fontSize="10"
                  fontWeight={isHighlighted ? '700' : '400'}
                  fill={isHighlighted ? (isDark ? '#f8fafc' : '#0f172a') : axisTextColor}
                  className="transition-colors pointer-events-none"
                >
                  {p.name.length > 22 ? `${p.name.slice(0, 20)}...` : p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-500 inline-block" /> Critical Breach
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 inline-block" /> Warning Threshold
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500 inline-block" /> Nominal
          </span>
        </div>
        <span>Click any point to focus & filter in the indicator breakdown table</span>
      </div>
    </div>
  );
};
