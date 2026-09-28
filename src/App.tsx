import React, { useState, useEffect } from 'react';
import { AnalysisRun } from './types';
import { api } from './services/api';
import { AppLayout } from './components/layout/AppLayout';
import { NavRoute } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { DataPage } from './pages/DataPage';
import { NewAnalysisPage } from './pages/NewAnalysisPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { LandingPage } from './pages/LandingPage';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

import { ThemeProvider } from './hooks/useTheme';

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard');
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync route from browser pathname on initial load
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/analysis/new') {
      setCurrentRoute('analysis_new');
    } else if (path.startsWith('/analysis/')) {
      const id = path.replace('/analysis/', '');
      if (id) {
        setActiveAnalysisId(id);
        setCurrentRoute('results');
      }
    } else if (path === '/history') {
      setCurrentRoute('history');
    } else if (path === '/data') {
      setCurrentRoute('data');
    } else if (path === '/methodology') {
      setCurrentRoute('methodology');
    } else if (path === '/settings') {
      setCurrentRoute('settings');
    } else if (path === '/privacy') {
      setCurrentRoute('privacy');
    } else if (path === '/terms') {
      setCurrentRoute('terms');
    } else if (path === '/' || path === '/dashboard') {
      setCurrentRoute('dashboard');
    }
  }, []);

  // Update browser document title based on route
  useEffect(() => {
    let title = 'SIF Precursor Engine';
    switch (currentRoute) {
      case 'dashboard':
        title = 'SIF Precursor Engine | Dashboard';
        break;
      case 'data':
        title = 'SIF Precursor Engine | Data & Visualizations';
        break;
      case 'analysis_new':
        title = 'SIF Precursor Engine | New Analysis';
        break;
      case 'results':
        title = activeAnalysisId
          ? `SIF Precursor Engine | ${activeAnalysisId}`
          : 'SIF Precursor Engine | Results';
        break;
      case 'history':
        title = 'SIF Precursor Engine | History';
        break;
      case 'methodology':
        title = 'SIF Precursor Engine | Methodology';
        break;
      case 'settings':
        title = 'SIF Precursor Engine | Settings';
        break;
      case 'privacy':
        title = 'SIF Precursor Engine | Privacy';
        break;
      case 'terms':
        title = 'SIF Precursor Engine | Terms';
        break;
    }
    document.title = title;
  }, [currentRoute, activeAnalysisId]);

  // Load analytical runs from local repository
  const loadAnalyses = async () => {
    try {
      const data = await api.getAnalysisHistory();
      setAnalyses(data);
      if (!activeAnalysisId && data.length > 0) {
        setActiveAnalysisId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load analyses', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, []);

  // Handle client navigation
  const handleNavigate = (route: NavRoute, id?: string) => {
    setCurrentRoute(route);
    if (id) {
      setActiveAnalysisId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser history state
    let targetPath = '/dashboard';
    if (route === 'analysis_new') targetPath = '/analysis/new';
    else if (route === 'data') targetPath = '/data';
    else if (route === 'results' && id) targetPath = `/analysis/${id}`;
    else if (route === 'history') targetPath = '/history';
    else if (route === 'methodology') targetPath = '/methodology';
    else if (route === 'settings') targetPath = '/settings';
    else if (route === 'privacy') targetPath = '/privacy';
    else if (route === 'terms') targetPath = '/terms';

    window.history.pushState({}, '', targetPath);
  };

  const handleAnalysisCreated = (newId: string) => {
    loadAnalyses();
    setActiveAnalysisId(newId);
    handleNavigate('results', newId);
  };

  const activeAnalysis = analyses.find(a => a.id === activeAnalysisId) || (analyses.length > 0 ? analyses[0] : null);

  return (
    <AppLayout
      currentRoute={currentRoute}
      activeAnalysisTitle={activeAnalysis?.title}
      onNavigate={handleNavigate}
    >
      {isLoading ? (
        <div className="space-y-6 max-w-4xl mx-auto py-8">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="table" rows={5} />
        </div>
      ) : (
        <>
          {currentRoute === 'dashboard' && (
            <DashboardPage
              analyses={analyses}
              onNavigate={handleNavigate}
              onRefresh={loadAnalyses}
            />
          )}

          {currentRoute === 'data' && (
            <DataPage
              analyses={analyses}
              selectedAnalysisId={activeAnalysisId}
              onSelectAnalysis={setActiveAnalysisId}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'analysis_new' && (
            <NewAnalysisPage
              onAnalysisCreated={handleAnalysisCreated}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'results' && (
            <ResultsPage
              analysis={activeAnalysis}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'history' && (
            <HistoryPage
              analyses={analyses}
              onNavigate={handleNavigate}
              onRefresh={loadAnalyses}
            />
          )}

          {currentRoute === 'methodology' && <MethodologyPage />}

          {currentRoute === 'settings' && <SettingsPage />}

          {currentRoute === 'privacy' && <PrivacyPage />}

          {currentRoute === 'terms' && <TermsPage />}
        </>
      )}
    </AppLayout>
  );
}
