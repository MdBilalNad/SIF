import React from 'react';
import { Button } from '../components/common/Button';
import { ArrowRight, BookOpen, ShieldAlert } from 'lucide-react';

export interface LandingPageProps {
  onStart: () => void;
  onViewMethodology: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onViewMethodology
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-10 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 rounded flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <span className="text-xs font-mono tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Analytical Workstation
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          SIF Precursor Engine
        </h1>

        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Structured analysis of precursor indicators from your submitted data.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            size="md"
            variant="primary"
            onClick={onStart}
            icon={<ArrowRight size={14} />}
          >
            Start Analysis
          </Button>

          <Button
            size="md"
            variant="secondary"
            onClick={onViewMethodology}
            icon={<BookOpen size={14} />}
          >
            View Methodology
          </Button>
        </div>
      </div>

      {/* Section 1: What the engine evaluates */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          What the Engine Evaluates
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
          Traditional metrics measure injury consequences after the fact. SIF Precursor Engine evaluates the systemic pre-conditions that precede fatal and high-severity outcomes before a line of defense collapses.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-2 transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Critical Barrier Integrity</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Monitors safety relief valve drift, unauthorized bypass hours, and physical interlock defeat rates.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-2 transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Uncontrolled Energy Exposure</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Analyzes work performed inside the line of fire of pressurized, electrical, chemical, or suspended loads.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-2 transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Operational Drift & Handover</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Detects procedural variance, safety maintenance backlogs, and shift handover discrepancy frequencies.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: How the analysis works */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          How the Analysis Works
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
          The processing pipeline operates deterministically across five verified stages:
        </p>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-5 space-y-3 text-xs transition-colors">
          <div className="flex items-start gap-3">
            <span className="font-mono text-neutral-400 dark:text-neutral-500 font-bold shrink-0">01</span>
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-medium">Input Ingestion & Schema Validation:</strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">Verifies timestamps, operating unit boundaries, and hazard event tags from CSV, XLSX, or JSON.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-neutral-400 dark:text-neutral-500 font-bold shrink-0">02</span>
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-medium">Rate Normalization:</strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">Translates raw counts into dimensionless rates per 10,000 running hours or standard tolerance percentages.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-neutral-400 dark:text-neutral-500 font-bold shrink-0">03</span>
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-medium">Benchmark Comparison:</strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">Compares observed rates against engineering thresholds (API, IEC, ASSP standards).</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-neutral-400 dark:text-neutral-500 font-bold shrink-0">04</span>
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-medium">Non-Linear Synthesis:</strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">Calculates Composite Precursor Index (P_I) heavily penalizing simultaneous barrier erosion.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-neutral-400 dark:text-neutral-500 font-bold shrink-0">05</span>
            <div>
              <strong className="text-neutral-900 dark:text-neutral-100 font-medium">Structured Reporting:</strong>{' '}
              <span className="text-neutral-600 dark:text-neutral-400">Outputs evidence citations, barrier failure vectors, and actionable engineering mitigations.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What an analytical result contains */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          What a Result Contains
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-1.5 transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Quantitative Composite Score</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Standardized 0-100 Precursor Index with statistical confidence intervals and explicit classification bands.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-1.5 transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Evidence-Grounding Panel</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Cites exact sensor tags, valve test drift percentages, and work order records triggering the warning.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-1.5 transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Longitudinal Trend Analysis</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Time series visualization illustrating safeguard decay trajectories against critical trigger limits.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-1.5 transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Engineering Mitigations</span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Recommended immediate physical and administrative controls to restore barrier defense margins.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Operational Limitations */}
      <section className="p-4 bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 transition-colors">
        <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Operational Boundaries & Limitations:</span>
        <p className="leading-relaxed">
          The SIF Precursor Engine is a decision-support workstation designed to augment licensed professional engineering review. High precursor scores indicate elevated statistical vulnerability and barrier erosion; they do not predict the exact moment of failure. Always verify physical plant conditions prior to executing process modifications.
        </p>
      </section>
    </div>
  );
};
