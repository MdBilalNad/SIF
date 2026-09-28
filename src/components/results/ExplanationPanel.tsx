import React from 'react';
import { AnalysisResult } from '../../types';

export interface ExplanationPanelProps {
  explanation: AnalysisResult['explanation'];
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-6 transition-colors">
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Analytical Explanation & Evidence Grounding
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Why this result appears based strictly on observed operational telemetry and verified threshold breaches
        </p>
      </div>

      {/* Summary statement */}
      <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-l-2 border-neutral-900 dark:border-neutral-100 rounded-r text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
        {explanation.summary}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Observed Evidence */}
        <div className="space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
            Observed Physical & Telemetry Evidence
          </span>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            {explanation.observedEvidence.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neutral-400 dark:text-neutral-500 font-mono text-[11px] select-none shrink-0 mt-0.5">
                  [{idx + 1}]
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Barrier Failures */}
        <div className="space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
            Identified Barrier Degradations
          </span>
          {explanation.criticalFailures.length > 0 ? (
            <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
              {explanation.criticalFailures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 font-mono text-[11px] select-none shrink-0 mt-0.5">
                    ●
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400 italic">No critical barrier failures identified in this evaluation window.</p>
          )}
        </div>

        {/* Systemic Preconditions */}
        <div className="space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
            Systemic Preconditions & Latent Factors
          </span>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            {explanation.systemicPreconditions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px] select-none shrink-0 mt-0.5">
                  ▲
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Mitigations */}
        <div className="space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
            Recommended Engineering Mitigations
          </span>
          <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
            {explanation.recommendedMitigations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] select-none shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
