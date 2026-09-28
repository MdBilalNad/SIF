import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Privacy Policy</h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-1">
          Effective Date: September 2026 · SIF Precursor Engine Operational Notice
        </p>
      </div>

      <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded text-xs text-amber-900 dark:text-amber-200">
        <strong>Notice to Deployers:</strong> The following privacy policy describes the data handling mechanisms of the SIF Precursor Engine frontend application. Bracketed items such as [Legal Entity Name] are placeholders requiring customization prior to enterprise production deployment.
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-6 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans transition-colors">
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">1. Information Collected</h3>
          <p>
            The SIF Precursor Engine is an industrial analytics workstation. It processes operational records, sensor telemetry, permit-to-work logs, and safety critical element inspection audits submitted directly by users or ingested from corporate systems. In standalone mode, files processed via the frontend client are parsed locally within the browser session and are not transmitted to external telemetry endpoints.
          </p>
          <p>
            Technical session data collected is strictly limited to browser environment parameters required for interface rendering and error diagnosis.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">2. How Information is Used</h3>
          <p>
            Submitted dataset records are utilized solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
            <li>Calculate precursor indicator metrics and evaluate safety barrier degradation.</li>
            <li>Compute composite precursor indexes and classification tiers.</li>
            <li>Generate structured analytical reports and exportable artifacts (CSV, JSON).</li>
          </ul>
          <p>Data is never repurposed for marketing or commercial profiling.</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">3. Data Storage</h3>
          <p>
            Client workstation storage utilizes HTML5 LocalStorage for session persistence. When connected to a backend via <code>VITE_API_BASE_URL</code>, records are stored in accordance with the host enterprise’s authenticated database specifications.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">4. Data Retention</h3>
          <p>
            In standalone mode, data remains in the client’s local browser storage until explicitly cleared by the user via the Workstation Settings interface or browser history purge. Enterprise backend deployments are subject to the data retention schedules defined by [Deploying Organization / Facility Operator].
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">5. Third-Party Services</h3>
          <p>
            The core application contains zero third-party advertising scripts, tracker beacons, or external telemetry libraries. Typography assets are loaded via standard font CDNs with minimal request headers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">6. Security</h3>
          <p>
            No confidential secrets, database credentials, or private API keys are embedded within the client-side code bundle. All external communications require secure TLS/HTTPS transport when an external API endpoint is configured.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">7. User Rights</h3>
          <p>
            Users retain full control over datasets loaded into their workstation session. Users may delete individual analysis records or clear the entire workstation repository at any time via the Analysis History or Settings pages.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">8. Contact Information</h3>
          <p>
            For privacy inquiries or technical auditing regarding the SIF Precursor Engine implementation, please direct requests to:
          </p>
          <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
            Designated Contact: [Data Protection Officer / EHS Systems Administrator]<br />
            Organization: [Insert Enterprise Name]<br />
            Email: [compliance@enterprise-domain.internal]
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">9. Policy Updates</h3>
          <p>
            This policy may be amended to reflect modifications in regulatory standards or system architecture. Changes take effect immediately upon deployment to the application host.
          </p>
        </section>
      </div>
    </div>
  );
};
