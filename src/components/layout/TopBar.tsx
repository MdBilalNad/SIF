import React from 'react';
import { Menu, Plus, Settings, ChevronRight, Moon, Sun } from 'lucide-react';
import { Button } from '../common/Button';
import { NavRoute } from './Sidebar';
import { useTheme } from '../../hooks/useTheme';

export interface TopBarProps {
  currentRoute: NavRoute;
  activeAnalysisTitle?: string;
  onNavigate: (route: NavRoute) => void;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  activeAnalysisTitle,
  onNavigate,
  onToggleSidebar
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  const getPageDetails = () => {
    switch (currentRoute) {
      case 'dashboard':
        return { title: 'Overview', breadcrumb: 'SIF Precursor Engine' };
      case 'data':
        return { title: 'Data & Visualizations', breadcrumb: 'Analytics Station' };
      case 'analysis_new':
        return { title: 'New Analysis', breadcrumb: 'Analysis Workspace' };
      case 'history':
        return { title: 'Analysis History', breadcrumb: 'Repository' };
      case 'results':
        return { title: activeAnalysisTitle || 'Analysis Results', breadcrumb: 'Analytical Report' };
      case 'methodology':
        return { title: 'Methodology Documentation', breadcrumb: 'Standards & Formulas' };
      case 'settings':
        return { title: 'Settings', breadcrumb: 'System Configuration' };
      case 'privacy':
        return { title: 'Privacy Policy', breadcrumb: 'Legal & Compliance' };
      case 'terms':
        return { title: 'Terms & Conditions', breadcrumb: 'Legal & Compliance' };
      default:
        return { title: 'Workstation', breadcrumb: 'Engine' };
    }
  };

  const { title, breadcrumb } = getPageDetails();

  return (
    <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline">{breadcrumb}</span>
          <ChevronRight size={12} className="text-neutral-300 dark:text-neutral-600 hidden sm:inline" />
          <h1 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm tracking-tight truncate max-w-xs sm:max-w-md">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Workstation engine mode */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          <span>Core Engine Active</span>
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors flex items-center justify-center"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-neutral-600" />
          )}
        </button>

        {currentRoute !== 'analysis_new' && (
          <Button
            size="sm"
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => onNavigate('analysis_new')}
          >
            New Analysis
          </Button>
        )}

        <button
          onClick={() => onNavigate('settings')}
          className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          aria-label="System Settings"
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
