import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Terms and Conditions</h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-1">
          Last Updated: September 2026 · Software Usage Agreement
        </p>
      </div>

      <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded text-xs text-amber-900 dark:text-amber-200">
        <strong>Legal Notice:</strong> This document outlines terms of use for the SIF Precursor Engine analytical software interface. This text serves as an engineering template and does not constitute formal legal counsel. Formalize with qualified enterprise legal counsel before commercial deployment.
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-6 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans transition-colors">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">1. Acceptance of Terms</h3>
          <p>
            By accessing or operating the SIF Precursor Engine ("Application"), you agree to be bound by these Terms and Conditions. If you do not accept these terms in their entirety, you must discontinue use of the interface immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">2. Service Description</h3>
          <p>
            The Application is an analytical software interface engineered to compute precursor indicator metrics, evaluate safety barrier degradation, and present structured risk assessments based on ingested operational records.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">3. User Responsibilities & Data Accuracy</h3>
          <p>
            The analytical outputs produced by the Application depend directly upon the authenticity, timeliness, and calibration accuracy of user-submitted data. The user represents that all submitted operational logs and telemetry records have been validated according to sound engineering practices.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">4. Acceptable Use</h3>
          <p>
            Users agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>Submit intentionally falsified maintenance or inspection records.</li>
            <li>Attempt to reverse engineer or circumvent algorithmic validation routines.</li>
            <li>Rely exclusively upon automated model outputs without licensed professional engineering review during live plant operations.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">5. Intellectual Property</h3>
          <p>
            The visual workstation layout, mathematical models, indicator taxonomies, and software design of the Application constitute proprietary intellectual property of [Deploying Organization / Developer]. User datasets remain the sole property of their respective owners.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">6. Service Limitations & Operational Decision-Support</h3>
          <p>
            The SIF Precursor Engine is designed strictly as a decision-support workstation. It does not replace certified field safety inspections, physical process hazard analyses (HAZOP/LOPA), or mandatory regulatory compliance mandates. High Precursor Indexes indicate statistical vulnerability, not a guaranteed prediction of incident timing.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">7. Disclaimer of Warranties</h3>
          <p>
            THE APPLICATION IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR INDUSTRIAL PURPOSE, OR ZERO-DEFECT OPERATION.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">8. Limitation of Liability</h3>
          <p>
            UNDER NO CIRCUMSTANCES SHALL THE AUTHORS, OPERATORS, OR LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING PLANT SHUTDOWN COSTS, EQUIPMENT REPAIR, OR REGULATORY FINES) ARISING OUT OF OR IN CONNECTION WITH THE USE OR INABILITY TO USE THE APPLICATION.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">9. Contact Information</h3>
          <p>
            Inquiries regarding software licensing or contractual terms should be directed to:
          </p>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
            Legal Inquiries: [Legal Counsel Department]<br />
            Address: [Enterprise Headquarters Physical Address]<br />
            Email: [legal@enterprise-domain.internal]
          </div>
        </section>
      </div>
    </div>
  );
};
