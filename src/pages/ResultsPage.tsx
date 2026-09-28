import React, { useState } from 'react';
import { AnalysisRun } from '../types';
import { AssessmentCard } from '../components/results/AssessmentCard';
import { ExplanationPanel } from '../components/results/ExplanationPanel';
import { IndicatorBarChart } from '../components/charts/IndicatorBarChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { IndicatorMatrix } from '../components/charts/IndicatorMatrix';
import { DistributionChart } from '../components/charts/DistributionChart';
import { BarrierRadarChart } from '../components/charts/BarrierRadarChart';
import { RiskCrossPlot } from '../components/charts/RiskCrossPlot';
import { SensitivitySimulator } from '../components/charts/SensitivitySimulator';
import { IndicatorTable } from '../components/tables/IndicatorTable';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Download, Printer, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { api } from '../services/api';

export interface ResultsPageProps {
  analysis: AnalysisRun | null;
  onNavigate: (route: any, id?: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ analysis, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'indicators' | 'dynamics' | 'evidence'>('overview');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!analysis || !analysis.result) {
    return (
      <EmptyState
        title="Analysis Not Found"
        description="The requested analytical report could not be found or has not concluded processing."
        actionLabel="Go to Dashboard"
        onAction={() => onNavigate('dashboard')}
      />
    );
  }

  const { result } = analysis;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    api.exportAnalysisCsv(analysis);
  };

  const handleExportJson = () => {
    api.exportAnalysisJson(analysis);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar / metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <button
            onClick={() => onNavigate('history')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-1"
          >
            <ArrowLeft size={13} />
            <span>Back to History</span>
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {analysis.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-1">
            <span>ID: {analysis.id}</span>
            <span>·</span>
            <span>Recorded: {new Date(analysis.createdAt).toLocaleString()}</span>
            <span>·</span>
            <span>Source: {analysis.sourceFileName || 'Direct Telemetry'}</span>
            <span>·</span>
            <span>Engine: {analysis.engineVersion}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto no-print">
          <Button
            size="sm"
            variant="secondary"
            icon={<Printer size={13} />}
            onClick={handlePrint}
          >
            Print Report
          </Button>

          <Button
            size="sm"
            variant="secondary"
            icon={<FileSpreadsheet size={13} className="text-emerald-600 dark:text-emerald-400" />}
            onClick={handleExportCsv}
            title="Download comprehensive analytical report as CSV"
          >
            Export CSV
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportJson}
          >
            JSON
          </Button>
        </div>
      </div>

      {/* Tabs / View Selector */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-md w-fit no-print">
        {[
          { id: 'overview', label: 'Executive Assessment' },
          { id: 'indicators', label: `Indicators & Matrix (${result.indicators.length})` },
          { id: 'dynamics', label: 'Longitudinal & Risk Dynamics' },
          { id: 'evidence', label: 'Evidence & Interpretations' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE ASSESSMENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <AssessmentCard analysis={analysis} />

          {/* Interconnected Visualizations: Radar + Energy Cross-Plot */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <BarrierRadarChart
              indicators={result.indicators}
              selectedCategory={selectedCategory}
              onSelectCategory={cat => {
                setSelectedCategory(cat);
                if (cat) setActiveTab('indicators');
              }}
            />
            <RiskCrossPlot
              indicators={result.indicators}
              selectedIndicatorId={selectedIndicatorId}
              onSelectIndicator={id => {
                setSelectedIndicatorId(id);
                if (id) setActiveTab('indicators');
              }}
            />
          </div>

          {/* Primary Indicator Breakdown Table with Export CSV button */}
          <IndicatorTable
            indicators={result.indicators}
            analysisId={analysis.id}
            analysis={analysis}
            selectedIndicatorId={selectedIndicatorId}
            onSelectIndicator={setSelectedIndicatorId}
            categoryFilter={selectedCategory}
            onCategoryFilterChange={setSelectedCategory}
          />

          <ExplanationPanel explanation={result.explanation} />
        </div>
      )}

      {/* TAB 2: INDICATOR BREAKDOWN & MATRIX */}
      {activeTab === 'indicators' && (
        <div className="space-y-6">
          {/* Indicator Table with full interactive filters and dedicated Export CSV button */}
          <IndicatorTable
            indicators={result.indicators}
            analysisId={analysis.id}
            analysis={analysis}
            selectedIndicatorId={selectedIndicatorId}
            onSelectIndicator={setSelectedIndicatorId}
            categoryFilter={selectedCategory}
            onCategoryFilterChange={setSelectedCategory}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <IndicatorBarChart
              indicators={result.indicators}
              title="Relative Tolerance Ratios"
              subtitle="Observed metric value vs. calibrated benchmark standard"
            />
            <IndicatorMatrix indicators={result.indicators} />
          </div>
        </div>
      )}

      {/* TAB 3: LONGITUDINAL & RISK DYNAMICS */}
      {activeTab === 'dynamics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendLineChart data={result.timeSeriesData} />
            <SensitivitySimulator analysis={analysis} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskCrossPlot
              indicators={result.indicators}
              selectedIndicatorId={selectedIndicatorId}
              onSelectIndicator={setSelectedIndicatorId}
            />
            <DistributionChart data={result.distributionData} />
          </div>
        </div>
      )}

      {/* TAB 4: EVIDENCE & EXPLANATIONS */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <ExplanationPanel explanation={result.explanation} />

          {/* Configuration Parameters Reference */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 text-xs space-y-3 transition-colors">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm tracking-tight">
              Analysis Configuration & Run Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-neutral-700 dark:text-neutral-300">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block">Analysis Type</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {analysis.config.analysisType}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block">Sensitivity Level</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                  {(analysis.config.sensitivity * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block">Threshold Boundary</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                  {analysis.config.criticalThreshold} pts
                </span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block">Evaluated Record Count</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                  {analysis.recordsCount.toLocaleString()} entries
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
