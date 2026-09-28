import React from 'react';
import { AnalysisConfig, IndicatorDefinition } from '../../types';

export interface ConfigFormProps {
  config: AnalysisConfig;
  onChange: (updated: AnalysisConfig) => void;
  availableIndicators: IndicatorDefinition[];
}

export const ConfigForm: React.FC<ConfigFormProps> = ({
  config,
  onChange,
  availableIndicators
}) => {
  const handleTypeChange = (type: AnalysisConfig['analysisType']) => {
    onChange({ ...config, analysisType: type });
  };

  const handleIndicatorToggle = (id: string) => {
    const exists = config.indicatorSet.includes(id);
    const updated = exists
      ? config.indicatorSet.filter(i => i !== id)
      : [...config.indicatorSet, id];
    onChange({ ...config, indicatorSet: updated });
  };

  const handleSelectAllIndicators = () => {
    onChange({
      ...config,
      indicatorSet: availableIndicators.map(i => i.id)
    });
  };

  const handleClearIndicators = () => {
    onChange({
      ...config,
      indicatorSet: []
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Analysis Type */}
      <div>
        <label className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block mb-2">
          1. Analytical Method & Objective
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'sif_precursor_standard',
              name: 'Standard SIF Precursor Evaluation',
              desc: 'Holistic multi-domain vector analysis combining barrier decay, energy exposure, and operational drift.'
            },
            {
              id: 'barrier_decay_focus',
              name: 'Critical Barrier Degradation Focus',
              desc: 'Deep inspection on safety-instrumented systems, relief valves, interlocks, and maintenance deferrals.'
            },
            {
              id: 'high_energy_audit',
              name: 'High-Energy Exposure Audit',
              desc: 'Targeted assessment of uncontrolled gravitational, electrical, pressure, and kinetic line-of-fire work.'
            },
            {
              id: 'drift_variance',
              name: 'Operational Drift & Handover Variance',
              desc: 'Focus on procedural short-cuts, shift handover discrepancies, and supervisory sign-off bypasses.'
            }
          ].map(opt => {
            const isSelected = config.analysisType === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleTypeChange(opt.id as any)}
                className={`p-3.5 rounded border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50/80 dark:bg-neutral-800/80 ring-1 ring-neutral-900 dark:ring-neutral-100'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{opt.name}</span>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-neutral-900 dark:border-neutral-100' : 'border-neutral-400 dark:border-neutral-600'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />}
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{opt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Temporal Range & Facility Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        <div>
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Start Date</label>
          <input
            type="date"
            value={config.dateRange.startDate}
            onChange={e =>
              onChange({
                ...config,
                dateRange: { ...config.dateRange, startDate: e.target.value }
              })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">End Date</label>
          <input
            type="date"
            value={config.dateRange.endDate}
            onChange={e =>
              onChange({
                ...config,
                dateRange: { ...config.dateRange, endDate: e.target.value }
              })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Facility / Plant</label>
          <input
            type="text"
            placeholder="e.g. Rotterdam Complex"
            value={config.metadata.facilityOrSite || ''}
            onChange={e =>
              onChange({
                ...config,
                metadata: { ...config.metadata, facilityOrSite: e.target.value }
              })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 focus:outline-none placeholder-neutral-400 dark:placeholder-neutral-600"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Operating Unit</label>
          <input
            type="text"
            placeholder="e.g. HPU-04"
            value={config.metadata.operatingUnit || ''}
            onChange={e =>
              onChange({
                ...config,
                metadata: { ...config.metadata, operatingUnit: e.target.value }
              })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 focus:outline-none placeholder-neutral-400 dark:placeholder-neutral-600"
          />
        </div>
      </div>

      {/* 3. Sensitivity & Critical Threshold Tuning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-md bg-neutral-50/50 dark:bg-neutral-950/50">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Analytical Sensitivity</span>
            <span className="font-mono text-neutral-900 dark:text-neutral-100 font-semibold">
              {(config.sensitivity * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="1.0"
            step="0.05"
            value={config.sensitivity}
            onChange={e => onChange({ ...config, sensitivity: parseFloat(e.target.value) })}
            className="w-full accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            Higher sensitivity amplifies weak precursor signals in lower-density telemetry sets.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Critical Trigger Threshold</span>
            <span className="font-mono text-neutral-900 dark:text-neutral-100 font-semibold">
              Index &ge; {config.criticalThreshold}
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="90"
            step="5"
            value={config.criticalThreshold}
            onChange={e => onChange({ ...config, criticalThreshold: parseInt(e.target.value) })}
            className="w-full accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
          />
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            Scores above this threshold trigger mandatory critical intervention classifications.
          </p>
        </div>
      </div>

      {/* 4. Precursor Indicator Set Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            2. Monitored Precursor Indicators ({config.indicatorSet.length} of {availableIndicators.length} active)
          </label>
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={handleSelectAllIndicators}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
            >
              Select All
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button
              type="button"
              onClick={handleClearIndicators}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {availableIndicators.map(ind => {
            const isChecked = config.indicatorSet.includes(ind.id);
            return (
              <label
                key={ind.id}
                className={`flex items-start gap-2.5 p-2.5 rounded border cursor-pointer select-none text-xs transition-colors ${
                  isChecked
                    ? 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                    : 'bg-neutral-50/50 dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800 opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleIndicatorToggle(ind.id)}
                  className="mt-0.5 accent-neutral-900 dark:accent-neutral-100 shrink-0"
                />
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{ind.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-2 font-mono">
                    <span>{ind.categoryLabel}</span>
                    <span>·</span>
                    <span>Threshold: {ind.defaultThreshold} {ind.unit}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
