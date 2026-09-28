import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  AlertCircle, 
  Download, 
  Search, 
  Filter, 
  ChevronsUpDown, 
  Check, 
  FileSpreadsheet 
} from 'lucide-react';
import { PrecursorIndicator, AnalysisRun } from '../../types';
import { StatusIndicator } from '../common/StatusIndicator';
import { Button } from '../common/Button';
import { exportService } from '../../services/exportService';

export interface IndicatorTableProps {
  indicators: PrecursorIndicator[];
  analysisId?: string;
  analysis?: AnalysisRun;
  selectedIndicatorId?: string | null;
  onSelectIndicator?: (id: string | null) => void;
  categoryFilter?: string | null;
  onCategoryFilterChange?: (category: string | null) => void;
}

export const IndicatorTable: React.FC<IndicatorTableProps> = ({
  indicators,
  analysisId = 'ANL-AUDIT',
  analysis,
  selectedIndicatorId = null,
  onSelectIndicator,
  categoryFilter = null,
  onCategoryFilterChange
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    if (expandedIds.length === indicators.length) {
      setExpandedIds([]);
    } else {
      setExpandedIds(indicators.map(i => i.id));
    }
  };

  // Filter indicators based on search, category, and severity
  const filteredIndicators = useMemo(() => {
    return indicators.filter(ind => {
      // Category filter
      if (categoryFilter && ind.category !== categoryFilter) {
        return false;
      }

      // Severity filter
      if (severityFilter !== 'all' && ind.status !== severityFilter) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          ind.name.toLowerCase().includes(q) ||
          ind.categoryLabel.toLowerCase().includes(q) ||
          ind.observedEvidence.toLowerCase().includes(q) ||
          ind.interpretation.toLowerCase().includes(q) ||
          ind.id.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [indicators, categoryFilter, severityFilter, searchTerm]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (analysis) {
      exportService.exportAnalysisToCSV(analysis, {
        customFilename: `SIF_Indicators_${analysis.id}_${new Date().toISOString().slice(0, 10)}.csv`
      });
    } else {
      exportService.exportIndicatorsTableCSV(filteredIndicators, analysisId);
    }

    setExportNotice(`Exported ${filteredIndicators.length} indicators to CSV`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  const categories = [
    { key: 'all', label: 'All Domains' },
    { key: 'barrier_integrity', label: 'Barrier Integrity' },
    { key: 'energy_exposure', label: 'Energy Exposure' },
    { key: 'operational_drift', label: 'Operational Drift' },
    { key: 'pre_incident_conditions', label: 'Pre-Incident' },
    { key: 'systems_governance', label: 'Governance' }
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden transition-colors">
      {/* Header with Title and Prominent Export CSV action */}
      <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Precursor Indicators Breakdown
            </h4>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              ({filteredIndicators.length} of {indicators.length})
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Operational telemetry metrics, reference tolerance limits, delta variances, and verified evidence
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {exportNotice && (
            <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
              <Check size={12} />
              {exportNotice}
            </span>
          )}

          <Button
            size="sm"
            variant="secondary"
            icon={<FileSpreadsheet size={13} className="text-emerald-600 dark:text-emerald-400" />}
            onClick={handleExportCSV}
            title="Download formatted CSV report for spreadsheet analysis or Python pandas"
          >
            Export CSV
          </Button>

          <Button
            size="sm"
            variant="ghost"
            icon={<ChevronsUpDown size={13} />}
            onClick={handleExpandAll}
            title="Toggle expansion of all evidence rows"
          >
            {expandedIds.length === indicators.length ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={13} />
          <input
            type="text"
            placeholder="Search indicator name, evidence, or tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Domain Category Filter */}
          <select
            value={categoryFilter || 'all'}
            onChange={e => {
              const val = e.target.value === 'all' ? null : e.target.value;
              if (onCategoryFilterChange) onCategoryFilterChange(val);
            }}
            className="px-2.5 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 text-xs"
          >
            {categories.map(c => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200 text-xs"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical SIF</option>
            <option value="significant">Significant</option>
            <option value="elevated">Elevated</option>
            <option value="nominal">Nominal</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80">
              <th className="py-2.5 px-3.5 w-8" aria-label="Expand toggle"></th>
              <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200">Indicator Name</th>
              <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200">Category</th>
              <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200 text-right">Observed Value</th>
              <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200 text-right">Threshold</th>
              <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200 text-right">Variance Delta</th>
              <th className="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filteredIndicators.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100 text-xs">No indicators match current filter</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Try clearing your search query or domain filter.</p>
                </td>
              </tr>
            ) : (
              filteredIndicators.map(ind => {
                const isExpanded = expandedIds.includes(ind.id);
                const isBreached = ind.currentValue >= ind.threshold;
                const isSelected = selectedIndicatorId === ind.id;

                return (
                  <React.Fragment key={ind.id}>
                    <tr
                      onClick={() => {
                        toggleExpand(ind.id);
                        if (onSelectIndicator) {
                          onSelectIndicator(isSelected ? null : ind.id);
                        }
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-neutral-800 font-medium'
                          : 'hover:bg-neutral-50/60 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <td className="py-3 px-3.5 text-neutral-400 dark:text-neutral-500">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </td>
                      <td className="py-3 px-3.5 font-medium text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-center gap-1.5">
                          <span>{ind.name}</span>
                          {isBreached && (
                            <AlertCircle size={13} className="text-red-600 dark:text-red-400 shrink-0" aria-label="Threshold breached" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-neutral-600 dark:text-neutral-400">
                        {ind.categoryLabel}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono tabular-nums">
                        <span className={isBreached ? 'font-semibold text-red-700 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-100'}>
                          {ind.currentValue}
                        </span>{' '}
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{ind.unit}</span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                        {ind.threshold} <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{ind.unit}</span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono tabular-nums">
                        <span
                          className={
                            ind.historicalDeltaPct > 0
                              ? 'text-red-700 dark:text-red-400 font-medium'
                              : ind.historicalDeltaPct < 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-neutral-500 dark:text-neutral-400'
                          }
                        >
                          {ind.historicalDeltaPct > 0 ? `+${ind.historicalDeltaPct}%` : `${ind.historicalDeltaPct}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <StatusIndicator level={ind.status} />
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-neutral-50/80 dark:bg-neutral-950/80">
                        <td colSpan={7} className="py-3.5 px-6 border-b border-neutral-200 dark:border-neutral-800">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                                Observed Field Evidence
                              </span>
                              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-2.5 rounded border border-neutral-200 dark:border-neutral-800 font-sans">
                                {ind.observedEvidence}
                              </p>
                            </div>

                            <div>
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                                Operational Relevance
                              </span>
                              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-2.5 rounded border border-neutral-200 dark:border-neutral-800 font-sans">
                                {ind.relevance}
                              </p>
                            </div>

                            <div>
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                                Engineering Interpretation
                              </span>
                              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-2.5 rounded border border-neutral-200 dark:border-neutral-800 font-sans">
                                {ind.interpretation}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer bar with Export helper text */}
      <div className="px-5 py-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
        <span>Click on any indicator row to expand field telemetry evidence and operational reasoning.</span>
        <button
          onClick={handleExportCSV}
          className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium inline-flex items-center gap-1 underline"
        >
          <Download size={12} />
          Download active rows as CSV (.csv)
        </button>
      </div>
    </div>
  );
};
