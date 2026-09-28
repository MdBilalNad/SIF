import React from 'react';
import { AnalysisResult, AnalysisRun } from '../../types';
import { StatusIndicator } from '../common/StatusIndicator';

export interface AssessmentCardProps {
  analysis: AnalysisRun;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ analysis }) => {
  const result = analysis.result;
  if (!result) return null;

  let borderColor = 'border-neutral-200 dark:border-neutral-800';
  let badgeTextColor = 'text-neutral-700 dark:text-neutral-300';

  if (result.severityLevel === 'critical') {
    borderColor = 'border-red-300 dark:border-red-900/60';
    badgeTextColor = 'text-red-800 dark:text-red-400';
  } else if (result.severityLevel === 'significant') {
    borderColor = 'border-orange-300 dark:border-orange-900/60';
    badgeTextColor = 'text-orange-900 dark:text-orange-400';
  } else if (result.severityLevel === 'elevated') {
    borderColor = 'border-amber-300 dark:border-amber-900/60';
    badgeTextColor = 'text-amber-800 dark:text-amber-400';
  } else {
    borderColor = 'border-emerald-300 dark:border-emerald-900/60';
    badgeTextColor = 'text-emerald-800 dark:text-emerald-400';
  }

  return (
    <div className={`bg-white dark:bg-neutral-900 border ${borderColor} rounded-md p-6 space-y-6 transition-colors`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase">Analysis Outcome</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{analysis.engineVersion}</span>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mt-0.5">
            {result.classification}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <StatusIndicator level={result.severityLevel} label={result.classification} />
        </div>
      </div>

      {/* Main Score & Core Metric Cluster */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Composite Precursor Index */}
        <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Composite Precursor Index (P_I)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-mono tabular-nums ${badgeTextColor}`}>
              {result.compositeScore}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">/ 100</span>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            Critical Threshold: {analysis.config.criticalThreshold}
          </span>
        </div>

        {/* Metric 2: Critical Barriers Degraded */}
        <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Degraded Barriers
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {result.criticalBarriersDegraded}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
              of {result.totalIndicatorsEvaluated}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            {result.criticalBarriersDegraded > 0 ? 'Safeguard erosion detected' : 'Full barrier integrity'}
          </span>
        </div>

        {/* Metric 3: Active Precursor Warnings */}
        <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Active Precursors
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {result.activePrecursorsCount}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">indicators</span>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            Exceeding baseline limit
          </span>
        </div>

        {/* Metric 4: Empirical Confidence */}
        <div className="p-3.5 bg-neutral-50/70 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Mathematical Confidence
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {result.confidenceScore ? `${(result.confidenceScore * 100).toFixed(0)}%` : '—'}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            Based on {analysis.recordsCount.toLocaleString()} records
          </span>
        </div>
      </div>

      {/* Primary Contributor Highlights */}
      {result.primaryContributors && result.primaryContributors.length > 0 && (
        <div className="pt-2">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block mb-2">
            Dominant Risk Contributors:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {result.primaryContributors.map(c => (
              <div
                key={c.indicatorId}
                className="p-3 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{c.name}</span>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400 font-medium text-[11px] shrink-0 ml-1">
                    {c.weightPct}% weight
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">{c.impactSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
