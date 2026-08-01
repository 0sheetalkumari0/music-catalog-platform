import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import AuthDialog from './components/AuthDialog';
import CatalogSearch from './components/CatalogSearch';
import LibraryManager from './components/LibraryManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CatalogInsights from './components/CatalogInsights';
import { authService, libraryService } from './services';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [library, setLibrary] = useState([]);
  const [savedCatalogIds, setSavedCatalogIds] = useState(new Set());

  useEffect(() => {
    if (user.token) {
      loadLibrary();
    } else {
      setLibrary([]);
      setSavedCatalogIds(new Set());
    }
  }, [user.token]);

  const loadLibrary = async () => {
    try {
      const data = await libraryService.getLibrary();
      setLibrary(data || []);
      const ids = new Set((data || []).map((a) => a.appleCatalogId));
      setSavedCatalogIds(ids);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleAuthSuccess = () => {
    const current = authService.getCurrentUser();
    setUser(current);
  };

  const handleLogout = () => {
    authService.logout();
    setUser({ token: null, username: null });
    setLibrary([]);
    setSavedCatalogIds(new Set());
  };

  const handleAlbumSaved = (appleCatalogId) => {
    setSavedCatalogIds((prev) => new Set(prev).add(appleCatalogId));
    loadLibrary();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <div>
        <HeaderNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          libraryCount={library.length}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'search' && (
            <CatalogSearch
              savedCatalogIds={savedCatalogIds}
              onAlbumSaved={handleAlbumSaved}
              onOpenAuth={() => setIsAuthOpen(true)}
              isAuthenticated={!!user.token}
            />
          )}

          {activeTab === 'library' && (
            <LibraryManager
              library={library}
              onLibraryUpdated={loadLibrary}
              onNavigateSearch={() => setActiveTab('search')}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              library={library}
              onNavigateSearch={() => setActiveTab('search')}
            />
          )}

          {(activeTab === 'insights' || activeTab === 'ai') && (
            <CatalogInsights
              library={library}
              onSelectSearchQuery={() => {}}
              onNavigateSearch={() => setActiveTab('search')}
            />
          )}
        </main>
      </div>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Music Catalog Insights Platform</p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>Entity Focus: Albums</span>
            <span>•</span>
            <span>Spring Boot REST API</span>
            <span>•</span>
            <span>React & Recharts</span>
          </div>
        </div>
      </footer>

      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
