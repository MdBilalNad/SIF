import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BookOpen, 
  Settings, 
  ShieldAlert,
  Moon,
  Sun,
  X,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export type NavRoute = 'dashboard' | 'analysis_new' | 'data' | 'history' | 'methodology' | 'settings' | 'privacy' | 'terms' | 'results';

export interface SidebarProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute, id?: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isOpen,
  onToggle
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  const navItems = [
    { route: 'dashboard' as NavRoute, label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { route: 'data' as NavRoute, label: 'Data', icon: <BarChart3 size={16} /> },
    { route: 'analysis_new' as NavRoute, label: 'New Analysis', icon: <PlusCircle size={16} /> },
    { route: 'history' as NavRoute, label: 'Analysis History', icon: <History size={16} /> },
    { route: 'methodology' as NavRoute, label: 'Methodology', icon: <BookOpen size={16} /> },
    { route: 'settings' as NavRoute, label: 'Settings', icon: <Settings size={16} /> }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/70 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-7 h-7 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 rounded flex items-center justify-center shrink-0">
              <ShieldAlert size={16} />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 tracking-tight leading-none">
                SIF <span className="font-normal text-xs text-neutral-500 dark:text-neutral-400">ENGINE</span>
              </div>
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tracking-wider mt-0.5">
                PRECURSOR v2.4
              </div>
            </div>
          </button>

          <button
            onClick={onToggle}
            className="p-1 rounded text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-2 pb-2 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Workstation
          </div>

          {navItems.map(item => {
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors text-left select-none ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <span className={isActive ? 'text-white dark:text-neutral-950' : 'text-neutral-500 dark:text-neutral-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2 bg-neutral-50/50 dark:bg-neutral-950/50 text-xs">
          {/* Engine Status indicator & Theme Toggle */}
          <div className="px-2 py-1.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">Theme:</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun size={12} className="text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Moon size={12} className="text-neutral-600" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between px-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <button
              onClick={() => {
                onNavigate('privacy');
                if (window.innerWidth < 1024) onToggle();
              }}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 hover:underline"
            >
              Privacy Policy
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <button
              onClick={() => {
                onNavigate('terms');
                if (window.innerWidth < 1024) onToggle();
              }}
              className="hover:text-neutral-900 dark:hover:text-neutral-200 hover:underline"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
