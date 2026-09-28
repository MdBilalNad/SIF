import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { api } from '../services/api';
import { useTheme, Theme } from '../hooks/useTheme';
import { Moon, Sun, Laptop } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [density, setDensity] = useState<'standard' | 'compact'>('standard');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [defaultThreshold, setDefaultThreshold] = useState<number>(70);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [apiEndpoint, setApiEndpoint] = useState<string>(import.meta.env.VITE_API_BASE_URL || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all workstation analytical data back to default sample records?')) {
      api.resetToSampleData();
      alert('Local workstation dataset reset to default samples.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Workstation Settings</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Configure analytical parameters, display theme, data storage handling, and API connectivity.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Appearance & Theme Switcher */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Interface Theme & Appearance</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Select active workstation color system</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark' as Theme, label: 'Dark Theme', icon: <Moon size={16} />, desc: 'High contrast slate workstation canvas' },
              { id: 'light' as Theme, label: 'Light Theme', icon: <Sun size={16} />, desc: 'Calibrated off-white analytical paper canvas' },
              { id: 'system' as Theme, label: 'System Default', icon: <Laptop size={16} />, desc: 'Sync with operating system appearance' }
            ].map(item => {
              const isSelected = theme === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={`p-3.5 rounded border text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50/90 dark:bg-neutral-800/90 ring-1 ring-neutral-900 dark:ring-neutral-100'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 font-medium text-xs text-neutral-900 dark:text-neutral-100">
                      <span className="text-neutral-600 dark:text-neutral-300">{item.icon}</span>
                      {item.label}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">{item.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Display Density</label>
              <select
                value={density}
                onChange={e => setDensity(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200"
              >
                <option value="standard">Standard (40px row height)</option>
                <option value="compact">Compact (32px high-density)</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Measurement Unit System</label>
              <select
                value={unitSystem}
                onChange={e => setUnitSystem(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200"
              >
                <option value="metric">Metric (bar, °C, kg, km/h)</option>
                <option value="imperial">Imperial (psi, °F, lbs, mph)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Analysis Configuration Defaults */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Analysis Defaults</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Default boundaries for new analytical runs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Default Critical Trigger Threshold</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="90"
                  value={defaultThreshold}
                  onChange={e => setDefaultThreshold(parseInt(e.target.value))}
                  className="w-24 px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded font-mono"
                />
                <span className="text-neutral-500 dark:text-neutral-400">pts (standard 70)</span>
              </div>
            </div>

            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Preferred Export Format</label>
              <select
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded"
              >
                <option value="csv">Structured CSV (.csv)</option>
                <option value="json">Machine-Readable JSON (.json)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Data Handling & Storage */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Data Storage & Handling</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Local client persistence and data integrity management</p>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p>
              In client standalone workstation mode, ingested telemetry and analytical results are retained in local browser storage on your workstation. No data is dispatched to unauthorized third-party telemetry providers.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 dark:text-neutral-400">Reset Local Repository to Factory Samples:</span>
              <Button size="sm" variant="secondary" onClick={handleResetData}>
                Reset Sample Data
              </Button>
            </div>
          </div>
        </div>

        {/* Section 4: Backend API Integration Connection */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Backend API Connectivity</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Direct connection to enterprise SIF backend service endpoint
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-medium text-neutral-700 dark:text-neutral-300 block">VITE_API_BASE_URL</label>
            <input
              type="text"
              placeholder="e.g. https://api.enterprise.sif-engine.internal/v1"
              value={apiEndpoint}
              onChange={e => setApiEndpoint(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded font-mono text-xs placeholder-neutral-400 dark:placeholder-neutral-600"
            />
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Leave empty to run in zero-dependency client workstation simulation mode.
            </p>
          </div>
        </div>

        {/* Section 5: Account & Authentication Stub */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Authentication & Access Control</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Enterprise SSO / Identity Provider</p>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Standalone Mode</span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-xs text-neutral-600 dark:text-neutral-400">
            Account functionality is locked until an enterprise OAuth or LDAP authentication provider is connected.
          </div>
        </div>

        {/* Submit action */}
        <div className="flex items-center justify-between pt-4">
          {saveSuccess ? (
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Settings saved successfully.</span>
          ) : (
            <div />
          )}

          <Button type="submit" variant="primary" size="md">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
