import React from 'react';
import { AnalysisConfig, IndicatorDefinition } from '../../types';
import { Button } from '../common/Button';
import { UploadedFileData } from '../forms/FileUploadZone';

export interface ReviewPanelProps {
  config: AnalysisConfig;
  fileData: UploadedFileData | null;
  indicators: IndicatorDefinition[];
  onRunAnalysis: () => void;
  onEdit: () => void;
  isSubmitting?: boolean;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  config,
  fileData,
  indicators,
  onRunAnalysis,
  onEdit,
  isSubmitting = false
}) => {
  const selectedIndicators = indicators.filter(i => config.indicatorSet.includes(i.id));

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-6 transition-colors">
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">Review Analysis Parameters</h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Verify configuration settings and dataset specifications before initiating the analytical evaluation run.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Source Data Box */}
        <div className="p-3.5 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50/50 dark:bg-neutral-950/50 space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
            Input Dataset Specifications
          </span>
          <div className="space-y-1.5 text-neutral-700 dark:text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Source:</span>
              <span className="font-medium font-mono text-neutral-900 dark:text-neutral-100">{fileData ? fileData.name : 'Direct Stream'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Format & Size:</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">
                {fileData ? `${fileData.type} (${(fileData.size / 1024).toFixed(1)} KB)` : 'Simulated Telemetry'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Record Volume:</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">
                {fileData ? fileData.rowCount.toLocaleString() : '1,420'} entries
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Facility / Unit:</span>
              <span className="text-neutral-900 dark:text-neutral-100">
                {config.metadata.facilityOrSite || 'Global'} {config.metadata.operatingUnit ? `— ${config.metadata.operatingUnit}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Configuration Box */}
        <div className="p-3.5 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50/50 dark:bg-neutral-950/50 space-y-2">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
            Analytical Configuration
          </span>
          <div className="space-y-1.5 text-neutral-700 dark:text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Evaluation Type:</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {config.analysisType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Temporal Window:</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">
                {config.dateRange.startDate} to {config.dateRange.endDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Sensitivity Calibration:</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">{(config.sensitivity * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Critical Trigger Level:</span>
              <span className="font-mono text-neutral-900 dark:text-neutral-100">Index &ge; {config.criticalThreshold}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Indicators Summary */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Precursor Indicators to Evaluate ({selectedIndicators.length}):
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {selectedIndicators.map(ind => (
            <div
              key={ind.id}
              className="p-2 border border-neutral-200 dark:border-neutral-800 rounded text-xs bg-white dark:bg-neutral-950 flex items-center justify-between gap-2"
            >
              <div className="truncate">
                <span className="font-medium text-neutral-900 dark:text-neutral-100 block truncate">{ind.name}</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">{ind.categoryLabel}</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
                Limit: {ind.defaultThreshold} {ind.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onEdit}
          disabled={isSubmitting}
        >
          Modify Inputs
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onRunAnalysis}
          isLoading={isSubmitting}
        >
          Run Analysis
        </Button>
      </div>
    </div>
  );
};
