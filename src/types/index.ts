/**
 * SIF Precursor Engine - Core Type Definitions
 * Serious Injury and Fatality (SIF) Precursor Analysis & Risk Intelligence
 */

export type SeverityLevel = 'nominal' | 'elevated' | 'significant' | 'critical';

export type AnalysisStatus = 
  | 'not_started' 
  | 'validating' 
  | 'preparing' 
  | 'evaluating' 
  | 'generating' 
  | 'complete' 
  | 'needs_attention' 
  | 'failed';

export type InputSourceType = 'file_upload' | 'sample_data' | 'manual_input';

export interface PrecursorIndicator {
  id: string;
  name: string;
  category: 'barrier_integrity' | 'energy_exposure' | 'operational_drift' | 'pre_incident_conditions' | 'systems_governance';
  categoryLabel: string;
  currentValue: number;
  threshold: number;
  unit: string;
  status: SeverityLevel;
  contributionPct: number;
  relevance: string;
  observedEvidence: string;
  interpretation: string;
  historicalDeltaPct: number; // e.g., +14.2% vs baseline
}

export interface AnalysisConfig {
  analysisType: 'sif_precursor_standard' | 'barrier_decay_focus' | 'high_energy_audit' | 'drift_variance';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  indicatorSet: string[]; // selected indicator IDs
  sensitivity: number; // 0.1 to 1.0 (default 0.75)
  criticalThreshold: number; // e.g. 70
  metadata: {
    facilityOrSite?: string;
    operatingUnit?: string;
    analystId?: string;
    notes?: string;
  };
}

export interface MetricTimeSeriesPoint {
  timestamp: string;
  label: string;
  precursorScore: number;
  barrierIntegrityScore: number;
  energyExposureScore: number;
  threshold: number;
}

export interface DistributionPoint {
  range: string;
  observedCount: number;
  expectedBaseline: number;
}

export interface AnalysisResult {
  compositeScore: number; // 0 - 100
  classification: 'Nominal' | 'Low Precursor Density' | 'Elevated Precursor Risk' | 'Significant Precursor Threat' | 'Critical SIF Potential';
  severityLevel: SeverityLevel;
  confidenceScore?: number; // only when method mathematically provides it
  thresholdMet: boolean;
  activePrecursorsCount: number;
  totalIndicatorsEvaluated: number;
  criticalBarriersDegraded: number;
  indicators: PrecursorIndicator[];
  primaryContributors: {
    indicatorId: string;
    name: string;
    weightPct: number;
    severity: SeverityLevel;
    impactSummary: string;
  }[];
  explanation: {
    summary: string;
    observedEvidence: string[];
    criticalFailures: string[];
    systemicPreconditions: string[];
    recommendedMitigations: string[];
  };
  timeSeriesData: MetricTimeSeriesPoint[];
  distributionData: DistributionPoint[];
}

export interface AnalysisRun {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceType: InputSourceType;
  sourceFileName?: string;
  sourceFileSize?: number;
  recordsCount: number;
  status: AnalysisStatus;
  engineVersion: string;
  config: AnalysisConfig;
  result?: AnalysisResult;
  errorMessage?: string;
}

export interface IndicatorDefinition {
  id: string;
  name: string;
  category: 'barrier_integrity' | 'energy_exposure' | 'operational_drift' | 'pre_incident_conditions' | 'systems_governance';
  categoryLabel: string;
  unit: string;
  defaultThreshold: number;
  description: string;
  formulaDescription: string;
  referenceStandard: string;
}

export interface MethodologySection {
  id: string;
  title: string;
  summary: string;
  content: string;
  equations?: {
    name: string;
    latexOrAscii: string;
    description: string;
  }[];
  notes?: string[];
}
