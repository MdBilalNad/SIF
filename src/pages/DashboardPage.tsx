import React from 'react';
import { AnalysisRun } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { EmptyState } from '../components/common/EmptyState';
import { DataTable, Column } from '../components/tables/DataTable';
import { PlusCircle, FileText, ArrowRight, Activity, AlertTriangle, ShieldCheck, BarChart3 } from 'lucide-react';
import { api } from '../services/api';

export interface DashboardPageProps {
  analyses: AnalysisRun[];
  onNavigate: (route: any, id?: string) => void;
  onRefresh: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analyses,
  onNavigate,
  onRefresh
}) => {
  const latestAnalysis = analyses.length > 0 ? analyses[0] : null;
  const latestResult = latestAnalysis?.result;

  const totalCompleted = analyses.filter(a => a.status === 'complete').length;
  const totalRecords = analyses.reduce((acc, a) => acc + (a.recordsCount || 0), 0);
  const criticalRuns = analyses.filter(a => a.result?.severityLevel === 'critical' || a.result?.severityLevel === 'significant').length;

  const columns: Column<AnalysisRun>[] = [
    {
      key: 'id',
      header: 'Analysis ID',
      width: '160px',
      sortable: true,
      render: a => (
        <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100 hover:underline">
          {a.id}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Evaluation Date',
      width: '130px',
      sortable: true,
      render: a => (
        <span className="font-mono text-neutral-600 dark:text-neutral-400">
          {new Date(a.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'source',
      header: 'Facility / Source Input',
      render: a => (
        <div>
          <span className="font-medium text-neutral-900 dark:text-neutral-100 block truncate">
            {a.config.metadata.facilityOrSite || a.title}
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            {a.sourceFileName || 'Direct telemetry stream'}
          </span>
        </div>
      )
    },
    {
      key: 'records',
      header: 'Volume',
      align: 'right',
      width: '100px',
      sortable: true,
      render: a => (
        <span className="font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
          {a.recordsCount.toLocaleString()}
        </span>
      )
    },
    {
      key: 'outcome',
      header: 'Outcome Classification',
      render: a => {
        if (!a.result) return <span className="text-neutral-400 dark:text-neutral-600">Awaiting data</span>;
        return (
          <div className="flex items-center gap-2">
            <StatusIndicator level={a.result.severityLevel} label={a.result.classification} />
            <span className="font-mono text-neutral-500 dark:text-neutral-400 text-[11px]">
              ({a.result.compositeScore}/100)
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      width: '90px',
      render: a => (
        <button
          onClick={e => {
            e.stopPropagation();
            onNavigate('results', a.id);
          }}
          className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium text-xs hover:underline flex items-center gap-1 justify-end ml-auto"
        >
          View <ArrowRight size={12} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          SIF Precursor Engine
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Analyze precursor indicators and review structured analytical results.
        </p>
      </div>

      {/* Section A: Analysis Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-4 transition-colors">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Analyses Completed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              {analyses.length > 0 ? totalCompleted : 'Awaiting data'}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
            {analyses.length > 0 ? 'Verified evaluation records' : 'No records logged'}
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-4 transition-colors">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Active / Latest Precursor Level
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              {latestResult ? `${latestResult.compositeScore}` : 'Awaiting data'}
            </span>
            {latestResult && <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">/ 100</span>}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block truncate">
            {latestResult ? latestResult.classification : 'Run an analysis to populate'}
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-4 transition-colors">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Degraded Barriers Flagged
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              {latestResult ? latestResult.criticalBarriersDegraded : 'Awaiting data'}
            </span>
            {latestResult && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                of {latestResult.totalIndicatorsEvaluated}
              </span>
            )}
          </div>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
            In latest evaluated unit
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-4 transition-colors">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
            Total Operational Records
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
              {totalRecords > 0 ? totalRecords.toLocaleString() : 'Awaiting data'}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
            Telemetry logs and PTW entries
          </span>
        </div>
      </div>

      {/* Section B: Current Analysis Status Panel */}
      {latestAnalysis && latestResult ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">CURRENT ACTIVE EVALUATION</span>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{latestAnalysis.id}</span>
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                {latestAnalysis.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <StatusIndicator level={latestResult.severityLevel} label={latestResult.classification} />
              <Button
                size="sm"
                variant="primary"
                onClick={() => onNavigate('results', latestAnalysis.id)}
              >
                Inspect Full Report
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-neutral-500 dark:text-neutral-400">Primary Monitored Unit:</span>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {latestAnalysis.config.metadata.facilityOrSite || 'Main Site'} — {latestAnalysis.config.metadata.operatingUnit || 'All Units'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-500 dark:text-neutral-400">Evaluation Window:</span>
              <p className="font-mono text-neutral-900 dark:text-neutral-100">
                {latestAnalysis.config.dateRange.startDate} to {latestAnalysis.config.dateRange.endDate}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-500 dark:text-neutral-400">Dominant Finding:</span>
              <p className="text-neutral-800 dark:text-neutral-300 truncate" title={latestResult.explanation.summary}>
                {latestResult.explanation.summary}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Active Analysis Evaluation"
          description="There is currently no evaluated analysis in memory. Provide data to begin evaluating precursor indicators."
          actionLabel="Start New Analysis"
          onAction={() => onNavigate('analysis_new')}
          secondaryActionLabel="Load Sample Data"
          onSecondaryAction={() => {
            api.resetToSampleData();
            onRefresh();
          }}
        />
      )}

      {/* Section C: Data & Visualizations Hub Link */}
      {latestResult && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Graphical Visualizations Hub
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">8 Chart Engines</span>
            </div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Precursor Data Visualizations ({latestAnalysis?.id})
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Inspect volumetric area, multi-metric line trends, horizontal/vertical bar benchmarks, proportional pie slices, 5-axis barrier radar, and cross-plot matrices.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            icon={<BarChart3 size={13} />}
            onClick={() => onNavigate('data')}
            className="self-start sm:self-auto shrink-0"
          >
            Explore Data Charts
          </Button>
        </div>
      )}

      {/* Section D: Recent Analyses Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">Recent Analyses</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Verified analytical evaluations stored in the local workstation repository</p>
          </div>
          {analyses.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onNavigate('history')}
            >
              View Full History
            </Button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={analyses.slice(0, 5)}
          keyField="id"
          onRowClick={a => onNavigate('results', a.id)}
          emptyTitle="No recent analyses"
          emptyDescription="Run your first analysis to see results listed here."
        />
      </div>
    </div>
  );
};
