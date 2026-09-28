import React, { useState, useEffect } from 'react';
import { AnalysisConfig, IndicatorDefinition } from '../types';
import { FileUploadZone, UploadedFileData } from '../components/forms/FileUploadZone';
import { ConfigForm } from '../components/forms/ConfigForm';
import { ReviewPanel } from '../components/analysis/ReviewPanel';
import { ProcessingScreen } from '../components/analysis/ProcessingScreen';
import { Button } from '../components/common/Button';
import { api } from '../services/api';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export interface NewAnalysisPageProps {
  onAnalysisCreated: (newId: string) => void;
  onNavigate: (route: any) => void;
}

export const NewAnalysisPage: React.FC<NewAnalysisPageProps> = ({
  onAnalysisCreated,
  onNavigate
}) => {
  const [step, setStep] = useState<'input' | 'config' | 'review' | 'processing'>('input');
  const [fileData, setFileData] = useState<UploadedFileData | null>(null);
  const [availableIndicators, setAvailableIndicators] = useState<IndicatorDefinition[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Analysis Configuration State
  const [config, setConfig] = useState<AnalysisConfig>({
    analysisType: 'sif_precursor_standard',
    dateRange: {
      startDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    indicatorSet: [],
    sensitivity: 0.75,
    criticalThreshold: 70,
    metadata: {
      facilityOrSite: '',
      operatingUnit: '',
      analystId: '',
      notes: ''
    }
  });

  useEffect(() => {
    const fetchCatalog = async () => {
      const indicators = await api.getIndicators();
      setAvailableIndicators(indicators);
      // Pre-select first 4 indicators
      setConfig(prev => ({
        ...prev,
        indicatorSet: indicators.slice(0, 4).map(i => i.id)
      }));
    };
    fetchCatalog();
  }, []);

  const handleUseSampleData = () => {
    const fakeFile = new File(['mock content'], 'hpu4_telemetry_and_permits_q3.csv', { type: 'text/csv' });
    setFileData({
      file: fakeFile,
      name: 'hpu4_telemetry_and_permits_q3.csv',
      size: 2457600,
      type: 'CSV',
      rowCount: 14820,
      previewRows: [
        ['2026-09-01T08:00:00Z', 'FAC-ROTT-B', 'HPU-04', 'barrier_integrity', '2.4'],
        ['2026-09-03T10:30:00Z', 'FAC-ROTT-B', 'HPU-04', 'barrier_integrity', '6.2'],
        ['2026-09-07T14:15:00Z', 'FAC-ROTT-B', 'HPU-04', 'energy_exposure', '48.0']
      ],
      headers: ['timestamp', 'facility_id', 'operating_unit', 'hazard_category', 'observed_value']
    });

    setConfig(prev => ({
      ...prev,
      metadata: {
        facilityOrSite: 'Rotterdam Complex - Terminal B',
        operatingUnit: 'HPU-04',
        analystId: 'ANL-ENG-441',
        notes: 'Targeted assessment following automated trip alarm frequency spike during high-throughput run.'
      }
    }));
  };

  const [createdAnalysisId, setCreatedAnalysisId] = useState<string | null>(null);

  const handleInitiateRun = async () => {
    setIsSubmitting(true);
    setStep('processing');

    try {
      const newRun = await api.createAnalysis({
        title: config.metadata.facilityOrSite 
          ? `${config.metadata.facilityOrSite} — Precursor Evaluation`
          : fileData
          ? `${fileData.name} — Precursor Audit`
          : 'Operational Precursor Indicator Audit',
        sourceType: fileData ? 'file_upload' : 'manual_input',
        sourceFileName: fileData?.name || 'manual_entry_telemetry.csv',
        sourceFileSize: fileData?.size || 1024 * 32,
        recordsCount: fileData?.rowCount || 1420,
        config
      });

      setCreatedAnalysisId(newRun.id);
    } catch (err) {
      console.error('Failed to create analysis', err);
      setIsSubmitting(false);
      setStep('review');
    }
  };

  const handleProcessingComplete = () => {
    if (createdAnalysisId) {
      onAnalysisCreated(createdAnalysisId);
    }
  };

  const stepsList = [
    { id: 'input', label: '1. Input Source' },
    { id: 'config', label: '2. Configuration' },
    { id: 'review', label: '3. Review & Run' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">New Analysis</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Provide the required inputs to evaluate precursor indicators.
        </p>
      </div>

      {/* Stepper Navigation (Segmented buttons) */}
      {step !== 'processing' && (
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          {stepsList.map(s => {
            const isCurrent = step === s.id;
            const isCompleted =
              (s.id === 'input' && (step === 'config' || step === 'review')) ||
              (s.id === 'config' && step === 'review');

            return (
              <button
                key={s.id}
                onClick={() => {
                  if (s.id === 'input') setStep('input');
                  else if (s.id === 'config' && (fileData || step === 'review')) setStep('config');
                  else if (s.id === 'review' && config.indicatorSet.length > 0) setStep('review');
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                    : isCompleted
                    ? 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400'
                }`}
              >
                {isCompleted && <Check size={12} className="text-emerald-500 dark:text-emerald-400" />}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* STEP 1: Input Source */}
      {step === 'input' && (
        <div className="space-y-6">
          <FileUploadZone
            onFileLoaded={setFileData}
            currentFile={fileData}
            onUseSampleData={handleUseSampleData}
          />

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => onNavigate('dashboard')}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={!fileData}
              onClick={() => setStep('config')}
              icon={<ArrowRight size={14} />}
            >
              Proceed to Configuration
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Configuration */}
      {step === 'config' && (
        <div className="space-y-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 transition-colors">
          <ConfigForm
            config={config}
            onChange={setConfig}
            availableIndicators={availableIndicators}
          />

          <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setStep('input')}
              icon={<ArrowLeft size={14} />}
            >
              Back to Input
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={config.indicatorSet.length === 0}
              onClick={() => setStep('review')}
              icon={<ArrowRight size={14} />}
            >
              Review Before Analysis
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Review */}
      {step === 'review' && (
        <ReviewPanel
          config={config}
          fileData={fileData}
          indicators={availableIndicators}
          onRunAnalysis={handleInitiateRun}
          onEdit={() => setStep('config')}
          isSubmitting={isSubmitting}
        />
      )}

      {/* STEP 4: Processing Screen */}
      {step === 'processing' && (
        <ProcessingScreen onComplete={handleProcessingComplete} />
      )}
    </div>
  );
};
