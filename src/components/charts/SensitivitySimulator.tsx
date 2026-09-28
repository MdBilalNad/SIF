import React, { useState } from 'react';
import { AnalysisRun } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export interface SensitivitySimulatorProps {
  analysis: AnalysisRun;
  title?: string;
  subtitle?: string;
}

export const SensitivitySimulator: React.FC<SensitivitySimulatorProps> = ({
  analysis,
  title = 'Operational Sensitivity & Vulnerability Curve',
  subtitle = 'Non-linear coupling simulation modeling precursor score response across sensitivity levels'
}) => {
  const result = analysis.result;
  const initialSensitivity = analysis.config.sensitivity || 0.75;
  const [simSensitivity, setSimSensitivity] = useState<number>(initialSensitivity);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (!result) return null;

  const baseScore = result.compositeScore;
  const criticalThreshold = analysis.config.criticalThreshold;

  // Calculate curve points across 0.3 to 1.0
  const sensitivitySteps = [0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0];
  
  const curvePoints = sensitivitySteps.map(s => {
    // Non-linear escalation formula derived from methodology section 5
    const varianceRatio = s / initialSensitivity;
    const simulatedScore = Math.min(
      98,
      Math.max(12, Math.round(baseScore * Math.pow(varianceRatio, 0.85)))
    );
    return {
      sensitivity: s,
      label: `${(s * 100).toFixed(0)}%`,
      score: simulatedScore
    };
  });

  // Calculate simulated score for current slider
  const currentSimScore = Math.min(
    98,
    Math.max(12, Math.round(baseScore * Math.pow(simSensitivity / initialSensitivity, 0.85)))
  );

  const width = 560;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 35;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const getX = (sens: number) => {
    return paddingLeft + ((sens - 0.3) / 0.7) * innerWidth;
  };

  const getY = (val: number) => {
    return paddingTop + innerHeight - (val / 100) * innerHeight;
  };

  const polylinePoints = curvePoints.map(p => `${getX(p.sensitivity)},${getY(p.score)}`).join(' ');
  const thresholdY = getY(criticalThreshold);
  const currentX = getX(simSensitivity);
  const currentY = getY(currentSimScore);

  const gridColor = isDark ? '#262626' : '#e5e5e5';
  const axisTextColor = isDark ? '#a3a3a3' : '#737373';
  const curveColor = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded border border-neutral-200 dark:border-neutral-800 text-xs font-mono self-start sm:self-auto">
          <span className="text-neutral-500 dark:text-neutral-400">Simulated P_I:</span>
          <span
            className={`font-bold tabular-nums text-sm ${
              currentSimScore >= criticalThreshold
                ? 'text-red-700 dark:text-red-400'
                : 'text-neutral-900 dark:text-neutral-100'
            }`}
          >
            {currentSimScore} / 100
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            ({currentSimScore >= criticalThreshold ? 'Critical' : 'Controlled'})
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[480px] select-none">
          {/* Horizontal grid */}
          {[0, 25, 50, 75, 100].map(v => (
            <g key={v}>
              <line
                x1={paddingLeft}
                y1={getY(v)}
                x2={width - paddingRight}
                y2={getY(v)}
                stroke={gridColor}
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text x={paddingLeft - 8} y={getY(v) + 3} textAnchor="end" fontSize="10" fill={axisTextColor} className="font-mono">
                {v}
              </text>
            </g>
          ))}

          {/* Critical Threshold Line */}
          <line
            x1={paddingLeft}
            y1={thresholdY}
            x2={width - paddingRight}
            y2={thresholdY}
            stroke={isDark ? '#ef4444' : '#b91c1c'}
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <text
            x={width - paddingRight}
            y={thresholdY - 4}
            textAnchor="end"
            fontSize="9"
            fontWeight="600"
            fill={isDark ? '#ef4444' : '#b91c1c'}
          >
            Critical Limit ({criticalThreshold})
          </text>

          {/* Sensitivity Trajectory Line */}
          <polyline
            fill="none"
            stroke={curveColor}
            strokeWidth="2.5"
            points={polylinePoints}
          />

          {/* Active Sim Point */}
          <circle
            cx={currentX}
            cy={currentY}
            r={6}
            fill={currentSimScore >= criticalThreshold ? (isDark ? '#ef4444' : '#b91c1c') : (isDark ? '#f8fafc' : '#0f172a')}
            stroke={isDark ? '#0f172a' : '#ffffff'}
            strokeWidth="2"
          />

          {/* X Axis Labels */}
          {curvePoints.filter((_, idx) => idx % 2 === 0).map(p => (
            <text
              key={p.sensitivity}
              x={getX(p.sensitivity)}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill={axisTextColor}
              className="font-mono"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Interactive slider control linking directly to report */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-2/3">
          <span className="text-neutral-600 dark:text-neutral-400 font-medium shrink-0">
            Simulate Sensitivity: <strong className="text-neutral-900 dark:text-neutral-100 font-mono">{(simSensitivity * 100).toFixed(0)}%</strong>
          </span>
          <input
            type="range"
            min="0.3"
            max="1.0"
            step="0.05"
            value={simSensitivity}
            onChange={e => setSimSensitivity(parseFloat(e.target.value))}
            className="w-full accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
          />
        </div>

        <button
          onClick={() => setSimSensitivity(initialSensitivity)}
          className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline self-start sm:self-auto"
        >
          Reset to Audit Baseline ({(initialSensitivity * 100).toFixed(0)}%)
        </button>
      </div>
    </div>
  );
};
