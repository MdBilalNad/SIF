import React, { useState } from 'react';
import { METHODOLOGY_SECTIONS, SYSTEM_INDICATOR_DEFINITIONS } from '../data/mockData';

export const MethodologyPage: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Analytical Methodology & Framework
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-3xl leading-relaxed">
          Technical specifications, mathematical formulas, precursor indicators taxonomy, and operational boundaries governing the SIF Precursor Engine.
        </p>

        {/* 4-tier data distinction callout */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">1. Observed Data</span>
            <span className="text-neutral-500 dark:text-neutral-400 mt-0.5 block">Direct logs, permit records, sensor telemetry.</span>
          </div>
          <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">2. Derived Indicators</span>
            <span className="text-neutral-500 dark:text-neutral-400 mt-0.5 block">Dimensionless rates and barrier decay factors.</span>
          </div>
          <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">3. Model Output</span>
            <span className="text-neutral-500 dark:text-neutral-400 mt-0.5 block">Composite Precursor Index (P_I) and vector ranks.</span>
          </div>
          <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded transition-colors">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">4. Interpretation</span>
            <span className="text-neutral-500 dark:text-neutral-400 mt-0.5 block">Operational risk context and mitigation guidance.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Table of contents sidebar */}
        <div className="md:col-span-1 space-y-1">
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block px-2 mb-2">
            Methodology Index
          </span>
          {METHODOLOGY_SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSectionId(sec.id);
                document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                activeSectionId === sec.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              {sec.title}
            </button>
          ))}
          <button
            onClick={() => {
              setActiveSectionId('indicator_catalog');
              document.getElementById('indicator_catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
              activeSectionId === 'indicator_catalog'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            9. Full Indicator Catalog
          </button>
        </div>

        {/* Content stream */}
        <div className="md:col-span-3 space-y-10">
          {METHODOLOGY_SECTIONS.map(sec => (
            <div
              key={sec.id}
              id={sec.id}
              className="scroll-mt-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-4 transition-colors"
            >
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {sec.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{sec.summary}</p>
              </div>

              <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line font-sans border-t border-neutral-100 dark:border-neutral-800 pt-3">
                {sec.content}
              </div>

              {sec.equations && sec.equations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Mathematical Formulation:
                  </span>
                  {sec.equations.map((eq, eqIdx) => (
                    <div
                      key={eqIdx}
                      className="p-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-1.5"
                    >
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">{eq.name}</span>
                      <div className="font-mono text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 p-2.5 rounded border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
                        {eq.latexOrAscii}
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{eq.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {sec.notes && sec.notes.length > 0 && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border-l-2 border-neutral-800 dark:border-neutral-200 text-[11px] text-neutral-700 dark:text-neutral-300 space-y-1">
                  {sec.notes.map((note, nIdx) => (
                    <p key={nIdx}>{note}</p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Catalog Section */}
          <div
            id="indicator_catalog"
            className="scroll-mt-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-4 transition-colors"
          >
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                9. Full Indicator Catalog & Reference Benchmarks
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Standard baseline indicators parameterized inside the core evaluation model
              </p>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-neutral-200 dark:border-neutral-800">
              {SYSTEM_INDICATOR_DEFINITIONS.map(ind => (
                <div key={ind.id} className="py-4 space-y-1.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{ind.name}</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400 tabular-nums">
                      Threshold: <strong className="text-neutral-900 dark:text-neutral-100">{ind.defaultThreshold}</strong> {ind.unit}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{ind.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono pt-1">
                    <span>Category: {ind.categoryLabel}</span>
                    <span>·</span>
                    <span>Standard: {ind.referenceStandard}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
