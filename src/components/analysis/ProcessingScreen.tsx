import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

export interface ProcessingScreenProps {
  onComplete: () => void;
  title?: string;
}

const STAGES = [
  { id: 1, label: '1. Validating input data and timestamp schema' },
  { id: 2, label: '2. Preparing and normalizing operational rates' },
  { id: 3, label: '3. Evaluating precursor indicators against engineering thresholds' },
  { id: 4, label: '4. Generating multi-vector composite precursor score' },
  { id: 5, label: '5. Finalizing analytical report and evidence citations' }
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  onComplete,
  title = 'Analysis in progress'
}) => {
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < STAGES.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 850);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="max-w-xl mx-auto my-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-8 shadow-xs transition-colors">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">{title}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Evaluating precursor indicators and verifying barrier integrity parameters.
        </p>
      </div>

      <div className="space-y-4">
        {STAGES.map(stage => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 p-3 rounded text-xs transition-colors ${
                isCurrent
                  ? 'bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-medium text-neutral-900 dark:text-neutral-100'
                  : isDone
                  ? 'text-neutral-700 dark:text-neutral-300 font-normal'
                  : 'text-neutral-400 dark:text-neutral-600 opacity-60'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] ${
                  isDone
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white'
                    : isCurrent
                    ? 'border-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100'
                    : 'border border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {isDone ? <Check size={12} strokeWidth={2.5} /> : stage.id}
              </div>

              <span className="flex-1 truncate">{stage.label}</span>

              {isCurrent && (
                <span className="w-3.5 h-3.5 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
        <span>Deterministic evaluation pipeline</span>
        <span>Stage {Math.min(currentStage, STAGES.length)} of {STAGES.length}</span>
      </div>
    </div>
  );
};
