import React, { useState } from 'react';
import { Sidebar, NavRoute } from './Sidebar';
import { TopBar } from './TopBar';

export interface AppLayoutProps {
  currentRoute: NavRoute;
  activeAnalysisTitle?: string;
  onNavigate: (route: NavRoute, id?: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentRoute,
  activeAnalysisTitle,
  onNavigate,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex transition-colors">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar
          currentRoute={currentRoute}
          activeAnalysisTitle={activeAnalysisTitle}
          onNavigate={onNavigate}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
