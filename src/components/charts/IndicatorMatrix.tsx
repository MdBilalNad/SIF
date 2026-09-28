import React from 'react';
import { PrecursorIndicator } from '../../types';

export interface IndicatorMatrixProps {
  indicators: PrecursorIndicator[];
}

export const IndicatorMatrix: React.FC<IndicatorMatrixProps> = ({ indicators }) => {
  const categories = [
    { key: 'barrier_integrity', label: 'Barrier Integrity' },
    { key: 'energy_exposure', label: 'Energy Exposure' },
    { key: 'operational_drift', label: 'Operational Drift' },
    { key: 'pre_incident_conditions', label: 'Pre-Incident Conditions' },
    { key: 'systems_governance', label: 'Systems Governance' }
  ];

  const severities: ('nominal' | 'elevated' | 'significant' | 'critical')[] = [
    'nominal',
    'elevated',
    'significant',
    'critical'
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 transition-colors">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">Precursor Domain Matrix</h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Distribution of evaluated precursors across operational barrier categories and severity bands
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-950/75">
              <th className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200 w-1/3">Domain Category</th>
              <th className="py-2.5 px-3 font-medium text-emerald-800 dark:text-emerald-400 text-center">Nominal</th>
              <th className="py-2.5 px-3 font-medium text-amber-800 dark:text-amber-400 text-center">Elevated</th>
              <th className="py-2.5 px-3 font-medium text-orange-900 dark:text-orange-400 text-center">Significant</th>
              <th className="py-2.5 px-3 font-medium text-red-800 dark:text-red-400 text-center">Critical SIF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {categories.map(cat => {
              const catIndicators = indicators.filter(i => i.category === cat.key);

              return (
                <tr key={cat.key} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                  <td className="py-3 px-3 font-medium text-neutral-900 dark:text-neutral-100">
                    <div>{cat.label}</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {catIndicators.length} monitored
                    </div>
                  </td>

                  {severities.map(sev => {
                    const matches = catIndicators.filter(i => i.status === sev);
                    const count = matches.length;

                    let cellBg = 'bg-transparent text-neutral-400 dark:text-neutral-600';
                    if (count > 0) {
                      if (sev === 'critical') cellBg = 'bg-red-50 text-red-700 font-semibold border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/60';
                      else if (sev === 'significant') cellBg = 'bg-orange-50 text-orange-800 font-semibold border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/60';
                      else if (sev === 'elevated') cellBg = 'bg-amber-50 text-amber-800 font-medium border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60';
                      else cellBg = 'bg-emerald-50 text-emerald-800 font-medium border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60';
                    }

                    return (
                      <td key={sev} className="py-3 px-3 text-center align-middle">
                        <div className={`py-1 px-2 rounded inline-block text-xs font-mono tabular-nums ${cellBg}`}>
                          {count > 0 ? (
                            <span title={matches.map(m => m.name).join(', ')}>
                              {count} {count === 1 ? 'item' : 'items'}
                            </span>
                          ) : (
                            '—'
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
