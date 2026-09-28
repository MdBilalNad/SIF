/**
 * SIF Precursor Engine - Data Export Utility Service
 * Provides RFC-4180 compliant CSV serialization, UTF-8 BOM encoding for Excel/Sheets compatibility,
 * and structured JSON data export utilities for downstream local analysis.
 */

import { AnalysisRun, PrecursorIndicator } from '../types';

export interface CSVExportOptions {
  includeMetadata?: boolean;
  includeTimeSeries?: boolean;
  includeEvidence?: boolean;
  customFilename?: string;
}

/**
 * Escapes fields to meet RFC-4180 CSV standard
 */
function escapeCSVField(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Trigger file download via temporary anchor element
 */
function triggerBrowserDownload(content: string, filename: string, mimeType: string): void {
  // UTF-8 BOM ensures proper Unicode character encoding across Microsoft Excel, Sheets, and pandas
  const blob = new Blob(['\uFEFF' + content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const exportService = {
  /**
   * Export complete comprehensive analysis run as structured CSV
   */
  exportAnalysisToCSV(analysis: AnalysisRun, options: CSVExportOptions = {}): void {
    if (!analysis.result) return;
    const { result, config } = analysis;
    const lines: string[] = [];

    // Header metadata block
    if (options.includeMetadata !== false) {
      lines.push(['# SIF PRECURSOR ENGINE — ANALYTICAL AUDIT REPORT'].map(escapeCSVField).join(','));
      lines.push(['# Engine Specification', analysis.engineVersion].map(escapeCSVField).join(','));
      lines.push(['# Analysis ID', analysis.id].map(escapeCSVField).join(','));
      lines.push(['# Audit Title', analysis.title].map(escapeCSVField).join(','));
      lines.push(['# Evaluation Date (UTC)', analysis.createdAt].map(escapeCSVField).join(','));
      lines.push(['# Operating Facility', config.metadata.facilityOrSite || 'Unspecified'].map(escapeCSVField).join(','));
      lines.push(['# Target Process Unit', config.metadata.operatingUnit || 'Unspecified'].map(escapeCSVField).join(','));
      lines.push(['# Ingested Dataset Source', analysis.sourceFileName || 'Direct stream'].map(escapeCSVField).join(','));
      lines.push(['# Ingested Record Volume', analysis.recordsCount].map(escapeCSVField).join(','));
      lines.push(['# Evaluation Method', config.analysisType].map(escapeCSVField).join(','));
      lines.push(['# Sensitivity Setting', `${(config.sensitivity * 100).toFixed(0)}%`].map(escapeCSVField).join(','));
      lines.push(['# Critical Trigger Threshold', config.criticalThreshold].map(escapeCSVField).join(','));
      lines.push(['# OVERALL CLASSIFICATION', result.classification].map(escapeCSVField).join(','));
      lines.push(['# COMPOSITE PRECURSOR INDEX (P_I)', result.compositeScore].map(escapeCSVField).join(','));
      lines.push(['# DEGRADED CRITICAL BARRIERS', `${result.criticalBarriersDegraded} of ${result.totalIndicatorsEvaluated}`].map(escapeCSVField).join(','));
      lines.push(['# EMPIRICAL CONFIDENCE SCORE', result.confidenceScore ? `${(result.confidenceScore * 100).toFixed(1)}%` : 'N/A'].map(escapeCSVField).join(','));
      lines.push(''); // blank separator
    }

    // Section 1: Precursor Indicators Table
    lines.push(['--- PRECURSOR INDICATOR MATRIX ---'].map(escapeCSVField).join(','));
    const indicatorHeaders = [
      'Indicator ID',
      'Indicator Name',
      'Domain Category',
      'Observed Value',
      'Unit',
      'Benchmark Threshold',
      'Variance Delta (%)',
      'Severity Status',
      'Weight Contribution (%)',
      'Threshold Breached (True/False)'
    ];

    if (options.includeEvidence !== false) {
      indicatorHeaders.push('Observed Field Evidence', 'Operational Relevance', 'Engineering Interpretation');
    }

    lines.push(indicatorHeaders.map(escapeCSVField).join(','));

    result.indicators.forEach(ind => {
      const isBreached = ind.currentValue >= ind.threshold;
      const row = [
        ind.id,
        ind.name,
        ind.categoryLabel,
        ind.currentValue,
        ind.unit,
        ind.threshold,
        ind.historicalDeltaPct > 0 ? `+${ind.historicalDeltaPct}%` : `${ind.historicalDeltaPct}%`,
        ind.status.toUpperCase(),
        ind.contributionPct,
        isBreached ? 'TRUE' : 'FALSE'
      ];

      if (options.includeEvidence !== false) {
        row.push(ind.observedEvidence, ind.relevance, ind.interpretation);
      }

      lines.push(row.map(escapeCSVField).join(','));
    });

    lines.push(''); // blank separator

    // Section 2: Longitudinal Time Series Data
    if (options.includeTimeSeries !== false && result.timeSeriesData && result.timeSeriesData.length > 0) {
      lines.push(['--- LONGITUDINAL TRAJECTORY DATA ---'].map(escapeCSVField).join(','));
      lines.push(['Period Label', 'Timestamp', 'Composite Precursor Score', 'Barrier Decay Score', 'Energy Exposure Score', 'Trigger Threshold'].map(escapeCSVField).join(','));
      result.timeSeriesData.forEach(pt => {
        lines.push([
          pt.label,
          pt.timestamp,
          pt.precursorScore,
          pt.barrierIntegrityScore,
          pt.energyExposureScore,
          pt.threshold
        ].map(escapeCSVField).join(','));
      });
      lines.push('');
    }

    // Section 3: Distribution Variance Summary
    if (result.distributionData && result.distributionData.length > 0) {
      lines.push(['--- PRECURSOR RISK DISTRIBUTION ---'].map(escapeCSVField).join(','));
      lines.push(['Score Range Band', 'Observed Incident Frequency', 'Standard Industry Baseline'].map(escapeCSVField).join(','));
      result.distributionData.forEach(d => {
        lines.push([d.range, d.observedCount, d.expectedBaseline].map(escapeCSVField).join(','));
      });
    }

    const csvContent = lines.join('\r\n');
    const safeDate = new Date(analysis.createdAt).toISOString().split('T')[0];
    const filename = options.customFilename || `SIF_Precursor_${analysis.id}_${safeDate}.csv`;

    triggerBrowserDownload(csvContent, filename, 'text/csv');
  },

  /**
   * Export only the active indicator table rows (e.g. from the Results table component)
   */
  exportIndicatorsTableCSV(indicators: PrecursorIndicator[], analysisId: string): void {
    const lines: string[] = [];

    lines.push(['Indicator ID', 'Name', 'Category', 'Observed Value', 'Unit', 'Threshold', 'Delta (%)', 'Status', 'Weight (%)', 'Observed Evidence', 'Engineering Interpretation'].map(escapeCSVField).join(','));

    indicators.forEach(ind => {
      lines.push([
        ind.id,
        ind.name,
        ind.categoryLabel,
        ind.currentValue,
        ind.unit,
        ind.threshold,
        ind.historicalDeltaPct > 0 ? `+${ind.historicalDeltaPct}%` : `${ind.historicalDeltaPct}%`,
        ind.status.toUpperCase(),
        ind.contributionPct,
        ind.observedEvidence,
        ind.interpretation
      ].map(escapeCSVField).join(','));
    });

    const csvContent = lines.join('\r\n');
    const filename = `SIF_Indicators_${analysisId}_${new Date().toISOString().slice(0, 10)}.csv`;

    triggerBrowserDownload(csvContent, filename, 'text/csv');
  },

  /**
   * Export entire analysis as JSON
   */
  exportAnalysisToJSON(analysis: AnalysisRun): void {
    const jsonStr = JSON.stringify(analysis, null, 2);
    const safeDate = new Date(analysis.createdAt).toISOString().split('T')[0];
    const filename = `SIF_Precursor_${analysis.id}_${safeDate}.json`;
    triggerBrowserDownload(jsonStr, filename, 'application/json');
  }
};
