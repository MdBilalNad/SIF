import React, { useState } from 'react';
import { AnalysisRun } from '../types';
import { DataTable, Column } from '../components/tables/DataTable';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { Button } from '../components/common/Button';
import { ComparisonModal } from '../components/results/ComparisonModal';
import { PlusCircle, Trash2, ArrowRight, Layers, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

export interface HistoryPageProps {
  analyses: AnalysisRun[];
  onNavigate: (route: any, id?: string) => void;
  onRefresh: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  analyses,
  onNavigate,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleSelectForCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete analysis run ${id}?`)) {
      await api.deleteAnalysis(id);
      setSelectedForCompare(prev => prev.filter(item => item !== id));
      onRefresh();
    }
  };

  const filteredAnalyses = analyses.filter(a => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'critical' && a.result?.severityLevel !== 'critical') return false;
      if (statusFilter === 'significant' && a.result?.severityLevel !== 'significant') return false;
      if (statusFilter === 'elevated' && a.result?.severityLevel !== 'elevated') return false;
      if (statusFilter === 'nominal' && a.result?.severityLevel !== 'nominal') return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        (a.sourceFileName && a.sourceFileName.toLowerCase().includes(q)) ||
        (a.config.metadata.facilityOrSite && a.config.metadata.facilityOrSite.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const runA = analyses.find(a => a.id === selectedForCompare[0]) || null;
  const runB = analyses.find(a => a.id === selectedForCompare[1]) || null;

  const columns: Column<AnalysisRun>[] = [
    {
      key: 'compare',
      header: 'Compare',
      width: '70px',
      render: a => {
        const isSelected = selectedForCompare.includes(a.id);
        return (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={e => handleToggleSelectForCompare(a.id, e as any)}
            onClick={e => e.stopPropagation()}
            title="Select 2 runs to compare side-by-side"
            className="accent-neutral-900 dark:accent-neutral-100 cursor-pointer"
          />
        );
      }
    },
    {
      key: 'id',
      header: 'Analysis ID',
      width: '150px',
      sortable: true,
      render: a => (
        <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100 hover:underline">
          {a.id}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      width: '150px',
      sortable: true,
      render: a => (
        <span className="font-mono text-neutral-600 dark:text-neutral-400">
          {new Date(a.createdAt).toLocaleDateString()} {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )
    },
    {
      key: 'facility',
      header: 'Facility / Target Scope',
      render: a => (
        <div>
          <span className="font-medium text-neutral-900 dark:text-neutral-100 block truncate max-w-xs">
            {a.config.metadata.facilityOrSite || a.title}
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            {a.sourceFileName || 'Direct stream'}
          </span>
        </div>
      )
    },
    {
      key: 'score',
      header: 'Composite P_I',
      align: 'right',
      width: '120px',
      sortable: true,
      render: a => {
        if (!a.result) return <span className="text-neutral-400 dark:text-neutral-600">Awaiting data</span>;
        return (
          <span className="font-mono font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
            {a.result.compositeScore} / 100
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Outcome Severity',
      width: '160px',
      render: a => {
        if (!a.result) return <StatusIndicator level={a.status} />;
        return <StatusIndicator level={a.result.severityLevel} label={a.result.classification} />;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '110px',
      render: a => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={e => {
              e.stopPropagation();
              onNavigate('results', a.id);
            }}
            className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            title="View analytical report"
          >
            <ArrowRight size={14} />
          </button>
          <button
            onClick={e => handleDelete(a.id, e)}
            className="text-neutral-400 dark:text-neutral-500 hover:text-red-700 dark:hover:text-red-400 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            title="Delete analysis record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Analysis History</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Search, filter, and compare historical precursor indicator evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedForCompare.length === 2 && (
            <Button
              size="sm"
              variant="primary"
              icon={<Layers size={13} />}
              onClick={() => setIsCompareOpen(true)}
            >
              Compare Selected (2)
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            icon={<PlusCircle size={13} />}
            onClick={() => onNavigate('analysis_new')}
          >
            New Analysis
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md transition-colors">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">Filter Severity:</span>
          {['all', 'critical', 'significant', 'elevated', 'nominal'].map(opt => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                statusFilter === opt
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          {analyses.length === 0 ? (
            <Button
              size="sm"
              variant="secondary"
              icon={<RotateCcw size={12} />}
              onClick={() => {
                api.resetToSampleData();
                onRefresh();
              }}
            >
              Load Sample History
            </Button>
          ) : (
            <button
              onClick={() => {
                if (window.confirm('Clear all analyses to test zero-data state?')) {
                  api.clearAllAnalyses();
                  onRefresh();
                }
              }}
              className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-xs hover:underline"
            >
              Clear All (Test Empty State)
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredAnalyses}
        keyField="id"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by ID, facility, source file, or keywords..."
        pagination={true}
        pageSize={8}
        onRowClick={a => onNavigate('results', a.id)}
        emptyTitle="No analyses yet."
        emptyDescription="Run your first analysis to see results here."
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        runA={runA}
        runB={runB}
      />
    </div>
  );
};
