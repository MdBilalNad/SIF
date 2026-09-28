import React from 'react';
import { AnalysisRun } from '../../types';
import { Modal } from '../common/Modal';
import { StatusIndicator } from '../common/StatusIndicator';

export interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  runA: AnalysisRun | null;
  runB: AnalysisRun | null;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  runA,
  runB
}) => {
  if (!runA || !runB) return null;

  const resA = runA.result;
  const resB = runB.result;

  const scoreDiff = (resB?.compositeScore || 0) - (resA?.compositeScore || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comparative Precursor Analysis"
      subtitle={`Evaluating variance between ${runA.id} and ${runB.id}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Delta Overview Banner */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Variance In Composite Precursor Index:</span>
            <span className="text-neutral-500 dark:text-neutral-400 mt-0.5 block">
              Comparison between baseline run and secondary evaluation.
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-lg font-bold font-mono tabular-nums ${
                scoreDiff > 0 ? 'text-red-700 dark:text-red-400' : scoreDiff < 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {scoreDiff > 0 ? `+${scoreDiff.toFixed(1)}` : scoreDiff.toFixed(1)} pts
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
              {scoreDiff > 0 ? 'Risk elevation detected' : scoreDiff < 0 ? 'Risk reduction observed' : 'No net change'}
            </span>
          </div>
        </div>

        {/* Side-by-side core overview */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Run A */}
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <div>
                <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 block">{runA.id}</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {new Date(runA.createdAt).toLocaleDateString()}
                </span>
              </div>
              {resA && <StatusIndicator level={resA.severityLevel} label={resA.classification} />}
            </div>

            <div className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Facility:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{runA.config.metadata.facilityOrSite || 'Standard'}</span>
              </div>
              <div className="flex justify-between">
                <span>Composite Score (P_I):</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{resA?.compositeScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>Degraded Barriers:</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100">{resA?.criticalBarriersDegraded}</span>
              </div>
              <div className="flex justify-between">
                <span>Evaluated Volume:</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100">{runA.recordsCount.toLocaleString()} rows</span>
              </div>
            </div>
          </div>

          {/* Run B */}
          <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <div>
                <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 block">{runB.id}</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {new Date(runB.createdAt).toLocaleDateString()}
                </span>
              </div>
              {resB && <StatusIndicator level={resB.severityLevel} label={resB.classification} />}
            </div>

            <div className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Facility:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{runB.config.metadata.facilityOrSite || 'Standard'}</span>
              </div>
              <div className="flex justify-between">
                <span>Composite Score (P_I):</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{resB?.compositeScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span>Degraded Barriers:</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100">{resB?.criticalBarriersDegraded}</span>
              </div>
              <div className="flex justify-between">
                <span>Evaluated Volume:</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100">{runB.recordsCount.toLocaleString()} rows</span>
              </div>
            </div>
          </div>
        </div>

        {/* Common Indicator Comparison Table */}
        <div>
          <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200 block mb-2">
            Shared Indicator Delta Matrix
          </span>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800">
                  <th className="p-2.5 font-semibold text-neutral-800 dark:text-neutral-200">Indicator</th>
                  <th className="p-2.5 font-semibold text-neutral-800 dark:text-neutral-200 text-right">{runA.id}</th>
                  <th className="p-2.5 font-semibold text-neutral-800 dark:text-neutral-200 text-right">{runB.id}</th>
                  <th className="p-2.5 font-semibold text-neutral-800 dark:text-neutral-200 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {resA?.indicators.map(indA => {
                  const indB = resB?.indicators.find(i => i.id === indA.id);
                  if (!indB) return null;
                  const diff = indB.currentValue - indA.currentValue;

                  return (
                    <tr key={indA.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="p-2.5 font-medium text-neutral-900 dark:text-neutral-100">{indA.name}</td>
                      <td className="p-2.5 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                        {indA.currentValue} {indA.unit}
                      </td>
                      <td className="p-2.5 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                        {indB.currentValue} {indB.unit}
                      </td>
                      <td className="p-2.5 text-right font-mono tabular-nums">
                        <span
                          className={
                            diff > 0 ? 'text-red-700 dark:text-red-400 font-semibold' : diff < 0 ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-neutral-500 dark:text-neutral-400'
                          }
                        >
                          {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
