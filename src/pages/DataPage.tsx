import React, { useState } from 'react';
import { AnalysisRun } from '../types';
import { RiskAreaChart } from '../components/charts/RiskAreaChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { PrecursorPieChart } from '../components/charts/PrecursorPieChart';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { IndicatorBarChart } from '../components/charts/IndicatorBarChart';
import { BarrierRadarChart } from '../components/charts/BarrierRadarChart';
import { RiskCrossPlot } from '../components/charts/RiskCrossPlot';
import { DistributionChart } from '../components/charts/DistributionChart';
import { IndicatorMatrix } from '../components/charts/IndicatorMatrix';
import { Button } from '../components/common/Button';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { EmptyState } from '../components/common/EmptyState';
import { 
  FileSpreadsheet, 
  Layers, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  ShieldAlert, 
  Compass,
  ArrowRight,
  Filter
} from 'lucide-react';
import { api } from '../services/api';

export interface DataPageProps {
  analyses: AnalysisRun[];
  selectedAnalysisId?: string | null;
  onSelectAnalysis?: (id: string) => void;
  onNavigate: (route: any, id?: string) => void;
}

export const DataPage: React.FC<DataPageProps> = ({
  analyses,
  selectedAnalysisId,
  onSelectAnalysis,
  onNavigate
}) => {
  const [activeAnalysisId, setActiveAnalysisId] = useState<string>(
    selectedAnalysisId || (analyses.length > 0 ? analyses[0].id : '')
  );
  const [activeTab, setActiveTab] = useState<'all' | 'area_line' | 'bar_benchmark' | 'pie_domain' | 'radar_crossplot'>('all');

  const currentAnalysis = analyses.find(a => a.id === activeAnalysisId) || (analyses.length > 0 ? analyses[0] : null);
  const result = currentAnalysis?.result;

  if (!currentAnalysis || !result) {
    return (
      <EmptyState
        title="No Analytical Telemetry Found"
        description="There are no processed analytical datasets in memory to render data visualizations. Run an analysis or load sample data to inspect charts."
        actionLabel="Run New Analysis"
        onAction={() => onNavigate('analysis_new')}
        secondaryActionLabel="Go to Dashboard"
        onSecondaryAction={() => onNavigate('dashboard')}
      />
    );
  }

  const handleExportCsv = () => {
    api.exportAnalysisCsv(currentAnalysis);
  };

  const handleExportJson = () => {
    api.exportAnalysisJson(currentAnalysis);
  };

  const handleAnalysisChange = (newId: string) => {
    setActiveAnalysisId(newId);
    if (onSelectAnalysis) onSelectAnalysis(newId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Dataset Selection Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Data & Visualizations Station
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Multi-Model Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mt-1">
            Precursor Data Intelligence & Graphical Visualizations
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Volumetric area, multi-metric line trends, horizontal/vertical bar benchmarks, proportional pie slices, 5-axis barrier radar, and cross-plot matrices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Analysis Dataset Dropdown */}
          <div className="flex items-center gap-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-2.5 py-1.5 shadow-2xs">
            <Filter size={13} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
            <span className="text-neutral-500 dark:text-neutral-400 shrink-0">Dataset:</span>
            <select
              value={activeAnalysisId}
              onChange={e => handleAnalysisChange(e.target.value)}
              className="bg-transparent font-medium font-mono text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none cursor-pointer"
            >
              {analyses.map(a => (
                <option key={a.id} value={a.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  {a.id} — {a.config.metadata.facilityOrSite || a.title}
                </option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            variant="secondary"
            icon={<FileSpreadsheet size={13} className="text-emerald-600 dark:text-emerald-400" />}
            onClick={handleExportCsv}
            title="Download complete telemetry records as CSV"
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

      {/* Dataset KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-100/60 dark:bg-neutral-900/40 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 text-xs">
        <div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Evaluated Facility</span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate block">
            {currentAnalysis.config.metadata.facilityOrSite || currentAnalysis.title}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Composite Precursor Index</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
              {result.compositeScore}/100
            </span>
            <StatusIndicator level={result.severityLevel} label={result.classification} />
          </div>
        </div>
        <div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Degraded Critical Barriers</span>
          <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">
            {result.criticalBarriersDegraded} <span className="font-normal text-xs text-neutral-500 dark:text-neutral-400">of {result.totalIndicatorsEvaluated}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Operational Records Logged</span>
          <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
            {currentAnalysis.recordsCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chart Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-md w-fit overflow-x-auto max-w-full">
        {[
          { id: 'all', label: 'All Visualizations', icon: <Layers size={13} /> },
          { id: 'area_line', label: 'Area & Line Trends', icon: <TrendingUp size={13} /> },
          { id: 'bar_benchmark', label: 'Bar & Tolerance Limits', icon: <BarChart3 size={13} /> },
          { id: 'pie_domain', label: 'Pie & Distribution', icon: <PieIcon size={13} /> },
          { id: 'radar_crossplot', label: 'Barrier Radar & Cross-Plot', icon: <Compass size={13} /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* CHART SECTION: AREA & LINE TRENDS */}
      {(activeTab === 'all' || activeTab === 'area_line') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-neutral-500 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Continuous Longitudinal & Volumetric Visualizations (Area & Line)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              {result.timeSeriesData.length} Temporal Intervals
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <RiskAreaChart
              data={result.timeSeriesData}
              title={`Volumetric Precursor Risk Exposure (${currentAnalysis.id})`}
              subtitle="Shaded area projection displaying composite score, barrier decay, and energy containment over time"
            />
            <TrendLineChart
              data={result.timeSeriesData}
              title={`Multi-Metric Longitudinal Trajectory (${currentAnalysis.id})`}
              subtitle="Composite Precursor Index vs. barrier and exposure scores with safe operational threshold"
            />
          </div>
        </div>
      )}

      {/* CHART SECTION: BAR & BENCHMARK TOLERANCES */}
      {(activeTab === 'all' || activeTab === 'bar_benchmark') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 size={15} className="text-neutral-500 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Benchmark Tolerance & Categorical Magnitude (Horizontal & Vertical Bar Charts)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              {result.indicators.length} Precursor Indicators
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <CategoryBarChart
              indicators={result.indicators}
              title={`Operational Safeguard Domain Magnitude (${currentAnalysis.id})`}
              subtitle="Vertical bar analysis contrasting aggregated breach ratios across the 5 core safety domains"
            />
            <IndicatorBarChart
              indicators={result.indicators}
              title={`Indicator Tolerance Ratios vs. Standard Limits (${currentAnalysis.id})`}
              subtitle="Observed metric value normalized against engineering limit (Vertical marker = 100% threshold)"
            />
          </div>
        </div>
      )}

      {/* CHART SECTION: PIE & PROPORTIONAL DECOMPOSITION */}
      {(activeTab === 'all' || activeTab === 'pie_domain') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <PieIcon size={15} className="text-neutral-500 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Proportional Decomposition & Density Distribution (Pie, Donut & Histogram)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              Statistical Density
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <PrecursorPieChart
              indicators={result.indicators}
              title={`Precursor Proportional Share (${currentAnalysis.id})`}
              subtitle="Interactive Donut / Pie visualization toggleable by Hazard Domain or Severity State"
            />
            <DistributionChart
              data={result.distributionData}
              title={`Precursor Frequency Histogram (${currentAnalysis.id})`}
              subtitle="Sample frequency distribution plotted against normal calibrated baseline curve"
            />
          </div>
        </div>
      )}

      {/* CHART SECTION: RADAR DEFENSE PROFILE & CROSS-PLOT MATRIX */}
      {(activeTab === 'all' || activeTab === 'radar_crossplot') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-neutral-500 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Multi-Axis Barrier Defense & Quadrant Cross-Plot (Radar & Scatter Matrix)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              5-Axis Safeguard Integrity
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <BarrierRadarChart
              indicators={result.indicators}
              title={`Multi-Domain Barrier Defense Profile (${currentAnalysis.id})`}
              subtitle="5-Axis operational safeguard integrity mapping (Outer perimeter = elevated risk exposure)"
              onSelectCategory={() => onNavigate('results', currentAnalysis.id)}
            />
            <RiskCrossPlot
              indicators={result.indicators}
              title={`Energy Exposure vs. Barrier Degradation Cross-Plot (${currentAnalysis.id})`}
              subtitle="Scatter quadrant mapping barrier decay (X-axis) vs. uncontrolled energy hazard (Y-axis)"
              onSelectIndicator={() => onNavigate('results', currentAnalysis.id)}
            />
          </div>

          {/* Full-width Multi-Domain Matrix */}
          <div className="pt-2">
            <IndicatorMatrix indicators={result.indicators} />
          </div>
        </div>
      )}

      {/* Bottom Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs">
        <div className="space-y-0.5">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            Need in-depth tabular breakdown or full audit report?
          </span>
          <p className="text-neutral-500 dark:text-neutral-400">
            View the formal executive assessment, mathematical explanations, and raw indicators table in the Results page.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<ArrowRight size={13} />}
          onClick={() => onNavigate('results', currentAnalysis.id)}
        >
          View Full Report ({currentAnalysis.id})
        </Button>
      </div>
    </div>
  );
};
